"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, GitBranch, ExternalLink, Clock, Hash, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";
import { DiagramPlaceholder } from "./DiagramPlaceholder";
import { RelatedContent } from "./RelatedContent";
import type { ProjectData } from "@/lib/projects";

// The required 33 sections for the enterprise portfolio
const CASE_STUDY_SECTIONS = [
  { id: "overview", title: "Overview", match: ["Executive Summary", "Overview", "Introduction", "Preamble"] },
  { id: "problem-statement", title: "Problem Statement", match: ["Problem Statement & Business Context", "Problem Statement"] },
  { id: "business-context", title: "Business Context", match: ["Business Context", "Market Need"] },
  { id: "objectives", title: "Objectives", match: ["Objectives", "Goals"] },
  { id: "solution", title: "Solution", match: ["Solution", "The Solution"] },
  { id: "system-architecture", title: "System Architecture", match: ["Solution Architecture", "Architecture", "System Architecture", "High-Level Architecture"] },
  { id: "architecture-diagram", title: "Architecture Diagram", type: "diagram", diagType: "c4" },
  { id: "technology-stack", title: "Technology Stack", match: ["Technology Stack", "Tech Stack"] },
  { id: "database-design", title: "Database Design", match: ["Database Design", "Data Model"] },
  { id: "api-architecture", title: "API Architecture", match: ["API Architecture", "API Design", "System Components"] },
  { id: "authentication", title: "Authentication", match: ["Authentication", "Security & Observability", "Security"] },
  { id: "ai-components", title: "AI Components", match: ["AI Components", "Machine Learning"] },
  { id: "rag-pipeline", title: "RAG Pipeline", match: ["RAG Pipeline", "Retrieval Augmented Generation"] },
  { id: "llms-used", title: "LLMs Used", match: ["LLMs Used", "Large Language Models"] },
  { id: "embedding-models", title: "Embedding Models", match: ["Embedding Models", "Embeddings"] },
  { id: "vector-database", title: "Vector Database", match: ["Vector Database", "Vector Store"] },
  { id: "prompt-engineering", title: "Prompt Engineering", match: ["Prompt Engineering", "Prompts"] },
  { id: "evaluation-strategy", title: "Evaluation Strategy", match: ["Evaluation Strategy", "Evaluation", "Testing"] },
  { id: "deployment", title: "Deployment", match: ["Deployment", "Infrastructure & Deployment", "Infrastructure"] },
  { id: "cicd", title: "CI/CD", match: ["CI/CD", "Continuous Integration"] },
  { id: "performance", title: "Performance", match: ["Performance", "Latency", "Metrics"] },
  { id: "security", title: "Security", match: ["Security", "Data Privacy"] },
  { id: "scalability", title: "Scalability", match: ["Scalability", "Scaling"] },
  { id: "challenges", title: "Challenges", match: ["Challenges", "Challenges & Lessons Learned", "Technical Challenges"] },
  { id: "engineering-tradeoffs", title: "Engineering Tradeoffs", match: ["Engineering Tradeoffs", "Trade-offs", "Tradeoffs"] },
  { id: "lessons-learned", title: "Lessons Learned", match: ["Lessons Learned", "Key Takeaways"] },
  { id: "future-improvements", title: "Future Improvements", match: ["Future Improvements", "Roadmap"] },
  { id: "screenshots", title: "Screenshots", match: ["Screenshots", "UI/UX", "Visuals", "Telemetry & Media Status"] },
  { id: "demo", title: "Live Demo", match: ["Demo", "Video", "Live URL"] },
  { id: "github-repository", title: "GitHub Repository", match: ["GitHub Repository", "Source Code", "Repository"] },
  { id: "related-projects", title: "Related Projects", type: "related" },
  { id: "faq", title: "Frequently Asked Questions", match: ["Frequently Asked Questions", "FAQ", "Interview Questions"] },
  { id: "final-cta", title: "Final CTA", type: "cta" },
];

