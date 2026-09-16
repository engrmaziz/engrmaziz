"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Variant = "rag" | "voice";

type ProjectFlowProps = {
  variant: Variant;
  className?: string;
};

export function ProjectFlow({ variant, className }: ProjectFlowProps) {
  const reduced = usePrefersReducedMotion();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const run = active && !reduced;

  return (
    <div
      ref={hostRef}
      className={cn("relative h-[220px] w-full overflow-hidden sm:h-[260px] md:h-[300px]", className)}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_58%)]" />
      {variant === "rag" ? <RagFlow run={run} /> : <VoiceFlow run={run} />}
    </div>
  );
}

function RagFlow({ run }: { run: boolean }) {
  return (
    <svg viewBox="0 0 520 300" className="absolute inset-0 h-full w-full" fill="none">
      <defs>
        <linearGradient id="ragLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <path d="M70 86 H210" stroke="url(#ragLine)" strokeWidth="1.5" />
      <path d="M250 86 H390" stroke="url(#ragLine)" strokeWidth="1.5" />
      <path d="M430 110 V168" stroke="url(#ragLine)" strokeWidth="1.5" />
      <path d="M390 192 H250" stroke="url(#ragLine)" strokeWidth="1.5" />
      <path d="M210 192 H90 V118" stroke="url(#ragLine)" strokeWidth="1.5" />
      <path d="M430 86 H470" stroke="url(#ragLine)" strokeWidth="1.5" />

      <Node x={70} y={86} label="QUERY" sub="ask" />
      <Node x={230} y={86} label="QDRANT" sub="top-k" />
      <Node x={430} y={86} label="GRADE" sub="firewall" />
      <Node x={230} y={192} label="REWRITE" sub="heal loop" warn />
      <Node x={470} y={86} label="GROQ" sub="llama 3.1" gold />

      {run ? (
        <>
          <Packet path="M70 86 H210" delay="0s" />
          <Packet path="M250 86 H390" delay="0.7s" />
          <Packet path="M430 110 V168" delay="1.4s" />
          <Packet path="M390 192 H250" delay="2s" color="gold" />
          <Packet path="M210 192 H90 V118" delay="2.6s" color="gold" />
        </>
      ) : null}

      <text x="26" y="278" className="fill-current" fill="currentColor" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2.4" opacity="0.55">
        CRAG // CONFIDENCE FIREWALL
      </text>
    </svg>
  );
}

function VoiceFlow({ run }: { run: boolean }) {
  return (
    <svg viewBox="0 0 520 300" className="absolute inset-0 h-full w-full" fill="none">
      <defs>
        <linearGradient id="voiceLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <path d="M64 150 H150" stroke="url(#voiceLine)" strokeWidth="1.5" />
      <path d="M190 150 H276" stroke="url(#voiceLine)" strokeWidth="1.5" />
      <path d="M316 150 H402" stroke="url(#voiceLine)" strokeWidth="1.5" />
      <path d="M442 150 H500" stroke="url(#voiceLine)" strokeWidth="1.5" />
      <path d="M296 184 V232 H224 V184" stroke="url(#voiceLine)" strokeWidth="1.2" opacity="0.7" />

      <Waveform x={64} y={92} run={run} />

      <Node x={64} y={150} label="CALL" sub="audio" gold />
      <Node x={170} y={150} label="WHISPER" sub="stt" />
      <Node x={296} y={150} label="GRAPH" sub="langgraph" />
      <Node x={422} y={150} label="GROQ" sub="stream" gold />
      <Node x={296} y={232} label="PINECONE" sub="hybrid rag" />

      {run ? (
        <>
          <Packet path="M64 150 H150" delay="0s" color="gold" />
          <Packet path="M190 150 H276" delay="0.6s" />
          <Packet path="M316 150 H402" delay="1.2s" color="gold" />
          <Packet path="M296 184 V232" delay="1.8s" />
          <Packet path="M224 232 V184" delay="2.4s" />
        </>
      ) : null}

      <text x="26" y="278" className="fill-current" fill="currentColor" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2.4" opacity="0.55">
        VOICE // SUB-500MS STREAM
      </text>
    </svg>
  );
}

function Node({
  x,
  y,
  label,
  sub,
  gold,
  warn,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  gold?: boolean;
  warn?: boolean;
}) {
  const stroke = warn ? "var(--color-gold)" : gold ? "var(--color-gold)" : "var(--color-accent)";
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-40" y="-22" width="80" height="44" rx="8" fill="var(--color-bg-elevated)" stroke={stroke} strokeOpacity="0.55" />
      <text textAnchor="middle" y="-2" fill="var(--color-text-primary)" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="1.6" fontWeight="700">
        {label}
      </text>
      <text textAnchor="middle" y="12" fill="var(--color-text-secondary)" fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing="1.2">
        {sub}
      </text>
    </g>
  );
}

function Packet({ path, delay, color = "accent" }: { path: string; delay: string; color?: "accent" | "gold" }) {
  const fill = color === "gold" ? "var(--color-gold)" : "var(--color-accent)";
  return (
    <circle r="4" fill={fill}>
      <animateMotion dur="3.2s" repeatCount="indefinite" begin={delay} path={path} />
    </circle>
  );
}

function Waveform({ x, y, run }: { x: number; y: number; run: boolean }) {
  const bars = [8, 16, 24, 14, 28, 12, 20, 10, 22, 18];
  return (
    <g transform={`translate(${x - 36}, ${y})`}>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 8}
          y={-h / 2}
          width="3"
          height={h}
          rx="1"
          fill="var(--color-gold)"
          opacity="0.75"
          style={{ transformOrigin: `${i * 8 + 1.5}px 0px` }}
        >
          {run ? (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1 1; 1 0.42; 1 1"
              dur={`${0.7 + (i % 4) * 0.18}s`}
              repeatCount="indefinite"
              begin={`${i * 0.08}s`}
              additive="sum"
            />
          ) : null}
        </rect>
      ))}
    </g>
  );
}
