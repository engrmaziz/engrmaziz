"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { VoiceStatus } from "@/hooks/useRagxVoice";

type Speaker = "user" | "assistant" | "thinking" | "idle";

function speakerOf(status: VoiceStatus, level: number): Speaker {
  if (status === "speaking") return "assistant";
  if (status === "transcribing" || status === "thinking") return "thinking";
  if (status === "listening" || status === "arming") return level > 0.16 ? "user" : "idle";
  return "idle";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgba(rgb: [number, number, number], a: number) {
  return `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${a})`;
}

const CYAN: [number, number, number] = [46, 230, 214];
const CYAN_HI: [number, number, number] = [125, 249, 255];
const GOLD: [number, number, number] = [232, 184, 109];
const GOLD_HI: [number, number, number] = [245, 211, 138];

export function MorphingWaveform(props: {
  status: VoiceStatus;
  live: boolean;
  spectrumRef: MutableRefObject<Float32Array>;
  levelRef: MutableRefObject<number>;
  reducedMotion?: boolean;
}) {
  const { status, live, spectrumRef, levelRef, reducedMotion } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(status);
  const liveRef = useRef(live);
  statusRef.current = status;
  liveRef.current = live;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const mix = { user: 1, assistant: 0, thinking: 0 };
    const parent = canvas.parentElement;

    const resize = () => {
      const rect = (parent ?? canvas).getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (stamp: number) => {
      if (!running) return;
      const rect = (parent ?? canvas).getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 2 || h < 2) {
        raf = window.requestAnimationFrame(draw);
        return;
      }

      const t = reducedMotion ? 0 : stamp / 1000;
      const phase = statusRef.current;
      const isLive = liveRef.current;
      const spectrum = spectrumRef.current;
      const micLevel = isLive ? levelRef.current : 0.14;
      const who = speakerOf(phase, micLevel);

      const target = {
        user: who === "user" ? 1 : who === "idle" && (phase === "listening" || phase === "arming") ? 0.55 : 0.12,
        assistant: who === "assistant" ? 1 : 0,
        thinking: who === "thinking" ? 1 : 0,
      };
      const ease = reducedMotion ? 1 : 0.08;
      mix.user = lerp(mix.user, target.user, ease);
      mix.assistant = lerp(mix.assistant, target.assistant, ease);
      mix.thinking = lerp(mix.thinking, target.thinking, ease);

      const energy = reducedMotion
        ? who === "idle"
          ? 0.12
          : 0.28
        : Math.min(1, Math.max(0.1, micLevel));
      const spread = lerp(0.42, 1, mix.assistant * 0.7 + energy * 0.45);

      ctx.clearRect(0, 0, w, h);

      const a = mixRgb(CYAN, GOLD, mix.assistant * 0.92 + mix.thinking * 0.45);
      const b = mixRgb(CYAN_HI, GOLD_HI, mix.assistant * 0.92 + mix.thinking * 0.35);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const blobR = Math.min(w, h) * (0.22 + energy * 0.1);

      const glow = ctx.createRadialGradient(cx, cy, blobR * 0.12, cx, cy, Math.max(w, h) * 0.55);
      glow.addColorStop(0, rgba(a, 0.22 + energy * 0.18));
      glow.addColorStop(0.45, rgba(b, 0.08));
      glow.addColorStop(1, "rgba(6,9,15,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const blobs = reducedMotion ? 2 : 5;
      for (let i = 0; i < blobs; i++) {
        const ang = t * (0.35 + i * 0.09) + i * 1.25;
        const dist = blobR * (0.18 + energy * 0.55) * (0.55 + 0.45 * Math.sin(t * 0.85 + i));
        const x = cx + Math.cos(ang) * dist * spread;
        const y = cy + Math.sin(ang * 1.18) * dist * 0.52;
        const rx = blobR * (0.72 + 0.28 * Math.sin(t * 1.15 + i * 1.7)) * (0.85 + energy * 0.4);
        const ry = rx * (0.62 + mix.assistant * 0.12);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
        const tone = i % 2 === 0 ? a : b;
        g.addColorStop(0, rgba(tone, 0.42 + energy * 0.28));
        g.addColorStop(0.42, rgba(tone, 0.16));
        g.addColorStop(1, rgba(tone, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, ang * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const layers = [
        { amp: 34 + energy * 58, freq: 0.085, phase: 0, width: 2.4, alpha: 0.95 },
        { amp: 22 + energy * 38, freq: 0.13, phase: 1.7, width: 1.7, alpha: 0.55 },
        { amp: 14 + energy * 26, freq: 0.19, phase: 3.1, width: 1.2, alpha: 0.32 },
      ];
      const points = 96;
      const waveW = w * (0.78 + spread * 0.14);
      const x0 = (w - waveW) / 2;

      layers.forEach((layer, li) => {
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const u = i / points;
          const x = x0 + u * waveW;
          const bin = spectrum[Math.min(spectrum.length - 1, Math.floor(u * (spectrum.length - 1)))] || 0;
          const motion = 0.18 + 0.16 * Math.sin(t * 1.55 + u * 6 + li);
          const local = reducedMotion
            ? layer.amp * 0.22
            : layer.amp * (0.22 + energy * 0.55 + (bin > 0.03 ? bin : motion) * 0.85);
          const y =
            cy +
            Math.sin(u * Math.PI * 2 * (2.2 + layer.freq * 8) + t * (1.8 + li * 0.35) + layer.phase) * local +
            Math.sin(u * Math.PI * 6 + t * 1.1 + layer.phase) * local * 0.28 +
            Math.sin(t * 0.7 + u * 4 + li) * layer.amp * 0.08 * energy;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (li === 0) {
          ctx.save();
          ctx.lineTo(x0 + waveW, h);
          ctx.lineTo(x0, h);
          ctx.closePath();
          const fill = ctx.createLinearGradient(cx, cy - 80, cx, h);
          fill.addColorStop(0, rgba(a, 0.18 + energy * 0.12));
          fill.addColorStop(1, "rgba(6,9,15,0)");
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.restore();
        }

        const stroke = ctx.createLinearGradient(x0, cy, x0 + waveW, cy);
        stroke.addColorStop(0, rgba(a, 0));
        stroke.addColorStop(0.22, rgba(a, layer.alpha));
        stroke.addColorStop(0.5, rgba(b, layer.alpha));
        stroke.addColorStop(0.78, rgba(a, layer.alpha));
        stroke.addColorStop(1, rgba(a, 0));
        ctx.strokeStyle = stroke;
        ctx.lineWidth = layer.width;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.shadowColor = rgba(who === "assistant" ? GOLD : CYAN, 0.55);
        ctx.shadowBlur = reducedMotion ? 0 : 18 + energy * 16;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.beginPath();
      ctx.strokeStyle = rgba(a, 0.22 + energy * 0.2);
      ctx.lineWidth = 1.25;
      ctx.ellipse(cx, cy, blobR * (1.55 + energy * 0.35) * spread, blobR * (0.92 + energy * 0.18), 0, 0, Math.PI * 2);
      ctx.stroke();

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    raf = window.requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);
    else ro.observe(canvas);

    const onVis = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
        return;
      }
      raf = window.requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [levelRef, reducedMotion, spectrumRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
