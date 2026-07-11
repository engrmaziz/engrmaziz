"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  height?: string;
}

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  ({ className, color = "bg-accent", height = "h-1", ...props }, ref) => {
    const { scrollProgress } = useScroll();

    return (
      <div
        ref={ref}
        className={cn("fixed top-0 left-0 right-0 z-[100] w-full", height, className)}
        {...props}
      >
        <motion.div
          className={cn("h-full origin-left", color)}
          style={{ scaleX: scrollProgress }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    );
  }
);

ScrollProgress.displayName = "ScrollProgress";
