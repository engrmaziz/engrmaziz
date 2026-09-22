/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import React from "react";
import { Copy } from "lucide-react";
import { Mermaid } from "@/components/ui/Mermaid";
import { cn } from "@/lib/utils";
import { sanitizeHref } from "@/lib/security/input";

export const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    
    // Intercept Mermaid blocks globally
    if (!inline && match && match[1] === 'mermaid') {
      return <Mermaid chart={codeString} />;
    }
    
    // Standard Code Block rendering (with Copy button)
    if (!inline && match) {
      return (
        <div className="relative group my-6 bg-[#0d1117] rounded-xl overflow-hidden border border-white/10">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
             <span className="text-xs font-mono text-white/50 lowercase">{match[1]}</span>
             <button 
               onClick={(e) => {
                 navigator.clipboard.writeText(codeString);
                 const el = e.currentTarget;
                 el.innerHTML = '<span class="text-green-400 flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied</span>';
                 setTimeout(() => {
                   el.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                 }, 2000);
               }}
               className="text-white/40 hover:text-white transition-colors p-1"
             >
               <Copy className="w-3.5 h-3.5" />
             </button>
          </div>
          <div className="p-4 overflow-x-auto text-sm text-white/90 font-mono leading-relaxed">
             <code className={className} {...props}>
               {children}
             </code>
          </div>
        </div>
      );
    }

    // Inline code snippet
    return (
      <code className={cn("bg-elevated px-1.5 py-0.5 rounded text-sm text-accent font-mono border border-border-default", className)} {...props}>
        {children}
      </code>
    );
  },
  
  // Clean, linkable headers
  h2({ children, ...props }: any) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h2 id={id} className="scroll-mt-32 mb-4 mt-14 text-left font-display text-3xl font-bold tracking-tight text-primary" {...props}>{children}</h2>;
  },
  h3({ children, ...props }: any) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h3 id={id} className="scroll-mt-32 mb-3 mt-8 text-left font-display text-xl font-bold tracking-tight text-primary" {...props}>{children}</h3>;
  },
  li({ children, ...props }: any) {
    return <li className="my-1.5 text-justify leading-[1.75] text-secondary [hyphens:auto]" {...props}>{children}</li>;
  },
  ol({ children, ...props }: any) {
    return <ol className="my-6 list-decimal space-y-2 pl-6 text-secondary" {...props}>{children}</ol>;
  },
  ul({ children, ...props }: any) {
    return <ul className="my-6 list-disc space-y-2 pl-6 text-secondary" {...props}>{children}</ul>;
  },
  table({ children, ...props }: any) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-border-default mb-4 shadow-sm bg-base">
        <table className="w-full text-left text-sm" {...props}>
          {children}
        </table>
      </div>
    );
  },
  th({ children, ...props }: any) {
    return (
      <th className="px-4 py-3 bg-elevated border-b border-border-default font-semibold text-primary whitespace-nowrap" {...props}>
        {children}
      </th>
    );
  },
  td({ children, ...props }: any) {
    return (
      <td className="px-4 py-3 border-b border-border-default text-secondary break-words" {...props}>
        {children}
      </td>
    );
  },
  a({ children, href, ...props }: any) {
    const safe = sanitizeHref(href);
    if (!safe) return <span className="text-accent">{children}</span>;
    const internal = safe.startsWith("/");
    return (
      <a href={safe} target={internal ? undefined : "_blank"} rel={internal ? undefined : "noopener noreferrer"} className="text-accent hover:underline break-all">
        {children}
      </a>
    );
  },
  p({ children, node, ...props }: any) {
    const hasMedia = node?.children?.some(
      (child: { type?: string; tagName?: string }) => child.type === "element" && child.tagName === "img"
    );
    if (hasMedia) return <div className="my-8" {...props}>{children}</div>;
    return <p className="mb-6 text-justify text-[1.0625rem] font-normal leading-[1.85] text-secondary [hyphens:auto]" {...props}>{children}</p>;
  },
  img({ src, alt }: any) {
    const safe = sanitizeHref(src);
    if (!safe || safe.startsWith("mailto:")) return null;
    return (
      <div className="rounded-xl overflow-hidden border border-border-default my-4 bg-base">
        <img
          src={safe}
          alt={alt || ""}
          width={safe.includes("/images/blog/") ? 1200 : undefined}
          height={safe.includes("/images/blog/") ? 675 : undefined}
          className={safe.includes("/images/blog/") ? "aspect-video w-full max-w-full object-contain" : "max-w-full h-auto object-contain"}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
};
