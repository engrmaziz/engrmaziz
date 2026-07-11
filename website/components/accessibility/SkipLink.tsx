import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
}

export function SkipLink({ className, targetId = "main-content", ...props }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "fixed top-0 left-0 z-[100] -translate-y-full px-4 py-3 bg-accent text-white font-medium transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent",
        className
      )}
      {...props}
    >
      Skip to main content
    </a>
  );
}
