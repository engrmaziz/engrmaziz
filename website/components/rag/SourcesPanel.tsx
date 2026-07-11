import * as React from "react";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export interface SourcesPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const SourcesPanel = React.forwardRef<HTMLDivElement, SourcesPanelProps>(
  ({ className, title = "Sources Used", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-secondary/5 border border-border-default rounded-xl p-4 mt-2",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-secondary">
          <BookOpen className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {children}
        </div>
      </div>
    );
  }
);

SourcesPanel.displayName = "SourcesPanel";
