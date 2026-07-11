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
      "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover border border-transparent",
      secondary: "bg-elevated text-primary hover:bg-border-default border border-border-default shadow-sm",
      outline: "bg-transparent text-primary border border-accent hover:bg-accent/10",
      ghost: "bg-transparent text-primary hover:bg-secondary/10 border border-transparent",
      link: "bg-transparent text-accent underline-offset-4 hover:underline border-transparent !p-0 !h-auto",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-11 w-11",
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
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children as React.ReactNode}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
