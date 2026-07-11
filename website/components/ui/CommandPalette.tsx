"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Home, Info, Briefcase, Folder, FileText, Mail, Code, User, Database, Bot, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: 'nav-home', category: 'Navigation', title: 'Home', icon: Home, action: '/' },
  { id: 'nav-about', category: 'Navigation', title: 'About', icon: Info, action: '/about' },
  { id: 'nav-services', category: 'Navigation', title: 'Services', icon: Briefcase, action: '/services' },
  { id: 'nav-projects', category: 'Navigation', title: 'Projects', icon: Folder, action: '/projects' },
  { id: 'nav-blog', category: 'Navigation', title: 'Blog', icon: FileText, action: '/blog' },
  { id: 'nav-contact', category: 'Navigation', title: 'Contact', icon: Mail, action: '/contact' },
  
  { id: 'res-resume', category: 'Resources', title: 'Resume', icon: FileText, action: '/resume.pdf' },
  { id: 'res-github', category: 'Resources', title: 'GitHub', icon: Code, action: 'https://github.com/engrmaziz' },
  { id: 'res-linkedin', category: 'Resources', title: 'LinkedIn', icon: User, action: 'https://www.linkedin.com/in/musharrafazizq/' },
  { id: 'res-email', category: 'Resources', title: 'Email', icon: Mail, action: 'mailto:io@maziz.me' },

  { id: 'know-rag', category: 'Knowledge', title: 'RAG Architecture', icon: Database, action: '/services/ai-engineering' },
  { id: 'know-backend', category: 'Knowledge', title: 'Backend Engineering', icon: Monitor, action: '/services/software-architecture' },
  { id: 'know-ai', category: 'Knowledge', title: 'AI Automation', icon: Bot, action: '/services/ai-agents' },
  
  { id: 'theme-dark', category: 'Theme', title: 'Dark Mode', icon: Moon, action: 'theme-dark' },
  { id: 'theme-light', category: 'Theme', title: 'Light Mode', icon: Sun, action: 'theme-light' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filteredItems = query === "" 
    ? ITEMS 
    : ITEMS.filter((item) => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: typeof ITEMS[0]) => {
    setIsOpen(false);
    if (item.action.startsWith("theme-")) {
      setTheme(item.action.replace("theme-", ""));
    } else if (item.action.startsWith("http") || item.action.startsWith("mailto:")) {
      window.open(item.action, "_blank");
    } else {
      router.push(item.action);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filteredItems.length);
      scrollToIndex((selectedIndex + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
      scrollToIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) handleSelect(item);
    }
  };

  const scrollToIndex = (index: number) => {
    if (listRef.current) {
      const item = listRef.current.children[index] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-base border border-border-default rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="flex items-center px-4 border-b border-border-default">
              <Search className="w-5 h-5 text-secondary shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you looking for?"
                className="w-full bg-transparent border-0 h-14 px-4 text-primary focus:outline-none focus:ring-0 text-base"
                aria-expanded={isOpen}
                aria-controls="command-palette-list"
                aria-activedescendant={filteredItems.length > 0 ? filteredItems[selectedIndex]?.id : undefined}
                role="combobox"
              />
              <div className="text-xs font-mono text-secondary px-2 py-1 bg-elevated rounded border border-border-default shrink-0">
                ESC
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2" role="listbox" id="command-palette-list" ref={listRef}>
              {filteredItems.length === 0 ? (
                <div className="py-14 text-center text-sm text-secondary">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  const showCategory = index === 0 || (index > 0 && filteredItems[index - 1]?.category !== item.category);

                  return (
                    <React.Fragment key={item.id}>
                      {showCategory && (
                        <div className="px-3 py-2 text-xs font-semibold text-secondary/70 uppercase tracking-wider mt-2 first:mt-0">
                          {item.category}
                        </div>
                      )}
                      <div
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-sm transition-colors",
                          isSelected ? "bg-accent/10 text-accent" : "text-primary hover:bg-elevated"
                        )}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-accent" : "text-secondary")} />
                        <span className="flex-1 truncate">{item.title}</span>
                        {isSelected && (
                          <span className="text-xs font-medium opacity-60">Enter ↵</span>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
