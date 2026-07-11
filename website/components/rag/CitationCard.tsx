import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link, { LinkProps } from "next/link";

export interface CitationCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  number: number;
  title: string;
  type?: "document" | "project" | "article" | "code";
}

export const CitationCard = React.forwardRef<HTMLAnchorElement, CitationCardProps>(
  ({ className, number, title, href, type = "document", ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "flex items-start gap-2 p-2 rounded-lg bg-base border border-border-default hover:border-accent/50 transition-colors group text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center w-5 h-5 rounded bg-secondary/10 text-xs font-mono font-medium text-secondary shrink-0 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
          {number}
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <span className="block text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">
            {title}
          </span>
          <span className="block text-xs text-secondary mt-0.5 capitalize">
            {type}
          </span>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
      </Link>
    );
  }
);

CitationCard.displayName = "CitationCard";
