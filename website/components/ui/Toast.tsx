"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "default" | "success" | "error";
  className?: string;
}

export function Toast({ message, isOpen, onClose, type = "default", className }: ToastProps) {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const typeClasses = {
    default: "bg-elevated border-border-default text-primary",
    success: "bg-green-100 border-green-200 text-green-900 dark:bg-green-900/30 dark:border-green-800 dark:text-green-100",
    error: "bg-red-100 border-red-200 text-red-900 dark:bg-red-900/30 dark:border-red-800 dark:text-red-100",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "px-4 py-3 rounded-lg shadow-lg border text-sm font-medium",
              typeClasses[type],
              className
            )}
          >
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
