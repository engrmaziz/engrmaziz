"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Sparkles } from "lucide-react";

export interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ChatDrawer({ isOpen, onClose, children }: ChatDrawerProps) {
  const title = (
    <div className="flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-accent" />
      <span>AI Assistant</span>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="right"
      className="md:max-w-md lg:max-w-lg w-full flex flex-col"
    >
      <div className="flex flex-col h-full relative">
        {children}
      </div>
    </Drawer>
  );
}
