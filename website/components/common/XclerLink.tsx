import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { xcler } from "@/lib/xcler";

type XclerLinkProps = {
  children?: ReactNode;
  className?: string;
};

export function XclerLink({ children = xcler.name, className }: XclerLinkProps) {
  return (
    <a
      href={xcler.url}
      target="_blank"
      rel="noopener"
      className={cn(
        "cursor-pointer font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline",
        className
      )}
    >
      {children}
    </a>
  );
}

type XclerCreditProps = {
  children: ReactNode;
  className?: string;
};

export function XclerCredit({ children, className }: XclerCreditProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-default bg-elevated px-5 py-4 hud-corners",
        className
      )}
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Credits</p>
      <p className="text-sm leading-relaxed text-secondary">{children}</p>
    </div>
  );
}
