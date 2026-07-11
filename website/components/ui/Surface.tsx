import * as React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "elevated" | "accent" | "transparent";
  border?: boolean;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = "elevated", border = true, ...props }, ref) => {
    const variantClasses = {
      base: "bg-base text-primary",
      elevated: "bg-elevated text-primary",
      accent: "bg-accent text-base",
      transparent: "bg-transparent text-primary",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          border && variant !== "transparent" && "border border-border-default",
          className
        )}
        {...props}
      />
    );
  }
);

Surface.displayName = "Surface";
