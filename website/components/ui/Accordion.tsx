"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AccordionItem({ title, content, isOpen, onClick, className }: AccordionItemProps) {
  return (
    <div className={cn("border-b border-border-default last:border-0", className)}>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-accent"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-secondary transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-secondary leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { id: string; title: string; content: React.ReactNode }[];
  allowMultiple?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, items, allowMultiple = false, ...props }, ref) => {
    const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());

    const toggle = (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
            next.add(id);
        }
        return next;
      });
    };

    return (
      <div ref={ref} className={cn("w-full border border-border-default rounded-xl bg-elevated px-4", className)} {...props}>
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            title={item.title}
            content={item.content}
            isOpen={openIds.has(item.id)}
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";
