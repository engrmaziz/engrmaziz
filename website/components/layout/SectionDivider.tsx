import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: "default" | "dashed" | "dotted" | "accent";
}

export const SectionDivider = React.forwardRef<HTMLHRElement, SectionDividerProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "border-border-default",
      dashed: "border-border-default border-dashed",
      dotted: "border-border-default border-dotted",
      accent: "border-accent/30",
    };

    return (
      <hr
        ref={ref}
        className={cn(
          "w-full border-t my-16 md:my-24",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

SectionDivider.displayName = "SectionDivider";
