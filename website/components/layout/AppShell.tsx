"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/ui/CommandPalette";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, navbar, footer, sidebar, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen flex-col bg-base text-primary relative", className)}
        {...props}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded focus:font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base focus:ring-accent">
          Skip to main content
        </a>
        
        {navbar && <header className="sticky top-0 z-[9999] w-full pointer-events-none">{navbar}</header>}
        
        <div className="flex flex-1 w-full">
          {sidebar && (
            <aside className="hidden md:block w-64 border-r border-border-default h-[calc(100vh-var(--nav-height))] sticky top-[var(--nav-height)] overflow-y-auto">
              {sidebar}
            </aside>
          )}
          <main id="main-content" className="flex-1 flex flex-col min-w-0 w-full relative">
            {children}
          </main>
        </div>

        {footer && <footer className="mt-auto w-full">{footer}</footer>}

        <CommandPalette />
      </div>
    );
  }
);

AppShell.displayName = "AppShell";
