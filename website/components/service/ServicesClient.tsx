"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ServerCog, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/service/ServiceCard";
import type { Pillar } from "@/lib/services";
import { SplitLayout } from "@/components/layout/SplitLayout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ServicesClient({ initialServices }: { initialServices: Pillar[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(initialServices.map(s => s.category));
    return Array.from(cats);
  }, [initialServices]);

  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      // Search matching
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        service.keywords?.some(k => k.toLowerCase().includes(query));

      // Filter matching
      const matchesCategory = !activeCategory || service.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialServices, searchQuery, activeCategory]);

  return (
    <>
      <Section className="pt-24 pb-12 bg-base">
        <Container>
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4">Services & Capabilities</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Engineering Expertise <br/> That Scales
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl">
              I provide specialized technical services focused on production-grade software engineering. From highly concurrent backend systems to deterministically orchestrated AI agents, every solution is architected for absolute reliability.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-y border-border-default bg-elevated">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-default">
            {[
              { value: initialServices.length.toString(), label: "Specialized Services" },
              { value: "Full-Cycle", label: "Development Process" },
              { value: "Scalable", label: "Architecture Models" },
              { value: "Production", label: "Grade Deliverables" },
            ].map((metric) => (
              <div key={metric.label} className="py-6 px-6 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Section className="py-16 bg-base">
        <Container>
          <SplitLayout
            ratio="1/3-2/3"
            className="items-start gap-12"
            left={
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-accent" /> Find Service
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search capability..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-elevated border border-border-default rounded-lg px-4 py-3 pl-10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                    <Search className="w-4 h-4 text-secondary absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" /> Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(isActive ? null : cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                            isActive 
                              ? 'bg-accent/10 border-accent text-accent' 
                              : 'bg-elevated border-border-default text-secondary hover:border-accent/40 hover:text-primary'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {activeCategory && (
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="text-xs text-accent font-medium mt-4 hover:underline"
                    >
                      Clear category
                    </button>
                  )}
                </div>
              </div>
            }
            right={
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-primary">
                    Available Services <span className="text-secondary font-normal text-base ml-2">({filteredServices.length})</span>
                  </h2>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="py-20 text-center bg-elevated border border-border-default border-dashed rounded-xl">
                    <ServerCog className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-primary mb-2">No services found</h3>
                    <p className="text-sm text-secondary">Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {filteredServices.map((service) => (
                        <motion.div
                          key={service.slug}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ServiceCard
                            href={`/services/${service.slug}`}
                            title={service.title}
                            description={service.description}
                            category={service.category}
                            tags={service.tags || []}
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

      <Section className="bg-primary text-[color:var(--color-bg-base)] py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--color-bg-base)]">
              Ready to architect your solution?
            </h2>
            <p className="text-lg text-[color:var(--color-bg-base)] opacity-80 leading-relaxed mb-10">
              Stop settling for quick-fixes and brittle code. Let&apos;s build infrastructure that scales with your business logic gracefully.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="bg-base text-primary hover:bg-border-default font-bold border-none px-8">
                  Schedule a Consultation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
