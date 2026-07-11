"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

export interface DropdownProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, children, align = "right", ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={dropdownRef} className="relative inline-block text-left">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-elevated border border-border-elevated py-1",
                align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
                className
              )}
              role="menu"
              {...props}
              ref={ref}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export const DropdownItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-secondary/5 hover:text-primary transition-colors",
        className
      )}
      role="menuitem"
      {...props}
    />
  )
);

DropdownItem.displayName = "DropdownItem";
