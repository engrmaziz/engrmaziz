"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "./SearchContext";

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    const { query, setQuery } = useSearch();

    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-secondary" />
        </div>
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation, projects, or ask AI..."
          className={cn(
            "block w-full pl-10 pr-10 py-3 md:py-4 border-b border-border-default bg-transparent text-primary placeholder-secondary focus:outline-none focus:ring-0 sm:text-lg",
            className
          )}
          {...props}
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-secondary hover:text-primary hover:bg-secondary/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
