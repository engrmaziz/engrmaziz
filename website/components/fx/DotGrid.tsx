"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  color: string;
  alpha: number;
};

type DotGridProps = {
  className?: string;
  gap?: number;
  interactionRadius?: number;
};

const COLORS = ["#2EE6D6", "#7AFFF3", "#E8B86D", "#5eead4"];

export function DotGrid({ className, gap = 56, interactionRadius = 140 }: DotGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = React.useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = React.useRef<Particle[]>([]);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;

    const build = (w: number, h: number): Particle[] => {
      const jitter = gap * 0.45;
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      const particles: Particle[] = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const ox = col * gap + (Math.random() - 0.5) * jitter * 2;
          const oy = row * gap + (Math.random() - 0.5) * jitter * 2;
          particles.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            w: 1.6 + Math.random() * 1.4,
            h: 6 + Math.random() * 8,
            rot: Math.random() * Math.PI * 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#2EE6D6",
            alpha: 0.28 + Math.random() * 0.45,
          });
        }
      }
      return particles;
    };

    const resize = () => {
      const rect = (parent ?? canvas).getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = build(width, height);
    };

    const draw = () => {
      if (!visible || document.hidden) {
        rafRef.current = 0;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active && !reduced;
      const radius2 = interactionRadius * interactionRadius;

      for (const particle of particlesRef.current) {
        if (active) {
          const dx = particle.x - mx;
          const dy = particle.y - my;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < radius2 && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const force = ((interactionRadius - dist) / interactionRadius) ** 2 * 6.2;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }
        }

        particle.vx += (particle.ox - particle.x) * 0.065;
        particle.vy += (particle.oy - particle.y) * 0.065;
        particle.vx *= 0.8;
        particle.vy *= 0.8;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const drawH = particle.h + Math.min(speed * 0.6, 6);

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(speed > 0.5 ? Math.atan2(particle.vy, particle.vx) + Math.PI / 2 : particle.rot);
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        const hw = particle.w / 2;
        const hh = drawH / 2;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(-hw, -hh, particle.w, drawH, hw);
        } else {
          ctx.rect(-hw, -hh, particle.w, drawH);
        }
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      if (!reduced) {
        rafRef.current = window.requestAnimationFrame(draw);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible && !document.hidden && !rafRef.current) {
          rafRef.current = window.requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && visible && !rafRef.current) {
        rafRef.current = window.requestAnimationFrame(draw);
      }
    };

    resize();
    rafRef.current = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      visible = false;
      window.cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [gap, interactionRadius, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
