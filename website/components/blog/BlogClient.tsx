/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogData } from "@/lib/blog";
import { SplitLayout } from "@/components/layout/SplitLayout";

export function BlogClient({ initialPosts }: { initialPosts: BlogData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(initialPosts.map(p => p.category));
    return Array.from(cats);
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query));

      const matchesCategory = !activeCategory || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, activeCategory]);

  return (
    <>
      <Section className="pt-24 pb-12 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4">Knowledge Center</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Engineering <br/> Insights & Architecture
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl">
              Deep-dive technical articles, system architecture breakdowns, and production engineering practices. No fluff, just scalable engineering.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base">
        <Container>
          <SplitLayout
            ratio="1/3-2/3"
            className="items-start gap-12"
            left={
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-accent" /> Search Articles
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search architecture, AI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-elevated border border-border-default rounded-lg px-4 py-3 pl-10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                    <Search className="w-4 h-4 text-secondary absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" /> Topics
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
                </div>
                
                {/* Newsletter Placeholder UI */}
                <div className="bg-elevated p-6 rounded-xl border border-border-default">
                   <h3 className="text-base font-bold text-primary mb-2">Join the Newsletter</h3>
                   <p className="text-sm text-secondary mb-4">Get production engineering insights delivered directly to your inbox monthly.</p>
                   <input type="email" placeholder="engineer@example.com" className="w-full bg-base border border-border-default rounded-lg px-3 py-2 text-sm mb-3" />
                   <button className="w-full bg-primary text-base-inverted text-sm font-bold py-2 rounded-lg hover:bg-accent transition-colors">Subscribe</button>
                </div>
              </div>
            }
            right={
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-primary">
                    Latest Publications <span className="text-secondary font-normal text-base ml-2">({filteredPosts.length})</span>
                  </h2>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="py-20 text-center bg-elevated border border-border-default border-dashed rounded-xl">
                    <BookOpen className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-primary mb-2">No articles found</h3>
                    <p className="text-sm text-secondary">Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {filteredPosts.map((post) => (
                        <motion.div
                          key={post.slug}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <BlogCard
                            href={`/blog/${post.slug}`}
                            title={post.title}
                            description={post.description}
                            category={post.category}
                            date={post.date}
                            readingTime={post.readingTime}
                            difficulty={post.difficulty}
                            tags={post.tags}
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
    </>
  );
}
