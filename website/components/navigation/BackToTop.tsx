"use client";

import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

export interface BackToTopProps extends HTMLMotionProps<"button"> {
  showAfter?: number;
}

export const BackToTop = React.forwardRef<HTMLButtonElement, BackToTopProps>(
  ({ className, showAfter = 400, ...props }, ref) => {
    const { scrollY, scrollToTop } = useScroll();
    const isVisible = scrollY > showAfter;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            ref={ref}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-elevated border border-border-default shadow-lg flex items-center justify-center text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              className
            )}
            aria-label="Back to top"
            {...props}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }
);

BackToTop.displayName = "BackToTop";
