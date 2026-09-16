"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceStatus = "idle" | "arming" | "listening" | "transcribing" | "thinking" | "speaking" | "error";

export const VOICE_SPECTRUM_BINS = 64;

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

const LISTEN_RMS = 0.038;
const MIN_SPEECH_MS = 340;
const SILENCE_MS = 720;
const MAX_UTTERANCE_MS = 14000;
const BARGE_RMS = 0.12;
const BARGE_HOLD_MS = 260;
const PLAYBACK_GUARD_MS = 450;
const POST_SPEAK_GAP_MS = 380;

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

function downsampleSpectrum(src: Uint8Array, dest: Float32Array) {
  const n = dest.length;
  const usable = Math.max(8, Math.floor(src.length * 0.42));
  for (let i = 0; i < n; i++) {
    const start = Math.floor((i / n) * usable);
    const end = Math.max(start + 1, Math.floor(((i + 1) / n) * usable));
    let sum = 0;
    for (let j = start; j < end; j++) sum += src[j] ?? 0;
    dest[i] = sum / ((end - start) * 255);
  }
}

function synthSpeechSpectrum(dest: Float32Array, t: number, energy: number) {
  for (let i = 0; i < dest.length; i++) {
    const fall = 1 - (i / dest.length) * 0.4;
    const env = 0.4 + 0.6 * Math.abs(Math.sin(t * 6.4 + i * 0.31));
    const syll = Math.max(0, Math.sin(t * 8.1) * 0.72 + Math.sin(t * 3.05 + 0.5) * 0.4);
    dest[i] = Math.min(1, energy * env * (0.22 + syll * 0.88) * fall);
  }
}

