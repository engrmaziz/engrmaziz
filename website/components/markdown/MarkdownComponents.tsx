import React from "react";
import { Copy } from "lucide-react";
import { Mermaid } from "@/components/ui/Mermaid";
import { cn } from "@/lib/utils";

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
    return <h2 id={id} className="scroll-mt-32 group relative" {...props}>{children}</h2>;
  },
  h3({ children, ...props }: any) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h3 id={id} className="scroll-mt-32 group relative" {...props}>{children}</h3>;
  }
};
