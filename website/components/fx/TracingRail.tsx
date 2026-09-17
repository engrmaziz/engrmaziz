"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function TracingRail({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <div className="absolute bottom-4 left-[15px] top-4 w-px bg-border-default md:left-1/2 md:-translate-x-1/2" aria-hidden />
      {!reduced ? (
        <motion.div
          aria-hidden
          className="absolute left-[15px] top-4 bottom-4 w-px origin-top bg-gradient-to-b from-accent via-gold to-accent md:left-1/2 md:-translate-x-1/2"
          style={{ scaleY }}
        />
      ) : null}
      {children}
    </div>
  );
}
