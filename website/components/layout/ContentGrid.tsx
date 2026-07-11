import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | "auto-fit" | "auto-fill";
  gap?: "sm" | "md" | "lg" | "xl";
}

export const ContentGrid = React.forwardRef<HTMLDivElement, ContentGridProps>(
  ({ className, columns = "auto-fit", gap = "lg", children, ...props }, ref) => {
    const gapClasses = {
      sm: "gap-4",
      md: "gap-6 md:gap-8",
      lg: "gap-8 md:gap-12",
      xl: "gap-12 md:gap-16",
    };

    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      "auto-fit": "grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]",
      "auto-fill": "grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]",
    };

    return (
      <div
        ref={ref}
        className={cn("grid w-full", columnClasses[columns], gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContentGrid.displayName = "ContentGrid";
