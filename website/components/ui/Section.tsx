"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

export interface SectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  containerClassName?: string;
  withContainer?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, containerClassName, withContainer = true, children, ...props }, ref) => {
    
    const content = withContainer ? (
      <div className={cn("mx-auto w-full max-w-[var(--container-width-default)] px-4 md:px-8", containerClassName)}>
        {children}
      </div>
    ) : (
      children
    );

    return (
      <motion.section
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={cn("py-[var(--section-spacing-y)] w-full", className)}
        {...props}
      >
        {content}
      </motion.section>
    );
  }
);

Section.displayName = "Section";
