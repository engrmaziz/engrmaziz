import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link, { LinkProps } from "next/link";

export interface SearchResultProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  title: string;
  excerpt: string;
  category?: string;
}

export const SearchResult = React.forwardRef<HTMLAnchorElement, SearchResultProps>(
  ({ className, title, excerpt, href, category, ...props }, ref) => {
    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          "block p-4 rounded-xl hover:bg-secondary/5 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {category && (
              <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">
                {category}
              </span>
            )}
            <h4 className="text-lg font-medium text-primary group-hover:text-accent transition-colors">
              {title}
            </h4>
            <p className="text-sm text-secondary line-clamp-2 mt-1">
              {excerpt}
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 translate-x-1 group-hover:translate-x-0" />
        </div>
      </Link>
    );
  }
);

SearchResult.displayName = "SearchResult";
