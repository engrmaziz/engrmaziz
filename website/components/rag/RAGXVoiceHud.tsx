"use client";

import { Mic, PhoneOff } from "lucide-react";
import type { VoiceStatus, VoiceTimings } from "@/hooks/useRagxVoice";

const STATUS_COPY: Record<VoiceStatus, string> = {
  idle: "TAP TO START CALL",
  arming: "CONNECTING",
  listening: "LISTENING",
  transcribing: "HEARING YOU",
  thinking: "THINKING",
  speaking: "RAGX SPEAKING",
  error: "TAP TO RETRY",
};

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
    onToggle,
  } = props;
  const live = Boolean(sessionLive) && status !== "error";
  const listening = status === "listening" || status === "arming";
  const busy = status === "transcribing" || status === "thinking" || status === "speaking";

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled || !supported}
        aria-label={live ? "End RAGX call" : "Start RAGX call"}
        aria-pressed={live}
        className={`cursor-pointer relative flex h-16 w-16 items-center justify-center rounded-full border transition-transform min-h-11 min-w-11 disabled:opacity-40 ${
          live
            ? "border-[#C9A227] bg-[#C9A227] text-[#050a14] shadow-[0_0_28px_rgba(201,162,39,0.35)]"
            : "border-[#00D4FF]/50 bg-[#050a14] text-[#7DF9FF] hover:border-[#C9A227] hover:text-[#C9A227]"
        }`}
      >
        {listening && !reducedMotion ? (
          <span
            className="absolute inset-0 rounded-full border border-[#050a14]/35"
            style={{ transform: `scale(${1 + Math.min(level, 1) * 0.28})`, opacity: 0.7 }}
          />
        ) : null}
        {live ? <PhoneOff className="relative z-10 h-6 w-6" /> : <Mic className="relative z-10 h-6 w-6" />}
      </button>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-mono text-[10px] tracking-[0.22em] text-[#8BA0B5]">{STATUS_COPY[status]}</p>
        {liveTranscript && live ? (
          <p className="max-w-[320px] text-[12px] leading-relaxed text-[#E8F4FF]">{liveTranscript}</p>
        ) : (
          <p className="max-w-[320px] text-[12px] leading-relaxed text-[#8BA0B5]">
            {live
              ? "Talk like a call. Interrupt anytime. Tap to hang up."
              : "One tap starts a live call with RAGX, Musharraf's assistant."}
          </p>
        )}
        {error ? <p className="max-w-[320px] text-[11px] text-red-400">{error}</p> : null}
        {timings && status === "listening" ? (
          <p className="font-mono text-[10px] text-[#8BA0B5]">
            TTFA {Math.round(timings.ttfaMs)}ms · STT {Math.round(timings.sttMs)}ms · RAG {Math.round(timings.ragMs)}ms
          </p>
        ) : null}
      </div>
      {live && busy ? (
        <div className="flex items-end gap-1 h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-[#00D4FF]"
              style={{
                height: reducedMotion ? "10px" : "8px",
                animation: reducedMotion ? undefined : "ragxEq 0.85s ease-in-out infinite",
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
