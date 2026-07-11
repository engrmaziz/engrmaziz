"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ className, code, language, filename, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border-default bg-elevated my-6">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-base text-xs font-mono text-secondary">
          <span>{filename}</span>
          {language && <span className="uppercase">{language}</span>}
        </div>
      )}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 rounded-md bg-base/80 text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-base focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Copy code"
      >
        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre
        className={cn("p-4 overflow-x-auto text-sm font-mono text-primary", className)}
        {...props}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
