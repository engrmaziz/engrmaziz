"use client";

import { Mic, PhoneOff } from "lucide-react";
import type { MutableRefObject } from "react";
import type { VoiceStatus, VoiceTimings } from "@/hooks/useRagxVoice";
import { MorphingWaveform } from "@/components/rag/MorphingWaveform";

const STATUS_COPY: Record<VoiceStatus, string> = {
  idle: "TAP TO START CALL",
  arming: "CONNECTING",
  listening: "LISTENING",
  transcribing: "HEARING YOU",
  thinking: "THINKING",
  speaking: "RAGX SPEAKING",
  error: "TAP TO RETRY",
};

function speakerLabel(status: VoiceStatus, live: boolean, level: number) {
  if (!live) return "READY";
  if (status === "speaking") return "RAGX";
  if (status === "transcribing" || status === "thinking") return "RAGX";
  if ((status === "listening" || status === "arming") && level > 0.16) return "YOU";
  if (status === "listening" || status === "arming") return "LISTEN";
  return "LIVE";
}

export function RAGXVoiceHud(props: {
  status: VoiceStatus;
  error: string | null;
  level: number;
  liveTranscript: string;
  timings: VoiceTimings | null;
  supported: boolean;
  sessionLive?: boolean;
  disabled?: boolean;
  reducedMotion?: boolean;
  spectrumRef: MutableRefObject<Float32Array>;
  levelRef: MutableRefObject<number>;
  onToggle: () => void;
}) {
  const {
    status,
    error,
    level,
    liveTranscript,
    timings,
    supported,
    sessionLive,
    disabled,
    reducedMotion,
    spectrumRef,
    levelRef,
    onToggle,
  } = props;
  const live = Boolean(sessionLive) && status !== "error";
  const speakingUser = live && (status === "listening" || status === "arming") && level > 0.16;
  const speakingAi = live && status === "speaking";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        <div className="relative h-[min(52vh,360px)] w-full max-w-[420px] sm:h-[300px]">
          <MorphingWaveform
            status={status}
            live={live}
            spectrumRef={spectrumRef}
            levelRef={levelRef}
            reducedMotion={Boolean(reducedMotion)}
          />
          {!live ? (
            <button
              type="button"
              onClick={onToggle}
              disabled={disabled || !supported}
              aria-label="Start RAGX call"
              className="cursor-pointer absolute inset-0 z-10 rounded-[32px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EE6D6]"
            />
          ) : null}
        </div>

        <p
          className={`mt-1 font-mono text-[10px] tracking-[0.32em] ${
            speakingAi ? "text-[#E8B86D]" : speakingUser ? "text-[#2EE6D6]" : "text-[#8B9BB4]"
          }`}
          aria-live="polite"
        >
          {speakerLabel(status, live, level)} · {STATUS_COPY[status]}
        </p>

        {liveTranscript && live ? (
          <p className="mt-3 max-w-[340px] text-center text-[13px] leading-relaxed text-[#E8EEF7]">{liveTranscript}</p>
        ) : (
          <p className="mt-3 max-w-[340px] text-center text-[13px] leading-relaxed text-[#8B9BB4]">
            {live
              ? speakingAi
                ? "RAGX is talking. Interrupt anytime."
                : speakingUser
                  ? "Hearing you."
                  : "Talk like a call. Interrupt anytime."
              : "One tap starts a live call. The waveform follows you, then RAGX."}
          </p>
        )}
        {error ? <p className="mt-2 max-w-[340px] text-center text-[11px] text-red-400">{error}</p> : null}
        {timings && live ? (
          <p className="mt-2 font-mono text-[10px] text-[#8B9BB4]">
            TTFA {Math.round(timings.ttfaMs)}ms · STT {Math.round(timings.sttMs)}ms · RAG {Math.round(timings.ragMs)}ms
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-2 px-4 pb-3 pt-1">
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled || !supported}
          aria-label={live ? "End RAGX call" : "Start RAGX call"}
          aria-pressed={live}
          className={`cursor-pointer relative flex h-14 w-14 items-center justify-center rounded-full border min-h-11 min-w-11 disabled:opacity-40 ${
            live
              ? "border-[#E8B86D] bg-[#E8B86D] text-[#06090F] shadow-[0_0_28px_rgba(232,184,109,0.35)]"
              : "border-[#2EE6D6]/50 bg-[#06090F] text-[#2EE6D6] hover:border-[#E8B86D] hover:text-[#E8B86D]"
          }`}
        >
          {live ? <PhoneOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
