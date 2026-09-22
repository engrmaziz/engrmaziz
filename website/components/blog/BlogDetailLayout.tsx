/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUp, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { BlogData } from "@/lib/blog";
import { cn } from "@/lib/utils";

import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";

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
    timeZone: 'UTC',
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
            
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {post.directAnswer ? (
              <p data-speakable="true" className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-secondary">
                {post.directAnswer}
              </p>
            ) : null}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                width={1200}
                height={675}
                className="mx-auto aspect-video w-full max-w-4xl rounded-2xl border border-border-default object-cover"
              />
            ) : null}
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary">
               <div className="flex items-center gap-2">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/20 bg-accent/10 font-bold text-accent">
                   M
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

      <section className="bg-base pb-20 pt-12">
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
            <div className="hidden self-stretch lg:block">
              <nav aria-label="In this article" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3">
                <h4 className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">In this article</h4>
                <ul className="space-y-2.5 border-l border-border-default">
                  {toc.map(sec => (
                    <li key={sec.id} className={cn(sec.level === 3 ? "ml-3" : "")}>
                      <Link
                        href={`#${sec.id}`}
                        className={cn(
                          "block border-l-2 py-1 pl-4 text-sm leading-snug transition-colors duration-200",
                          activeSection === sec.id
                            ? "border-accent font-semibold text-accent"
                            : "border-transparent text-secondary hover:text-primary"
                        )}
                      >
                        {sec.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-border-default pt-6">
                  <button onClick={copyUrl} className="mb-3 flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary">
                    <Share2 className="h-4 w-4" /> Share Article
                  </button>
                  <button onClick={scrollToTop} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary">
                    <ArrowUp className="h-4 w-4" /> Back to Top
                  </button>
                </div>
              </nav>
            </div>
            <article className="prose prose-lg w-full max-w-[46rem] dark:prose-invert
                prose-headings:text-left prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-primary
                prose-h2:mt-14 prose-h2:mb-4 prose-h2:text-3xl
                prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl
                prose-p:mb-6 prose-p:text-justify prose-p:text-[1.0625rem] prose-p:leading-[1.85] prose-p:text-secondary prose-p:[hyphens:auto]
                prose-li:my-1.5 prose-li:text-justify prose-li:leading-[1.75] prose-li:text-secondary
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary
                prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-left prose-blockquote:text-primary
              ">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-16 flex flex-wrap gap-2 border-t border-border-default pt-8 not-prose">
                    {post.tags.map(tag => (
                      <span key={tag} className="rounded-lg border border-border-default bg-elevated px-3 py-1.5 font-mono text-sm text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
          </div>
        </Container>
      </section>
    </>
  );
}
