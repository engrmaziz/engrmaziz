"use client";

import * as React from "react";

interface SearchContextType {
  isOpen: boolean;
  query: string;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  toggleSearch: () => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const toggleSearch = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle cmd+k shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);

  return (
    <SearchContext.Provider value={{ isOpen, query, setIsOpen, setQuery, toggleSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
