import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, as, children, ...props }, ref) => {
    const Component = as || (`h${level}` as React.ElementType);

    const sizes = {
      1: "text-4xl md:text-6xl font-bold tracking-tight",
      2: "text-2xl md:text-4xl font-semibold tracking-tight",
      3: "text-xl md:text-2xl font-semibold tracking-tight",
      4: "text-lg md:text-xl font-medium",
      5: "text-copy md:text-lg font-medium",
      6: "text-sm md:text-copy font-medium uppercase tracking-wider",
    };

    return (
      <Component
        ref={ref}
        className={cn("font-display text-primary", sizes[level], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
