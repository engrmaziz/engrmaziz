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
  const rx = useSpring(rotateX, { stiffness: 220, damping: 20 });
  const ry = useSpring(rotateY, { stiffness: 220, damping: 20 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 55%)`;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -10);
    rotateY.set((px - 0.5) * 12);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
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
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
