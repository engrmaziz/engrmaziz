/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useScroll } from "@/hooks/useScroll";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { isScrolled } = useScroll();

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-4 inset-x-4 md:inset-x-8 max-w-5xl mx-auto z-40 pointer-events-auto transition-all duration-300 rounded-full",
        isScrolled
          ? "bg-base/70 backdrop-blur-xl border border-border-default/50 shadow-sm py-2 px-6"
          : "bg-transparent py-4 px-6 border border-transparent"
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        >
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-base font-bold text-base-inverted font-mono">AE</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-primary transition-colors group-hover:text-accent">
            Architect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-accent relative py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md",
                      isActive ? "text-accent" : "text-secondary"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-accent rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4 border-l border-border-default pl-4">
            <ThemeToggle />
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Button variant="ghost" size="icon" className="rounded-full text-secondary hover:text-primary">
                <Code2 className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/resume.pdf" target="_blank" aria-label="Resume">
              <Button variant="outline" size="sm" className="hidden lg:flex gap-2 font-mono text-xs">
                <FileText className="w-3.5 h-3.5" />
                RESUME
              </Button>
            </Link>
            <Link href="/contact" aria-label="Contact">
              <Button size="sm" className="gap-2 group">
                Contact
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>


      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-x-4 top-[5rem] bottom-4 bg-base/90 backdrop-blur-2xl border border-border-default rounded-3xl overflow-hidden flex flex-col shadow-2xl z-[90]"
          >
            <div className="flex flex-col px-6 py-8 gap-6 h-full overflow-y-auto">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-2xl font-bold transition-colors py-2 border-b border-border-default/50",
                        isActive ? "text-accent" : "text-primary hover:text-accent"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-4 mt-8">
                <Link href="/resume.pdf" target="_blank" className="w-full">
                  <Button variant="outline" className="w-full justify-between font-mono text-sm">
                    VIEW RESUME
                    <FileText className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full">
                  <Button className="w-full justify-between">
                    GET IN TOUCH
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/engrmaziz" target="_blank" rel="noopener noreferrer" className="w-full mt-4 flex items-center justify-center gap-2 text-secondary hover:text-primary transition-colors py-2">
                  <Code2 className="w-5 h-5" />
                  <span className="font-medium">GitHub Profile</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
