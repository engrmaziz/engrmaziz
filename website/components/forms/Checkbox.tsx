"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-sm border bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 checked:bg-accent checked:border-accent",
            error ? "border-red-500" : "border-border-default",
            className
          )}
          ref={ref}
          {...props}
        />
        <Check className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
