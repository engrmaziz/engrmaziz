/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronRight, ArrowLeft, ArrowUp, Hash, Check, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AnyServiceContent } from "@/lib/services";
import { cn } from "@/lib/utils";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Accordion } from "@/components/ui/Accordion";
import { DynamicSectionRenderer } from "@/components/service/DynamicSectionRenderer";
import Image from "next/image";

export function ServiceDetailLayout({ service }: { service: AnyServiceContent }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Extract sections
  const allSections = Object.entries(service.sections).map(([title, content]) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    content
  })).filter(s => s.content.trim() !== "");

  // Separate special sections
  const heroSection = allSections.find(s => s.title.toLowerCase().includes('hero section'));
  const schemaSection = allSections.find(s => s.title.toLowerCase().includes('json-ld schema'));
  
  // Regular content sections (excluding Hero and Schema)
  const contentSections = allSections.filter(s => 
    !s.title.toLowerCase().includes('hero section') && 
    !s.title.toLowerCase().includes('json-ld schema')
  );

  // Parse JSON-LD Schema
  let schemaString = "";
  if (schemaSection) {
    const match = schemaSection.content.match(/```json\n([\s\S]*?)```/);
    if (match) schemaString = match[1];
  }

  // Parse Hero Data
  const heroData: Record<string, string> = {};
  if (heroSection) {
    const lines = heroSection.content.split('\n');
    lines.forEach(line => {
      const match = line.match(/\*\*(.*?):\*\*\s*(.*)/);
      if (match) {
        heroData[match[1]] = match[2].trim();
      }
    });
  }

  // TOC Items
  const tocItems = [{
    title: "Table of Contents",
    content: (
      <ul className="space-y-2 py-2">
        {contentSections.map(sec => (
          <li key={sec.id}>
            <Link 
              href={`#${sec.id}`}
              className="text-secondary hover:text-accent font-medium transition-colors"
            >
              {sec.title}
            </Link>
          </li>
        ))}
      </ul>
    ) as any // using any to bypass string typing for accordion content if needed, but wait Accordion expects string.
  }];

  // Wait, AccordionItem expects string content. 
  // We can render custom HTML if the Accordion supports it, but standard Accordion might only support string.
  // Let's create a custom TOC Accordion just in case.
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    contentSections.forEach(sec => {
      const element = document.getElementById(sec.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.target && entry.target.id) {
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
  }, [contentSections]);

  const copySectionLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Resolve Image
  // For specialized services, try to load their specific image, otherwise fallback to the pillar image.
  const serviceSlug = service.slugArray[service.slugArray.length - 1];
  const pillarSlug = service.slugArray[0];
  const heroImageSrc = `/images/services/${serviceSlug}-hero.png`;

  return (
    <>
      {schemaString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaString }}
        />
      )}

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />

      {/* 1. Dynamic Hero Section */}
      <Section className="pt-32 pb-20 bg-base relative overflow-hidden border-b border-border-default">
        <Container className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <Link href="/services" className="inline-flex items-center text-sm font-bold text-secondary hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className="text-sm font-mono border-accent/20 text-accent bg-accent/5">
                {service.category}
              </Badge>
              {service.version && (
                <Badge variant="outline" className="text-xs">v{service.version}</Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              {heroData["Headline"] || service.title}
            </h1>
            
            <p className="text-xl text-secondary mb-8 leading-relaxed">
              {heroData["Subheadline"] || service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto font-bold bg-accent text-base hover:bg-accent/90">
                  {heroData["Primary CTA"] || "Discuss Your Project"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#subservices">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold">
                  {heroData["Secondary CTA"] || "View Capabilities"}
                </Button>
              </Link>
            </div>

            {heroData["Trust Indicators"] && (
              <div className="flex flex-wrap items-center gap-6 text-sm text-secondary">
                {heroData["Trust Indicators"].split('|').map((indicator, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" /> {indicator.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-border-default shadow-2xl hidden lg:block">
            <Image 
              src={heroImageSrc} 
              alt={service.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = `/images/services/${pillarSlug}-hero.png`;
                if (target.src.endsWith(fallback)) {
                  target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
                } else {
                  target.src = fallback;
                }
              }}
            />
          </div>
        </Container>
      </Section>

      {/* 2. Specialized Services Grid */}
      {service.children && service.children.length > 0 && (
        <Section id="subservices" className="py-16 bg-elevated border-b border-border-default">
          <Container>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-primary">Specialized Services</h2>
              <p className="text-secondary mt-2">Explore our specific offerings within {service.title}.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.children.map((child) => (
                <ServiceCard
                  key={child.slug}
                  href={`/services/${child.slug}`}
                  title={child.title}
                  description={child.description}
                  category={child.category}
                  tags={child.tags || []}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 3. Table of Contents Accordion */}
      <Section className="py-8 bg-base">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="border border-border-default rounded-xl overflow-hidden bg-elevated shadow-sm">
              <button 
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-lg font-bold text-primary hover:bg-base/50 transition-colors"
              >
                Table of Contents
                <ChevronRight className={cn("w-5 h-5 transition-transform", tocOpen ? "rotate-90" : "")} />
              </button>
              {tocOpen && (
                <div className="px-6 py-4 border-t border-border-default bg-base/30">
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {contentSections.map(sec => (
                      <li key={sec.id}>
                        <Link 
                          href={`#${sec.id}`}
                          onClick={() => setTocOpen(false)}
                          className="flex items-center gap-2 text-secondary hover:text-accent font-medium transition-colors"
                        >
                          <ChevronRight className="w-3 h-3" /> {sec.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Dynamic Content Sections */}
      <Section className="py-8 bg-base">
        <Container>
          <div className="max-w-5xl mx-auto space-y-24">
            {contentSections.map((sec, index) => {
              const t = sec.title.toLowerCase();
              
              // Skip rendering CTA here as we will render a massive block at the bottom if it exists
              if (t.includes('call to action')) return null;

              return (
                <section key={sec.id} id={sec.id} className="scroll-mt-32">
                  <div className="group flex items-center gap-2 mb-8 border-b border-border-default pb-4">
                    <h2 className="text-3xl font-bold text-primary m-0">
                      {sec.title}
                    </h2>
                    <button onClick={() => copySectionLink(sec.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-secondary hover:text-primary">
                      {copiedLink === sec.id ? <Check className="w-4 h-4 text-green-500" /> : <Hash className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <DynamicSectionRenderer 
                    title={sec.title} 
                    content={sec.content} 
                    index={index} 
                    slug={service.slugArray.join('/')}
                  />
                </section>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. Massive Call To Action Block (If present in Markdown) */}
      {contentSections.some(s => s.title.toLowerCase().includes('call to action')) && (
        <Section className="py-32 bg-primary text-center relative overflow-hidden mt-16">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent pointer-events-none" />
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-bg-base)]">
                Ready to scale your enterprise?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto font-bold bg-accent text-base hover:bg-accent/90 px-8 py-6 text-lg shadow-xl shadow-accent/20">
                    Schedule a Technical Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
