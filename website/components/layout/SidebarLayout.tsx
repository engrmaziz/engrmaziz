import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarWidth?: "sm" | "md" | "lg";
  stickySidebar?: boolean;
}

export const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  (
    {
      className,
      sidebar,
      content,
      sidebarPosition = "left",
      sidebarWidth = "md",
      stickySidebar = true,
      ...props
    },
    ref
  ) => {
    const widthClasses = {
      sm: "md:w-64",
      md: "md:w-72",
      lg: "md:w-80",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col md:flex-row gap-8 w-full", className)}
        {...props}
      >
        {sidebarPosition === "left" && (
          <aside
            className={cn(
              "w-full shrink-0",
              widthClasses[sidebarWidth],
              stickySidebar && "md:sticky md:top-[calc(var(--nav-height)+2rem)] self-start max-h-[calc(100vh-var(--nav-height)-4rem)] overflow-y-auto"
            )}
          >
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 min-w-0">{content}</main>
        
        {sidebarPosition === "right" && (
          <aside
            className={cn(
              "w-full shrink-0",
              widthClasses[sidebarWidth],
              stickySidebar && "md:sticky md:top-[calc(var(--nav-height)+2rem)] self-start max-h-[calc(100vh-var(--nav-height)-4rem)] overflow-y-auto"
            )}
          >
            {sidebar}
          </aside>
        )}
      </div>
    );
  }
);

SidebarLayout.displayName = "SidebarLayout";