export function ProjectDetailLayout({ project }: { project: ProjectData }) {
  const [activeSection, setActiveSection] = useState("");
  const [copiedLink, setCopiedLink] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Map markdown sections to the 33 template sections
  const mappedContent = React.useMemo(() => {
    const map: Record<string, string | null> = {};
    
    CASE_STUDY_SECTIONS.forEach(sec => {
      let content: string | null = null;
      if (sec.match) {
        // Try to find an exact or partial match in parsed markdown headings
        for (const m of sec.match) {
          const foundKey = Object.keys(project.sections).find(k => k.toLowerCase().includes(m.toLowerCase()));
          if (foundKey) {
            content = project.sections[foundKey] || null;
            break;
          }
        }
      }
      map[sec.id] = content;
    });

    return map;
  }, [project.sections]);

  // Setup Intersection Observer for sticky TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visibleSections = entries.filter((entry) => entry.isIntersecting);
        if (visibleSections.length > 0 && visibleSections[0]?.target?.id) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    CASE_STUDY_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const copySectionLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  return (
    <PageLayout>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Header */}
      <div className="bg-elevated border-b border-border-default pt-32 pb-16">
        <Container>
          <div className="mb-8">
            <Link href="/projects" className="inline-flex items-center text-sm font-medium text-secondary hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono border-accent/20 text-accent bg-accent/5">
              {project.category}
            </Badge>
            <Badge variant="default" className="text-xs font-mono">
              {project.status || "Completed"}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-secondary font-medium ml-auto">
              <Clock className="w-4 h-4" />
              {project.readingTime}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            {project.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-4xl leading-relaxed mb-10">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {project.sourceCode && (
              <a href={project.sourceCode} target="_blank" rel="noopener noreferrer" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base rounded-sm">
                <Button variant="outline" className="gap-2">
                  <GitBranch className="w-4 h-4" /> View Repository
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base rounded-sm">
                <Button variant="secondary" className="gap-2">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </Button>
              </a>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-col lg:flex-row gap-16 relative items-start">
          
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar pr-6 border-r border-border-default">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-6">Table of Contents</h4>
            <nav className="flex flex-col space-y-1.5">
              {CASE_STUDY_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={cn(
                    "text-sm py-1.5 px-3 rounded-md transition-all duration-200 border-l-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    activeSection === sec.id
                      ? "bg-elevated text-primary border-accent font-bold shadow-sm"
                      : "text-secondary hover:text-primary hover:bg-elevated border-transparent"
                  )}
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Case Study Content */}
          <article className="flex-1 max-w-4xl min-w-0 prose prose-slate dark:prose-invert prose-lg prose-headings:scroll-mt-32">
            {CASE_STUDY_SECTIONS.map((sec) => {
              
              // Handle special programmatic sections
              if (sec.type === "diagram") {
                return (
                  <section key={sec.id} id={sec.id} className="mb-16 scroll-mt-32 group">
                    <div className="flex items-center justify-between mb-6 border-b border-border-default pb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-primary m-0 flex items-center gap-3">
                        <a href={`#${sec.id}`} className="hover:text-accent transition-colors cursor-pointer">
                          {sec.title}
                        </a>
                      </h2>
                      <button onClick={() => copySectionLink(sec.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-secondary hover:text-primary">
                        {copiedLink === sec.id ? <Check className="w-4 h-4 text-green-500" /> : <Hash className="w-4 h-4" />}
                      </button>
                    </div>
                    <DiagramPlaceholder type={sec.diagType as "mermaid" | "c4" | "sequence" | "infrastructure" | "database" | "api"} title={sec.title} />
                  </section>
                );
              }

              if (sec.type === "related") {
                return (
                  <section key={sec.id} id={sec.id} className="mb-16 scroll-mt-32">
                     <RelatedContent 
                        relatedProjects={project.related_projects || []}
                        relatedSkills={project.related_skills || []}
                        relatedServices={project.related_services || []}
                        relatedDocuments={project.related_documents || []}
                     />
                  </section>
                );
              }

              if (sec.type === "cta") {
                return (
                  <section key={sec.id} id={sec.id} className="mt-24 pt-12 border-t border-border-default scroll-mt-32">
                    <div className="bg-elevated border border-border-default rounded-2xl p-8 md:p-12 text-center shadow-sm">
                      <h2 className="text-3xl font-bold mb-4 text-primary">Ready to build something robust?</h2>
                      <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        Whether it&apos;s a complex RAG pipeline, a secure API gateway, or a scalable SaaS platform, let&apos;s discuss the architecture.
                      </p>
                      <Link href="/contact" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base rounded-sm inline-block">
                        <Button variant="primary" size="lg" className="px-8 font-bold">
                          Schedule Architecture Review
                        </Button>
                      </Link>
                    </div>
                  </section>
                );
              }

              // Standard Markdown sections
              const content = mappedContent[sec.id];
              const hasContent = !!content && content.trim().length > 0;

              return (
                <section key={sec.id} id={sec.id} className="mb-16 scroll-mt-32 group relative">
                  
                  {/* Section Heading with Copy Anchor Link */}
                  <div className="flex items-center justify-between mb-6 border-b border-border-default pb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary m-0 flex items-center gap-3">
                      <a href={`#${sec.id}`} className="hover:text-accent transition-colors cursor-pointer">
                        {sec.title}
                      </a>
                    </h2>
                    <button 
                      onClick={() => copySectionLink(sec.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-elevated text-secondary hover:text-primary"
                      title="Copy section link"
                    >
                      {copiedLink === sec.id ? <Check className="w-5 h-5 text-green-500" /> : <Hash className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Section Content or Placeholder */}
                  {hasContent ? (
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="bg-elevated/50 border border-border-default border-dashed rounded-lg p-6 my-6 text-center text-secondary">
                      <p className="font-mono text-sm">
                        [ Information Required: <span className="font-bold">{sec.title}</span> specifications are pending documentation sync. ]
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </article>
        </div>
      </Container>
    </PageLayout>
  );
}
