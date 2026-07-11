"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Briefcase, Calendar, MessageSquare, 
  Database, FileText, FileUp, RefreshCw, Search, Mail, 
  Terminal, Settings, Activity, LogOut, FileCode2
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Contacts", href: "/admin/contacts", icon: Users },
  { name: "Service Requests", href: "/admin/services", icon: Briefcase },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "RAGX Conversations", href: "/admin/conversations", icon: MessageSquare },
  { name: "Knowledge Base", href: "/admin/knowledge", icon: Database },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "Resume Manager", href: "/admin/resume", icon: FileUp },
  { name: "Blog Sync", href: "/admin/blog-sync", icon: RefreshCw },
  { name: "Search Index", href: "/admin/search-index", icon: Search },
  { name: "Email Logs", href: "/admin/emails", icon: Mail },
  { name: "Prompt Manager", href: "/admin/prompts", icon: Terminal },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
  { name: "Activity Logs", href: "/admin/activity", icon: Activity },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border-default bg-elevated hidden md:flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-6 border-b border-border-default shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-accent flex items-center gap-2">
          <FileCode2 className="w-4 h-4" />
          Admin Console
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scroll-smooth">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group",
                isActive 
                  ? "bg-accent/10 text-accent font-medium" 
                  : "text-secondary hover:text-primary hover:bg-base"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-secondary group-hover:text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border-default shrink-0">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Secure Logout
        </button>
      </div>
    </aside>
  );
}
