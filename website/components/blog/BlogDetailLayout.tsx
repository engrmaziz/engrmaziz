/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUp, Hash, Check, Share2, Copy } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { BlogData } from "@/lib/blog";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { cn } from "@/lib/utils";

// Custom renderer for code blocks to add copy button
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    // Need state for copy in a wrapper, but since this is rendered per block, we can just use inline JS
    const codeString = String(children).replace(/\n$/, '');
    
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
    return <code className={cn("bg-elevated px-1.5 py-0.5 rounded text-sm text-accent font-mono border border-border-default", className)} {...props}>{children}</code>;
  },
  h2({ children, ...props }: any) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h2 id={id} className="scroll-mt-32 group relative" {...props}>{children}</h2>;
  },
  h3({ children, ...props }: any) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h3 id={id} className="scroll-mt-32 group relative" {...props}>{children}</h3>;
  }
};

export function BlogDetailLayout({ post }: { post: BlogData }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // TOC extractor (simplified)
  const extractHeadings = (markdown: string) => {
    const headings: { id: string; title: string; level: number }[] = [];
    const lines = markdown.split('\n');
    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        headings.push({
          level: match[1].length,
          title: match[2],
          id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      }
    });
    return headings;
  };
  
  const toc = extractHeadings(post.content);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    toc.forEach(sec => {
      const element = document.getElementById(sec.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.target.id) {
                setActiveSection(entry.target.id);
              }
            });
          },
          { rootMargin: "-20% 0px -70% 0px" }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [toc]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL Copied to clipboard");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />

      <Section className="pt-32 pb-16 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-secondary hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Center
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <Badge variant="outline" className="text-sm font-mono border-accent/20 text-accent bg-accent/5">
                {post.category}
              </Badge>
              {post.difficulty && (
                <Badge variant="outline" className="text-xs">
                  {post.difficulty}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">
                   {post.author.charAt(0)}
                 </div>
                 <span className="font-medium text-primary">{post.author}</span>
               </div>
               <span>•</span>
               <span>{formattedDate}</span>
               <span>•</span>
               <span>{post.readingTime}</span>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base">
        <Container>
          <SplitLayout
            ratio="auto-1fr"
            className="items-start gap-16 lg:gap-24"
            left={
              <nav className="sticky top-24 hidden lg:block w-64 shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">In this article</h4>
                </div>
                
                <ul className="space-y-3 border-l-2 border-border-default pl-4">
                  {toc.map(sec => (
                    <li key={sec.id} className={cn(sec.level === 3 ? "ml-4" : "")}>
                      <Link 
                        href={`#${sec.id}`}
                        className={cn(
                          "block text-sm transition-colors duration-200",
                          activeSection === sec.id 
                            ? "text-accent font-bold -ml-[17px] border-l-2 border-accent pl-4" 
                            : "text-secondary hover:text-primary"
                        )}
                      >
                        {sec.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-12 pt-8 border-t border-border-default">
                  <button onClick={copyUrl} className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors font-medium mb-4">
                    <Share2 className="w-4 h-4" /> Share Article
                  </button>
                  <button onClick={scrollToTop} className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors font-medium">
                    <ArrowUp className="w-4 h-4" /> Back to Top
                  </button>
                </div>
              </nav>
            }
            right={
              <article className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:text-primary prose-headings:font-bold 
                prose-p:text-secondary prose-p:leading-relaxed 
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary prose-li:text-secondary
                prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:text-primary
                w-full max-w-[800px] mx-auto lg:mx-0
              ">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-16 pt-8 border-t border-border-default flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-elevated border border-border-default rounded-lg text-sm font-mono text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            }
          />
        </Container>
      </Section>
    </>
  );
}
