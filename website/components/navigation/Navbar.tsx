/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useScroll } from "@/hooks/useScroll";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Magnetic } from "@/components/fx/Magnetic";
import { downloadResume } from "@/lib/download-resume";

function openResume() {
  downloadResume();
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Hire", href: "/hire" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { isScrolled } = useScroll();

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-3 bottom-4 top-[4.75rem] z-[120] flex flex-col overflow-hidden rounded-3xl border border-accent/25 bg-base/90 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-8">
              <nav id="mobile-nav" className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "border-b border-border-default/50 py-3 font-display text-3xl font-bold transition-colors",
                        isActive ? "text-accent" : "text-primary hover:text-accent"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-4">
                <Button variant="outline" className="w-full justify-between font-mono text-sm" leftIcon={<FileText className="h-4 w-4" />} onClick={openResume} aria-label="Download Resume">
                  Download resume
                </Button>
                <Link
                  href="/hire"
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-between rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[color:var(--color-bg-base)] hover:bg-gold-hover"
                >
                  Hire me
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
    <header
      className={cn(
        "pointer-events-auto fixed inset-x-3 top-3 z-[130] mx-auto max-w-6xl overflow-visible rounded-full transition-[padding,background-color,border-color,box-shadow] duration-500 md:inset-x-6",
        isScrolled
          ? "border border-accent/25 bg-base/70 px-4 py-2 shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] backdrop-blur-2xl md:px-6"
          : "border border-transparent bg-transparent px-4 py-3 md:px-6"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <BrandLogo priority size="md" className="max-w-[min(208px,46vw)] transition-transform duration-300 group-hover:scale-[1.02]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isActive ? "text-accent" : "text-secondary hover:text-primary"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-x-2 -bottom-0.5 h-px bg-accent"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 border-l border-border-default pl-4">
            <ThemeToggle />
            <Link
              href="https://github.com/engrmaziz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-11 w-11 min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-secondary transition-colors hover:bg-elevated hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Code2 className="h-4 w-4" />
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="hidden shrink-0 xl:inline-flex"
              leftIcon={<FileText className="h-3.5 w-3.5" />}
              onClick={openResume}
              aria-label="Download resume"
            >
              Resume
            </Button>
            <Magnetic>
              <Link
                href="/hire"
                aria-label="Hire Musharraf"
                className="group relative isolate inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-base)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-gold)_35%,transparent)] transition-colors hover:bg-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Hire
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
          </div>
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-1 sm:gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="min-h-11 min-w-11 cursor-pointer rounded-md p-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
    {mobileMenu}
    </>
  );
}
