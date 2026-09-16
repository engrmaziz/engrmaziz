"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonPress } from "@/lib/motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isIcon = size === "icon";
    const baseStyles =
      "group relative isolate inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold leading-none tracking-tight cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "overflow-hidden bg-gold text-[color:var(--color-bg-base)] hover:bg-gold-hover border border-transparent shadow-[0_0_24px_color-mix(in_srgb,var(--color-gold)_35%,transparent)]",
      secondary:
        "bg-elevated/80 text-primary hover:border-accent/50 border border-border-default backdrop-blur-md",
      outline:
        "bg-transparent border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent",
      ghost: "overflow-visible bg-transparent text-primary hover:bg-elevated border border-transparent",
      link: "bg-transparent text-accent underline-offset-4 hover:underline border-transparent !p-0 !h-auto rounded-none",
    };

    const sizes = {
      sm: "min-h-11 px-4 py-2 text-sm whitespace-nowrap",
      md: "min-h-11 px-5 py-2.5 text-base whitespace-nowrap sm:px-6",
      lg: "min-h-11 px-5 py-3 text-sm whitespace-nowrap sm:min-h-12 sm:px-7 sm:text-base",
      icon: "h-11 w-11 min-h-11 min-w-11 p-0 overflow-visible",
    };

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        variants={buttonPress}
        initial="rest"
        whileHover={isDisabled ? "rest" : "hover"}
        whileTap={isDisabled ? "rest" : "tap"}
        disabled={isDisabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {variant === "primary" && !isDisabled ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-safe:animate-shine"
          />
        ) : null}
        {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
        {!isLoading && leftIcon ? <span className="relative z-10 inline-flex shrink-0">{leftIcon}</span> : null}
        {isIcon ? (
          <span className="relative z-10 inline-flex items-center justify-center">{children as React.ReactNode}</span>
        ) : children != null && children !== false ? (
          <span className="relative z-10 inline-flex items-center">{children as React.ReactNode}</span>
        ) : null}
        {!isLoading && rightIcon ? <span className="relative z-10 inline-flex shrink-0">{rightIcon}</span> : null}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
