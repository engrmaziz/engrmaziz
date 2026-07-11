"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 },
  };

  const transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  };

  return (
    <div className="flex gap-4 w-full justify-start">
      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-4 h-4" />
      </div>
      
      <div className="bg-elevated border border-border-default rounded-2xl rounded-tl-sm px-4 py-3 h-11 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...transition, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-secondary/50"
          />
        ))}
      </div>
    </div>
  );
}
