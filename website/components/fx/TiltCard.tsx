"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

export function TiltCard({ children, className }: TiltCardProps) {
  const reduced = usePrefersReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(rotateX, { stiffness: 200, damping: 18 });
  const ry = useSpring(rotateY, { stiffness: 200, damping: 18 });
  const background = useMotionTemplate`radial-gradient(460px circle at ${glowX}% ${glowY}%, color-mix(in srgb, var(--color-accent) 28%, transparent), color-mix(in srgb, var(--color-gold) 10%, transparent) 38%, transparent 62%)`;
  const borderGlow = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, color-mix(in srgb, var(--color-accent) 90%, white), color-mix(in srgb, var(--color-gold) 70%, transparent) 32%, transparent 58%)`;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -18);
    rotateY.set((px - 0.5) * 20);
    glowX.set(px * 100);
    glowY.set(py * 100);
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <div className="h-full [perspective:1100px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-border-default bg-elevated/80 hud-corners",
          className
        )}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />
        {!reduced ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: borderGlow,
              padding: 1.5,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
            }}
          />
        ) : null}
        <div className="relative z-10 h-full" style={{ transform: "translateZ(28px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
