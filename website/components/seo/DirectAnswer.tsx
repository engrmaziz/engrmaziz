import type { ReactNode } from "react";
import Link from "next/link";

export function DirectAnswer({
  title = "Direct answer",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      data-speakable="true"
      className="relative max-w-3xl overflow-hidden rounded-2xl border border-accent/30 bg-elevated/70 p-5 backdrop-blur-xl md:p-6 hud-corners"
    >
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="text-copy leading-relaxed text-primary md:text-lg">{children}</div>
    </aside>
  );
}

export function DualHireCtas({
  primaryLabel = "Hire for a project",
  secondaryLabel = "Full-time / recruiting",
}: {
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/contact?intent=freelance"
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[color:var(--color-bg-base)] hover:bg-gold-hover"
      >
        {primaryLabel}
      </Link>
      <Link
        href="/hire#full-time"
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-accent/50 bg-transparent px-5 py-3 text-sm font-medium text-[color:var(--color-accent)] hover:border-accent hover:bg-accent/10"
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
