import * as React from "react";
import { cn } from "@/lib/utils";

export type TagProps = React.HTMLAttributes<HTMLSpanElement>;

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-sm bg-elevated px-2 py-1 text-xs font-mono font-medium text-secondary border border-border-default hover:text-primary hover:border-accent transition-colors cursor-default",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";
