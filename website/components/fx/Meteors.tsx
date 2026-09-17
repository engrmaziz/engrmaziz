"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MeteorsProps = {
  count?: number;
  className?: string;
};

export function Meteors({ count = 14, className }: MeteorsProps) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-accent shadow-[0_0_8px_2px_color-mix(in_srgb,var(--color-accent)_70%,transparent)] motion-safe:animate-meteor"
          style={{
            top: `${(i * 11) % 72}%`,
            left: `${(i * 31 + 9) % 100}%`,
            animationDelay: `${(i * 0.62) % 7}s`,
            animationDuration: `${2.8 + (i % 5) * 0.85}s`,
          }}
        >
          <span className="absolute left-0 top-1/2 h-px w-[72px] -translate-y-1/2 bg-gradient-to-r from-accent via-gold/80 to-transparent" />
        </span>
      ))}
    </div>
  );
}
