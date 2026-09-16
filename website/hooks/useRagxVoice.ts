"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceStatus = "idle" | "arming" | "listening" | "transcribing" | "thinking" | "speaking" | "error";

export type VoiceTimings = {
  sttMs: number;
  ragMs: number;
  ttsMs: number;
  totalMs: number;
  ttfaMs: number;
};

type Visitor = { name: string; email: string };

type EventPayload =
  | { type: "transcript"; text: string; sttMs: number }
  | { type: "status"; stage: "rag" | "tts" }
  | { type: "answer"; text: string; ragMs: number }
  | { type: "audio"; mime: string; b64: string; sentenceIndex: number }
  | { type: "tts_fallback"; text: string }
  | { type: "done"; timings: VoiceTimings; modelUsed: string; voice: string }
  | { type: "error"; message: string };

function pickBrowserVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((voice) => /^en(-|_|$)/i.test(voice.lang));
  const pool = english.length ? english : voices;
  const male = pool.find((voice) => /daniel|david|george|guy|fred|james|alex|male|baritone|matthew/i.test(voice.name));
  return male || pool.find((voice) => /en-US/i.test(voice.lang)) || pool[0] || null;
}

async function speakBrowser(text: string, onEnd: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd();
    return;
  }
  await new Promise<void>((resolve) => {
    const ready = window.speechSynthesis.getVoices();
    if (ready.length) {
      resolve();
      return;
    }
    const timer = window.setTimeout(resolve, 600);
    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timer);
      resolve();
    };
  });
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickBrowserVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 0.82;
  utterance.lang = voice?.lang || "en-US";
  utterance.onend = () => onEnd();
  utterance.onerror = () => onEnd();
  window.speechSynthesis.speak(utterance);
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function rmsFromTimeDomain(data: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const sample = data[i] ?? 128;
    const n = (sample - 128) / 128;
    sum += n * n;
  }
  return Math.sqrt(sum / Math.max(data.length, 1));
}

function decodeBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function useRagxVoice(opts: {
  conversationId: string;
  visitorInfo: Visitor | null;
  enabled: boolean;
  identified: boolean;
  sessionEnded: boolean;
  onUserUtterance: (text: string) => void;
  onAssistantUtterance: (text: string, timings?: VoiceTimings) => void;
}) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [timings, setTimings] = useState<VoiceTimings | null>(null);
  const [supported, setSupported] = useState(true);

  const statusRef = useRef<VoiceStatus>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const speechStartedAt = useRef(0);
  const lastLoudAt = useRef(0);
  const playQueueRef = useRef<HTMLAudioElement[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const greetedRef = useRef(false);
  const sendingRef = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const setPhase = (next: VoiceStatus) => {
    statusRef.current = next;
    setStatus(next);
  };

  const stopPlayback = useCallback(() => {
    playQueueRef.current.forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    playQueueRef.current = [];
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const enqueueAudio = useCallback((mime: string, b64: string) => {
    const bytes = decodeBase64(b64);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    const blob = new Blob([copy], { type: mime || "audio/wav" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      playQueueRef.current = playQueueRef.current.filter((item) => item !== audio);
      const next = playQueueRef.current[0];
      if (next) {
        currentAudioRef.current = next;
        void next.play();
      } else {
        currentAudioRef.current = null;
        if (statusRef.current === "speaking") setPhase("idle");
      }
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      playQueueRef.current = playQueueRef.current.filter((item) => item !== audio);
    };
    playQueueRef.current.push(audio);
    if (!currentAudioRef.current) {
      currentAudioRef.current = audio;
      setPhase("speaking");
      void audio.play().catch(() => setPhase("idle"));
    }
  }, []);

  const teardownMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    analyserRef.current = null;
    setLevel(0);
  }, []);

  const parseSse = async (response: Response) => {
    if (!response.body) throw new Error("Voice stream was empty.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";
    let transcript = "";
    let doneTimings: VoiceTimings | undefined;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const part of parts) {
        const line = part.split("\n").find((item) => item.startsWith("data:"));
        if (!line) continue;
        let event: EventPayload;
        try {
          event = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (event.type === "transcript") {
          transcript = event.text;
          setLiveTranscript(event.text);
          if (event.text) optsRef.current.onUserUtterance(event.text);
          setPhase("thinking");
        } else if (event.type === "status") {
          setPhase(event.stage === "tts" ? "speaking" : "thinking");
        } else if (event.type === "answer") {
          answer = event.text;
        } else if (event.type === "audio") {
          enqueueAudio(event.mime, event.b64);
        } else if (event.type === "tts_fallback") {
          setPhase("speaking");
          void speakBrowser(event.text, () => {
            if (statusRef.current === "speaking") setPhase("idle");
          });
        } else if (event.type === "done") {
          doneTimings = event.timings;
          setTimings(event.timings);
          if (answer) optsRef.current.onAssistantUtterance(answer, event.timings);
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    }
    return { answer, transcript, timings: doneTimings };
  };

  const sendClip = useCallback(async (blob: Blob, mimeType: string, greeting = false) => {
    const { conversationId, visitorInfo } = optsRef.current;
    if (!visitorInfo) {
      setError("Identify with name and email before talking to RAGX.");
      setPhase("error");
      return;
    }
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setPhase(greeting ? "speaking" : "transcribing");
    const form = new FormData();
    form.append("conversationId", conversationId);
    form.append("visitorInfo", JSON.stringify({ name: visitorInfo.name, email: visitorInfo.email }));
    if (greeting) form.append("greeting", "1");
    else {
      form.append("audio", blob, mimeType.includes("mp4") ? "turn.m4a" : "turn.webm");
      form.append("mimeType", mimeType);
    }
    const response = await fetch("/api/voice", { method: "POST", body: form, signal: abort.signal });
    if (!response.ok) {
      let message = "Voice request failed.";
      try {
        const data = await response.json();
        message = data?.error?.message || data?.error || message;
      } catch {
        message = await response.text();
      }
      throw new Error(typeof message === "string" ? message : "Voice request failed.");
    }
    await parseSse(response);
  }, [enqueueAudio]);

  const stopAndSend = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || sendingRef.current) return;
    sendingRef.current = true;
    const mime = recorder.mimeType || pickMime();
    const finished = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: mime }));
    });
    if (recorder.state === "recording") recorder.stop();
    teardownMic();
    const blob = await finished;
    chunksRef.current = [];
    try {
      if (!speechStartedAt.current || blob.size < 400) {
        setError("I did not hear speech. Tap the mic and talk.");
        setPhase("idle");
        return;
      }
      await sendClip(blob, mime);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Voice turn failed.");
      setPhase("error");
    } finally {
      sendingRef.current = false;
    }
  }, [sendClip, teardownMic]);

  const watchVad = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      const rms = rmsFromTimeDomain(data);
      setLevel(Math.min(1, rms * 6));
      const now = performance.now();
      const speaking = rms > 0.035;
      if (speaking) {
        if (!speechStartedAt.current) speechStartedAt.current = now;
        lastLoudAt.current = now;
      }
      const heard = speechStartedAt.current > 0;
      const held = heard && now - speechStartedAt.current > 280;
      const silent = heard && now - lastLoudAt.current > 480;
      const tooLong = heard && now - speechStartedAt.current > 8000;
      if (statusRef.current === "listening" && ((held && silent) || tooLong)) {
        void stopAndSend();
        return;
      }
      if (statusRef.current === "speaking" && speaking && rms > 0.08 && now - lastLoudAt.current < 80) {
        stopPlayback();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [stopAndSend, stopPlayback]);

  const startListening = useCallback(async () => {
    if (optsRef.current.sessionEnded) return;
    setError(null);
    setLiveTranscript("");
    stopPlayback();
    abortRef.current?.abort();
    setPhase("arming");
    try {
      const mime = pickMime();
      if (!navigator.mediaDevices?.getUserMedia || !mime) {
        setSupported(false);
        throw new Error("This browser cannot record audio. Use Chrome or Safari.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;
      chunksRef.current = [];
      speechStartedAt.current = 0;
      lastLoudAt.current = 0;
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.start(200);
      setPhase("listening");
      watchVad();
    } catch (err: any) {
      teardownMic();
      setError(err?.message || "Microphone permission is required.");
      setPhase("error");
    }
  }, [stopPlayback, teardownMic, watchVad]);

  const toggle = useCallback(() => {
    if (statusRef.current === "listening") {
      void stopAndSend();
      return;
    }
    if (statusRef.current === "speaking" || statusRef.current === "thinking" || statusRef.current === "transcribing") {
      stopPlayback();
      abortRef.current?.abort();
      void startListening();
      return;
    }
    void startListening();
  }, [startListening, stopAndSend, stopPlayback]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && !!navigator.mediaDevices && typeof MediaRecorder !== "undefined");
  }, []);

  useEffect(() => {
    if (!opts.enabled || !opts.identified || opts.sessionEnded || !opts.visitorInfo) return;
    if (greetedRef.current) return;
    greetedRef.current = true;
    void sendClip(new Blob(), "audio/webm", true).catch((err: any) => {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Could not start voice.");
      setPhase("error");
    });
  }, [opts.enabled, opts.identified, opts.sessionEnded, opts.visitorInfo, sendClip]);

  useEffect(() => {
    if (opts.enabled) return;
    stopPlayback();
    abortRef.current?.abort();
    teardownMic();
    setPhase("idle");
  }, [opts.enabled, stopPlayback, teardownMic]);

  useEffect(() => () => {
    stopPlayback();
    abortRef.current?.abort();
    teardownMic();
    audioCtxRef.current?.close().catch(() => undefined);
  }, [stopPlayback, teardownMic]);

  return {
    status,
    error,
    level,
    liveTranscript,
    timings,
    supported,
    toggle,
    startListening,
    stopAndSend,
  };
}
