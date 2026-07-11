import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  withLiquidEffect?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, withLiquidEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg glass-panel",
          className
        )}
        {...props}
      >
        {withLiquidEffect && <div className="liquid-bg" aria-hidden="true" />}
        <div className="relative z-default">{children}</div>
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
