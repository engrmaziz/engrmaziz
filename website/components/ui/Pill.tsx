import * as React from "react";
import { cn } from "@/lib/utils";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline";
}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-secondary/10 text-primary",
      accent: "bg-accent/10 text-accent",
      outline: "border border-border-default text-secondary",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "capsule inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.06em] sm:tracking-wider",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Pill.displayName = "Pill";
