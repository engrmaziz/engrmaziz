/* eslint-disable */
// @ts-nocheck
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, rounded = "md", ...props }, ref) => {
    const roundedClasses = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-border-default/30 w-full h-full min-h-[1em]",
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          animate={{ translateX: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
