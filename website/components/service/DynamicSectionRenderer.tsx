/* eslint-disable */
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, Server, Database, Code2, Layers, Cpu, Zap, Link as LinkIcon, Smartphone, Network } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SectionProps {
  title: string;
  content: string;
  index: number;
  slug?: string;
}

function parseMarkdownList(content: string) {
  // Extract items like "- **Title:** Description" or "1. **Title:** Description"
  const items = [];
  const regex = /(?:-|\d+\.)\s+\*\*([^*]+)\*\*(?::)?\s*(.*?)(?=\n(?:-|\d+\.)\s+\*\*|$)/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const title = (match[1] || '').trim();
    const description = (match[2] || '').trim();
    items.push({ title, description });
  }
  return items;
}

function parseFAQ(content: string) {
  // Extract items like "**Q: Question?**\nAnswer"
  const items = [];
  const regex = /\*\*Q:\s*(.*?)\*\*\s*\n(.*?)(?=\n\*\*Q:|$)/gs;
  let match;
  let idCounter = 0;
  while ((match = regex.exec(content)) !== null) {
    const title = (match[1] || '').trim();
    const contentVal = (match[2] || '').trim();
    items.push({ id: `faq-${idCounter++}`, title, content: contentVal });
  }
  return items;
}



const icons = [Server, Database, Code2, Layers, Cpu, Zap, Smartphone, Network];

export function DynamicSectionRenderer({ title, content, index, slug = "" }: SectionProps) {
  const t = title.toLowerCase();

  // 1. FAQ Section (Accordion)
  if (t.includes('faq')) {
    const faqItems = parseFAQ(content);
    if (faqItems.length > 0) {
      return (
        <div className="w-full">
          <Accordion items={faqItems} allowMultiple={false} />
        </div>
      );
    }
  }

  // 2. Features / Use Cases / Business Problems / Benefits / Technology Grid
  if (t.includes('feature') || t.includes('use case') || t.includes('business problem') || t.includes('benefit') || t.includes('technolog')) {
    const listItems = parseMarkdownList(content);
    if (listItems.length > 0) {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          {listItems.map((item, i) => {
            const Icon = icons[i % icons.length] as any;
            return (
              <div key={i} className="bg-elevated p-6 rounded-xl border border-border-default hover:border-accent/50 transition-colors shadow-sm">
                <Icon className="w-8 h-8 text-accent mb-4" />
                <div role="heading" aria-level={4} className="text-lg font-bold text-primary mb-2 prose prose-sm prose-a:text-primary hover:prose-a:text-accent m-0 p-0 leading-tight">
                  <ReactMarkdown>{item.title}</ReactMarkdown>
                </div>
                <div className="text-secondary text-sm leading-relaxed prose prose-sm dark:prose-invert prose-p:my-0"><ReactMarkdown>{item.description}</ReactMarkdown></div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  if (t.includes('architecture')) {
    // If it's a child service, slug might be 'ai-agents/whatsapp-agents'. Let's extract the last part.
    const serviceName = slug.split('/').pop() || 'ai-agents';
    // Fallback to pillar image if child image doesn't exist
    const pillarName = slug.split('/')[0] || 'ai-agents';
    const techImageSrc = `/images/services/${serviceName}-tech.png`;

    return (
      <div className="space-y-12">
        {/* 3D Tech Architecture Image */}
        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-border-default shadow-lg bg-base">
          <Image 
            src={techImageSrc}
            alt={`${title} Illustration`}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = `/images/services/${pillarName}-tech.png`;
              // Prevent infinite loop if fallback also fails
              if (target.src.endsWith(fallback)) {
                target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
              } else {
                target.src = fallback;
              }
            }}
          />
        </div>

        {/* Prose Content (Includes Mermaid automatically) */}
        {content.trim() ? (
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-secondary">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        ) : null}
      </div>
    );
  }

  // Fallback: Standard Markdown
  return (
    <div className={cn(
      "prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-p:text-secondary prose-a:text-accent prose-strong:text-primary prose-ul:text-secondary prose-li:marker:text-accent",
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
