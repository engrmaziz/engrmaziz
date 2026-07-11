"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="radio"
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-full border bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 checked:border-accent",
            error ? "border-red-500" : "border-border-default",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-accent pointer-events-none scale-0 peer-checked:scale-100 transition-transform" />
      </div>
    );
  }
);

Radio.displayName = "Radio";
