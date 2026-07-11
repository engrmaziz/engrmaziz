import * as React from "react";
import { cn } from "@/lib/utils";

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  (
    {
      className,
      as: Component = "div",
      gap = "sm",
      align = "center",
      justify = "start",
      children,
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-8",
      xl: "gap-12",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "flex flex-row flex-wrap",
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Cluster.displayName = "Cluster";
