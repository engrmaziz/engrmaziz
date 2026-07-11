"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative inline-flex h-6 w-11 items-center rounded-full">
        <input
          type="checkbox"
          role="switch"
          className={cn(
            "peer absolute inset-0 h-full w-full appearance-none rounded-full border-2 bg-secondary/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:cursor-not-allowed disabled:opacity-50 checked:bg-accent checked:border-accent",
            error ? "border-red-500 bg-red-100" : "border-transparent",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0 peer-checked:translate-x-5" />
      </div>
    );
  }
);

Switch.displayName = "Switch";
