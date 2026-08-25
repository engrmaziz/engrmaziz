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
      className="rounded-xl border border-accent/30 bg-accent/5 p-5 md:p-6 max-w-3xl"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{title}</p>
      <div className="text-base md:text-lg text-primary leading-relaxed">{children}</div>
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
        className="inline-flex items-center justify-center rounded-sm font-semibold px-5 py-3 bg-accent text-[color:var(--color-bg-base)] hover:bg-accent-hover text-sm"
      >
        {primaryLabel}
      </Link>
      <Link
        href="/hire#full-time"
        className="inline-flex items-center justify-center rounded-sm font-medium px-5 py-3 border border-border-default bg-elevated text-primary hover:border-accent/50 text-sm"
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
