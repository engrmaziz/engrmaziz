"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChatLauncherProps extends HTMLMotionProps<"button"> {
  isOpen?: boolean;
}

export const ChatLauncher = React.forwardRef<HTMLButtonElement, ChatLauncherProps>(
  ({ className, isOpen, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent",
          className
        )}
        aria-label="Toggle AI Assistant"
        aria-expanded={isOpen}
        {...props}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>
    );
  }
);

ChatLauncher.displayName = "ChatLauncher";