function synthIdleSpectrum(dest: Float32Array, t: number, energy: number) {
  for (let i = 0; i < dest.length; i++) {
    dest[i] = energy * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.22)));
  }
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
  const [sessionLive, setSessionLive] = useState(false);

  const statusRef = useRef<VoiceStatus>("idle");
  const sessionLiveRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const spectrumRef = useRef(new Float32Array(VOICE_SPECTRUM_BINS));
  const levelRef = useRef(0);
  const micTimeRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const micFreqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const lastLevelUi = useRef(0);
  const rafRef = useRef<number>(0);
  const speechStartedAt = useRef(0);
  const lastLoudAt = useRef(0);
  const bargeStartedAt = useRef(0);
  const playbackGuardUntil = useRef(0);
  const listenGuardUntil = useRef(0);
  const playQueueRef = useRef<HTMLAudioElement[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const turnIdRef = useRef(0);
  const mimeRef = useRef("");
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

  const stopRecorder = useCallback(() => {
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state === "recording") {
      try {
        recorder.stop();
      } catch {
        // already stopped
      }
    }
  }, []);

  const releaseCall = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    stopRecorder();
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    chunksRef.current = [];
    speechStartedAt.current = 0;
    lastLoudAt.current = 0;
    bargeStartedAt.current = 0;
    spectrumRef.current.fill(0);
    levelRef.current = 0;
    setLevel(0);
  }, [stopRecorder]);

  const playbackBusy = () =>
    Boolean(currentAudioRef.current || playQueueRef.current.length || (typeof window !== "undefined" && window.speechSynthesis?.speaking));

  const resumeListenRef = useRef<() => void>(() => undefined);
  const captureTurnRef = useRef<() => void>(() => undefined);
  const maybeResumeRef = useRef<() => void>(() => undefined);

  const maybeResumeListen = useCallback(() => {
    window.setTimeout(() => {
      if (!sessionLiveRef.current) return;
      if (sendingRef.current) return;
      if (playbackBusy()) return;
      const phase = statusRef.current;
      if (phase === "listening" || phase === "arming") return;
      listenGuardUntil.current = performance.now() + 420;
      resumeListenRef.current();
    }, POST_SPEAK_GAP_MS);
  }, []);

  maybeResumeRef.current = maybeResumeListen;

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
        playbackGuardUntil.current = performance.now() + PLAYBACK_GUARD_MS;
        void next.play();
      } else {
        currentAudioRef.current = null;
        maybeResumeRef.current();
      }
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      playQueueRef.current = playQueueRef.current.filter((item) => item !== audio);
      if (!playQueueRef.current.length) {
        currentAudioRef.current = null;
        maybeResumeRef.current();
      }
    };
    playQueueRef.current.push(audio);
    if (!currentAudioRef.current) {
      currentAudioRef.current = audio;
      setPhase("speaking");
      playbackGuardUntil.current = performance.now() + PLAYBACK_GUARD_MS;
      void audio.play().catch(() => maybeResumeRef.current());
    }
  }, []);

  const parseSse = async (response: Response, turnId: number) => {
    if (!response.body) throw new Error("Voice stream was empty.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";
    let doneTimings: VoiceTimings | undefined;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (turnId !== turnIdRef.current) {
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
        return { stale: true, answer: "", timings: undefined };
      }
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
        if (turnId !== turnIdRef.current) return { stale: true, answer: "", timings: undefined };
        if (event.type === "transcript") {
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
          playbackGuardUntil.current = performance.now() + PLAYBACK_GUARD_MS;
          void speakBrowser(event.text, () => maybeResumeRef.current());
        } else if (event.type === "done") {
          doneTimings = event.timings;
          setTimings(event.timings);
          if (answer) optsRef.current.onAssistantUtterance(answer, event.timings);
          try {
            const payload = {
              ...event.timings,
              voice: event.voice,
              model: event.modelUsed,
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem("ragx_voice_telemetry", JSON.stringify(payload));
            window.dispatchEvent(new Event("ragx-voice-telemetry"));
          } catch {
            // ignore storage
          }
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    }
    return { stale: false, answer, timings: doneTimings };
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
    const turnId = ++turnIdRef.current;
    setPhase(greeting ? "speaking" : "transcribing");
    const form = new FormData();
    form.append("conversationId", conversationId);
    form.append("visitorInfo", JSON.stringify({ name: visitorInfo.name, email: visitorInfo.email }));
    if (greeting) form.append("greeting", "1");
    else {
      form.append("audio", blob, mimeType.includes("mp4") ? "turn.m4a" : "turn.webm");
      form.append("mimeType", mimeType);
    }
    try {
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
      const result = await parseSse(response, turnId);
      if (result.stale) return;
      if (!playbackBusy() && statusRef.current !== "speaking") maybeResumeRef.current();
    } catch (err: any) {
      if (err?.name === "AbortError" || turnId !== turnIdRef.current) return;
      throw err;
    }
  }, [enqueueAudio]);

  const armRecorder = useCallback(() => {
    const stream = streamRef.current;
    const mime = mimeRef.current || pickMime();
    if (!stream || !mime) return;
    stopRecorder();
    chunksRef.current = [];
    speechStartedAt.current = 0;
    lastLoudAt.current = 0;
    bargeStartedAt.current = 0;
    const recorder = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.start(200);
    setPhase("listening");
    setError(null);
  }, [stopRecorder]);

  resumeListenRef.current = () => {
    if (!sessionLiveRef.current || !streamRef.current) return;
    if (recorderRef.current?.state === "recording") {
      setPhase("listening");
      return;
    }
    armRecorder();
  };

  const captureTurn = useCallback(async () => {
    if (!sessionLiveRef.current || sendingRef.current) return;
    const recorder = recorderRef.current;
    if (!recorder) {
      armRecorder();
      return;
    }
    if (!speechStartedAt.current) {
      chunksRef.current = [];
      return;
    }
    sendingRef.current = true;
    const mime = recorder.mimeType || mimeRef.current || pickMime();
    const finished = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: mime }));
    });
    stopRecorder();
    const blob = await finished;
    chunksRef.current = [];
    try {
      if (blob.size < 400) {
        armRecorder();
        return;
      }
      await sendClip(blob, mime);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Voice turn failed.");
      setPhase("error");
      if (sessionLiveRef.current) armRecorder();
    } finally {
      sendingRef.current = false;
    }
  }, [armRecorder, sendClip, stopRecorder]);

  captureTurnRef.current = () => {
    void captureTurn();
  };

  const interruptAndListen = useCallback(() => {
    turnIdRef.current += 1;
    abortRef.current?.abort();
    stopPlayback();
    sendingRef.current = false;
    if (recorderRef.current?.state === "recording") return;
    speechStartedAt.current = performance.now();
    lastLoudAt.current = performance.now();
    armRecorder();
  }, [armRecorder, stopPlayback]);

  const watchVad = useCallback(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const analyser = analyserRef.current;
      if (!analyser || !sessionLiveRef.current) return;
      const data = micTimeRef.current ?? new Uint8Array(analyser.fftSize);
      micTimeRef.current = data;
      analyser.getByteTimeDomainData(data);
      const rms = rmsFromTimeDomain(data);
      const now = performance.now();
      const phase = statusRef.current;
      const t = now / 1000;
      const visual = spectrumRef.current;
      if (phase === "speaking") {
        synthSpeechSpectrum(visual, t, 0.88);
        levelRef.current = 0.58 + 0.34 * Math.abs(Math.sin(t * 7.4));
      } else if (phase === "listening" || phase === "arming") {
        const freq = micFreqRef.current ?? new Uint8Array(analyser.frequencyBinCount);
        micFreqRef.current = freq;
        analyser.getByteFrequencyData(freq);
        downsampleSpectrum(freq, visual);
        levelRef.current = Math.min(1, Math.max(0.14, rms * 6));
      } else if (phase === "thinking" || phase === "transcribing") {
        synthIdleSpectrum(visual, t, 0.34);
        levelRef.current = 0.24;
      } else {
        synthIdleSpectrum(visual, t, 0.12);
        levelRef.current = 0.1;
      }
      if (now - lastLevelUi.current > 48) {
        lastLevelUi.current = now;
        setLevel(levelRef.current);
      }
      const loud = rms > LISTEN_RMS;

      if (phase === "listening") {
        if (now < listenGuardUntil.current) return;
        if (loud) {
          if (!speechStartedAt.current) speechStartedAt.current = now;
          lastLoudAt.current = now;
        }
        const heard = speechStartedAt.current > 0;
        const held = heard && now - speechStartedAt.current > MIN_SPEECH_MS;
        const silent = heard && now - lastLoudAt.current > SILENCE_MS;
        const tooLong = heard && now - speechStartedAt.current > MAX_UTTERANCE_MS;
        if ((held && silent) || tooLong) captureTurnRef.current();
        return;
      }

      if ((phase === "speaking" || phase === "thinking") && now > playbackGuardUntil.current) {
        if (rms > BARGE_RMS) {
          if (!bargeStartedAt.current) bargeStartedAt.current = now;
          if (now - bargeStartedAt.current > BARGE_HOLD_MS) interruptAndListen();
        } else {
          bargeStartedAt.current = 0;
        }
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [interruptAndListen]);

  const endSession = useCallback(() => {
    sessionLiveRef.current = false;
    setSessionLive(false);
    turnIdRef.current += 1;
    abortRef.current?.abort();
    stopPlayback();
    sendingRef.current = false;
    releaseCall();
    setLiveTranscript("");
    setPhase("idle");
  }, [releaseCall, stopPlayback]);

  const startSession = useCallback(async () => {
    if (optsRef.current.sessionEnded) return;
    setError(null);
    setLiveTranscript("");
    stopPlayback();
    setPhase("arming");
    try {
      const mime = pickMime();
      if (!navigator.mediaDevices?.getUserMedia || !mime) {
        setSupported(false);
        throw new Error("This browser cannot record audio. Use Chrome or Safari.");
      }
      mimeRef.current = mime;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.68;
      source.connect(analyser);
      analyserRef.current = analyser;
      micTimeRef.current = new Uint8Array(analyser.fftSize);
      micFreqRef.current = new Uint8Array(analyser.frequencyBinCount);
      sessionLiveRef.current = true;
      setSessionLive(true);
      watchVad();
      sendingRef.current = true;
      try {
        await sendClip(new Blob(), mime, true);
      } finally {
        sendingRef.current = false;
      }
    } catch (err: any) {
      sessionLiveRef.current = false;
      setSessionLive(false);
      releaseCall();
      setError(err?.message || "Microphone permission is required.");
      setPhase("error");
    }
  }, [releaseCall, sendClip, stopPlayback, watchVad]);

  const toggle = useCallback(() => {
    if (sessionLiveRef.current) {
      endSession();
      return;
    }
    void startSession();
  }, [endSession, startSession]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && !!navigator.mediaDevices && typeof MediaRecorder !== "undefined");
  }, []);

  useEffect(() => {
    if (opts.enabled && !opts.sessionEnded) return;
    if (sessionLiveRef.current) endSession();
  }, [opts.enabled, opts.sessionEnded, endSession]);

  useEffect(() => () => {
    sessionLiveRef.current = false;
    abortRef.current?.abort();
    stopPlayback();
    releaseCall();
    audioCtxRef.current?.close().catch(() => undefined);
  }, [releaseCall, stopPlayback]);

  return {
    status,
    error,
    level,
    liveTranscript,
    timings,
    supported,
    sessionLive,
    spectrumRef,
    levelRef,
    toggle,
  };
}
