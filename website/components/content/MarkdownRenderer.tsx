import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl",
        "prose-p:leading-relaxed prose-p:text-secondary",
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-primary prose-strong:font-semibold",
        "prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-elevated prose-pre:border prose-pre:border-border-default",
        "prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:text-secondary prose-blockquote:not-italic",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }} // In a real app, use something like next-mdx-remote or react-markdown
    />
  );
}
