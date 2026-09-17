"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  gold: boolean;
};

type ConstellationFieldProps = {
  className?: string;
  density?: number;
  linkDistance?: number;
};

const CYAN = "46, 230, 214";
const GOLD = "232, 184, 109";

export function ConstellationField({
  className,
  density = 11800,
  linkDistance = 128,
}: ConstellationFieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = React.useRef({ x: -9999, y: -9999, active: false });
  const nodesRef = React.useRef<Node[]>([]);
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

    const seed = (w: number, h: number): Node[] => {
      const count = Math.max(28, Math.min(92, Math.floor((w * h) / density)));
      const nodes: Node[] = [];
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r: 1.1 + Math.random() * 1.6,
          gold: i % 5 === 0,
        });
      }
      return nodes;
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
      nodesRef.current = seed(width, height);
    };

    const paint = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active && animate;
      const link2 = linkDistance * linkDistance;
      const pullR = 170;
      const pull2 = pullR * pullR;

      if (animate) {
        for (const node of nodes) {
          if (active) {
            const dx = mx - node.x;
            const dy = my - node.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < pull2 && d2 > 0.5) {
              const dist = Math.sqrt(d2);
              const force = ((pullR - dist) / pullR) * 0.045;
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          }

          node.x += node.vx;
          node.y += node.vy;
          if (node.x < -8) node.x = width + 8;
          if (node.x > width + 8) node.x = -8;
          if (node.y < -8) node.y = height + 8;
          if (node.y > height + 8) node.y = -8;
          node.vx *= 0.994;
          node.vy *= 0.994;
          const speed = Math.hypot(node.vx, node.vy);
          if (speed < 0.08) {
            node.vx += (Math.random() - 0.5) * 0.04;
            node.vy += (Math.random() - 0.5) * 0.04;
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (!a) continue;
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link2) continue;
          const t = 1 - d2 / link2;
          ctx.strokeStyle = `rgba(${a.gold || b.gold ? GOLD : CYAN}, ${0.08 + t * 0.28})`;
          ctx.lineWidth = 0.8 + t;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (active) {
        for (const node of nodes) {
          const dx = node.x - mx;
          const dy = node.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 > pull2) continue;
          const t = 1 - Math.sqrt(d2) / pullR;
          ctx.strokeStyle = `rgba(${CYAN}, ${t * 0.45})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        const dx = node.x - mx;
        const dy = node.y - my;
        const near = active && dx * dx + dy * dy < pull2;
        const rgb = node.gold ? GOLD : CYAN;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${near ? 0.95 : 0.55})`;
        ctx.shadowBlur = near ? 14 : 0;
        ctx.shadowColor = `rgba(${rgb}, 0.85)`;
        ctx.arc(node.x, node.y, near ? node.r + 1.2 : node.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      if (!visible || document.hidden) {
        rafRef.current = 0;
        return;
      }
      paint(!reduced);
      if (!reduced) {
        rafRef.current = window.requestAnimationFrame(draw);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
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
  }, [density, linkDistance, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
