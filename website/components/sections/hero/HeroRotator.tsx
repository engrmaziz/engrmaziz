"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const titles = [
  "AI Engineer",
  "Backend Architect",
  "RAG Systems Engineer",
  "AI Automation Engineer",
  "Senior Software Engineer",
  "Registered Engineer (PEC)",
];

export function HeroRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-8 sm:h-10 text-xl sm:text-2xl font-bold text-accent overflow-hidden w-full max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 whitespace-nowrap"
        >
          {titles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
