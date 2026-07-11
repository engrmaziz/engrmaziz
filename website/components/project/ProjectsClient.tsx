"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Terminal, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectData } from "@/lib/projects";
import { SplitLayout } from "@/components/layout/SplitLayout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FILTER_CATEGORIES = [
  "Backend", "AI / ML", "LLMs", "RAG", "Automation", "Voice AI",
  "Full Stack", "Data Analysis", "Documentation", "Open Source",
  "Healthcare", "Solar", "Telecommunications", "Manufacturing"
];

export function ProjectsClient({ initialProjects }: { initialProjects: ProjectData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Search matching
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query);

      // Filter matching
      let matchesFilters = true;
      if (activeFilters.size > 0) {
        // A project must match at least one active filter (OR logic)
        // or all active filters (AND logic)? Usually OR is better for tags.
        // Let's implement OR logic for broad discovery.
        matchesFilters = Array.from(activeFilters).some(filter => {
          const f = filter.toLowerCase();
          return (
            project.category.toLowerCase().includes(f) ||
            project.tags?.some(tag => tag.toLowerCase().includes(f)) ||
            project.keywords?.some(k => k.toLowerCase().includes(f))
          );
        });
      }

      return matchesSearch && matchesFilters;
    });
  }, [initialProjects, searchQuery, activeFilters]);

  // Extract featured projects
  const featuredProjects = initialProjects.filter(p => p.featured || p.slug === 'aegisflow' || p.slug === 'llm-guardrail').slice(0, 2);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <Section className="pt-24 pb-12 bg-base">
        <Container>
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4">Engineering Portfolio</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Production Systems & <br/> Architecture
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl">
              I do not build demos. These case studies detail enterprise-grade software systems architected for scale, security, and deterministic outcomes in high-stakes environments.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── STATS STRIP ────────────────────────────────────────────────────── */}
      <div className="border-y border-border-default bg-elevated">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-default">
            {[
              { value: initialProjects.length.toString(), label: "Case Studies" },
              { value: "4+", label: "Industries Served" },
              { value: "0", label: "AI Hallucinations" },
              { value: "99.9%", label: "Uptime Achieved" },
            ].map((metric) => (
              <div key={metric.label} className="py-6 px-6 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── FEATURED PROJECTS ──────────────────────────────────────────────── */}
      {featuredProjects.length > 0 && !searchQuery && activeFilters.size === 0 && (
        <Section className="py-16 bg-elevated border-b border-border-default">
          <Container>
            <div className="flex items-center gap-2 mb-8">
              <TargetIcon className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-primary">Featured Case Studies</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map(project => (
                <ProjectCard
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  status={project.status}
                  techStack={project.related_skills}
                  githubUrl={project.sourceCode}
                  liveUrl={project.demoUrl}
                  featured={true}
                  businessImpact={project.businessImpact}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── FILTERS & GRID ─────────────────────────────────────────────────── */}
      <Section className="py-16 bg-base">
        <Container>
          <SplitLayout
            ratio="1/3-2/3"
            className="items-start gap-12"
            left={
              <div className="sticky top-24 space-y-8">
                {/* Search */}
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-accent" /> Search
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search architecture..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-elevated border border-border-default rounded-lg px-4 py-3 pl-10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                    <Search className="w-4 h-4 text-secondary absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" /> Technology & Domain
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_CATEGORIES.map(filter => {
                      const isActive = activeFilters.has(filter);
                      return (
                        <button
                          key={filter}
                          onClick={() => toggleFilter(filter)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                            isActive 
                              ? 'bg-accent/10 border-accent text-accent' 
                              : 'bg-elevated border-border-default text-secondary hover:border-accent/40 hover:text-primary'
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>
                  {activeFilters.size > 0 && (
                    <button 
                      onClick={() => setActiveFilters(new Set())}
                      className="text-xs text-accent font-medium mt-4 hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            }
            right={
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-primary">
                    All Projects <span className="text-secondary font-normal text-base ml-2">({filteredProjects.length})</span>
                  </h2>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="py-20 text-center bg-elevated border border-border-default border-dashed rounded-xl">
                    <Terminal className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-primary mb-2">No projects found</h3>
                    <p className="text-sm text-secondary">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {filteredProjects.map((project) => (
                        <motion.div
                          key={project.slug}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProjectCard
                            href={`/projects/${project.slug}`}
                            title={project.title}
                            description={project.description}
                            category={project.category}
                            status={project.status}
                            techStack={project.related_skills}
                            githubUrl={project.sourceCode}
                            liveUrl={project.demoUrl}
                            businessImpact={project.businessImpact}
                            readingTime={project.readingTime}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            }
          />
        </Container>
      </Section>

      {/* ── ENGINEERING PHILOSOPHY & CTA ───────────────────────────────────── */}
      <Section className="bg-primary text-base-inverted py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Engineering is the art of constraints.
            </h2>
            <p className="text-lg text-base-inverted/80 leading-relaxed mb-10">
              The architectures presented in these case studies don&apos;t emerge from unlimited resources — they emerge from building the tightest possible system within the sharpest possible boundaries.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/services">
                <Button variant="secondary" size="lg" className="bg-base text-primary hover:bg-border-default font-bold border-none px-8">
                  View Technical Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-base-inverted/30 text-base-inverted hover:bg-base-inverted/10 px-8">
                  Discuss a Project <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

// Just an icon wrapper
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
