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
    const baseStyles =
      "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-tight transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gold text-[color:var(--color-bg-base)] hover:bg-gold-hover border border-transparent shadow-[0_0_24px_color-mix(in_srgb,var(--color-gold)_35%,transparent)]",
      secondary:
        "bg-elevated/80 text-primary hover:border-accent/50 border border-border-default backdrop-blur-md",
      outline:
        "bg-transparent border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent",
      ghost: "bg-transparent text-primary hover:bg-elevated border border-transparent",
      link: "bg-transparent text-accent underline-offset-4 hover:underline border-transparent !p-0 !h-auto rounded-none",
    };

    const sizes = {
      sm: "h-10 min-h-10 px-4 text-sm",
      md: "h-11 min-h-11 px-6 text-base",
      lg: "h-14 min-h-11 px-8 text-lg",
      icon: "h-11 w-11 min-h-11 min-w-11",
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
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children as React.ReactNode}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
