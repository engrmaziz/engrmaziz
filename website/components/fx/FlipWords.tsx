"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function FlipWords({
  words,
  interval = 2600,
}: {
  words: string[];
  interval?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, reduced, words.length]);

  const word = words[index] ?? words[0] ?? "";

  if (reduced) {
    return <span className="text-accent">{words.join(" · ")}</span>;
  }

  return (
    <span className="relative inline-flex min-h-[1.2em] overflow-hidden align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
