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

export function BorderBeam({ children, className, radius = 16, thickness = 1.5 }: BorderBeamProps) {
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
              "conic-gradient(from var(--beam-angle, 0deg), transparent 0deg, color-mix(in srgb, var(--color-accent) 8%, transparent) 40deg, var(--color-accent) 58deg, color-mix(in srgb, var(--color-gold) 80%, white) 62deg, transparent 70deg, transparent 198deg, color-mix(in srgb, var(--color-gold) 10%, transparent) 230deg, var(--color-gold) 255deg, transparent 270deg, transparent 360deg)",
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
