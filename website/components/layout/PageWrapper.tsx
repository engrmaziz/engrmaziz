"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PageWrapperProps extends HTMLMotionProps<"article"> {
  children: React.ReactNode;
}

export const PageWrapper = React.forwardRef<HTMLElement, PageWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.article
        ref={ref}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cn("w-full flex flex-col flex-1", className)}
        {...props}
      >
        {children}
      </motion.article>
    );
  }
);

PageWrapper.displayName = "PageWrapper";
