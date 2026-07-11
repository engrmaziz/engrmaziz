"use client";

import * as React from "react";
import { Search, Bell, Menu } from "lucide-react";

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border-default bg-elevated/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-secondary hover:text-primary rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Global search..." 
            className="w-64 h-9 pl-9 pr-4 bg-base border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
        <button className="p-2 text-secondary hover:text-primary rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-elevated"></span>
        </button>
      </div>
    </header>
  );
}
