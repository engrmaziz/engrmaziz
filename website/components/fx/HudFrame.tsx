import * as React from "react";
import { cn } from "@/lib/utils";

type HudFrameProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function HudFrame({ children, className, label }: HudFrameProps) {
  return (
    <div className={cn("relative hud-corners rounded-2xl border border-border-default bg-elevated/70 backdrop-blur-xl", className)}>
      {label ? (
        <div className="absolute -top-3 left-4 z-10 bg-base px-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent sm:tracking-[0.22em]">
      <span className="h-px w-6 bg-accent/70" aria-hidden />
      {children}
    </p>
  );
}
