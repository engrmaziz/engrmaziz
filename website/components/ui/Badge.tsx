import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-elevated/80 text-primary border border-border-default",
      accent: "bg-accent text-[color:var(--color-bg-base)] border border-transparent",
      outline: "bg-transparent text-accent border border-accent/35",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "capsule inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em] transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:tracking-[0.1em]",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
