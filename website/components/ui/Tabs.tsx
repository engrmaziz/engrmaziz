"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  tabs: TabItem[];
  defaultValue?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, defaultValue, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.id);

    return (
      <div ref={ref} className={cn("w-full flex flex-col gap-4", className)} {...props}>
        <div className="flex space-x-1 border-b border-border-default overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                activeTab === tab.id ? "text-primary" : "text-secondary"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId={`tab-indicator-${props.id || 'default'}`}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="pt-2">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
