"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type DotGridProps = {
  className?: string;
  gap?: number;
  radius?: number;
};

export function DotGrid({ className, gap = 28, radius = 1.15 }: DotGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const pointer = React.useRef({ x: -9999, y: -9999 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let running = true;
    const parent = canvas.parentElement;

    const resize = () => {
      const rect = (parent ?? canvas).getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      const rect = (parent ?? canvas).getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue("--color-accent").trim() || "#2EE6D6";
      const muted = style.getPropertyValue("--color-border-default").trim() || "rgba(46,230,214,0.2)";

      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - pointer.current.x;
          const dy = y - pointer.current.y;
          const dist = Math.hypot(dx, dy);
          const influence = reduced ? 0 : Math.max(0, 1 - dist / 180);
          const r = radius + influence * 2.4;
          ctx.beginPath();
          ctx.fillStyle = influence > 0.08 ? accent : muted;
          ctx.globalAlpha = 0.28 + influence * 0.72;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const target = parent ?? canvas;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [gap, radius, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
    />
  );
}
