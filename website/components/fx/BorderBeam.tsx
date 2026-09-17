"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type BorderBeamProps = {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  thickness?: number;
};

export function BorderBeam({ children, className, radius = 16, thickness = 2 }: BorderBeamProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn("relative isolate", className)}
      style={{ borderRadius: radius }}
    >
      {!reduced ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-1px] motion-safe:animate-beam-spin"
          style={{
            borderRadius: radius,
            padding: thickness,
            background:
              "conic-gradient(from var(--beam-angle, 0deg), transparent 0deg, color-mix(in srgb, var(--color-accent) 18%, transparent) 28deg, var(--color-accent) 50deg, color-mix(in srgb, var(--color-gold) 90%, white) 58deg, transparent 72deg, transparent 186deg, color-mix(in srgb, var(--color-gold) 22%, transparent) 214deg, var(--color-gold) 242deg, transparent 268deg, transparent 360deg)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          }}
        />
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
