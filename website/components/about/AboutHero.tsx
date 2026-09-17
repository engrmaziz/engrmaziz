"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Bot, Database } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResumeDownload } from "@/components/ui/ResumeDownload";
import { Magnetic } from "@/components/fx/Magnetic";
import { HudFrame, SectionEyebrow } from "@/components/fx/HudFrame";
import { Reveal } from "@/components/fx/Reveal";
import { BorderBeam } from "@/components/fx/BorderBeam";

export function AboutHero() {
  return (
    <Section className="bg-base pb-16 pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <div className="inline-flex w-max items-center gap-2 rounded-full border border-accent/30 bg-elevated px-3 py-1.5 text-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">
                Available — freelance and full-time
              </span>
            </div>

            <div>
              <SectionEyebrow>Identity</SectionEyebrow>
              <h1 className="mb-3 font-display text-5xl font-bold leading-tight tracking-tight text-primary md:text-6xl">
                Musharraf Aziz
              </h1>
              <p className="font-display text-xl font-semibold tracking-tight text-accent md:text-2xl">
                Senior AI Engineer · Applied AI, LLM Systems · ENGR.
              </p>
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-secondary">
              <p>
                I build production-grade AI systems and high-performance backends that solve real enterprise problems. My work spans applied AI and MLOps at Cygnus Technologies, a production voice/chat RAG agent handling 1,000+ daily interactions, e-commerce automation at NovaSole (500,000+ monthly visitors), and a part-time applied-AI instructorship with Bano Qabil (Alkhidmat Foundation). Same discipline in every setting: systems that work when they are needed most.
              </p>
              <p>
                My foundation is Electrical Engineering (B.S. Hons., COMSATS University), which gave me a rigorous first-principles understanding of hardware constraints, failure modes, and systems design. That mindset now shapes every backend architecture, RAG pipeline, and LLM agent I deploy. Software is engineered with the same tolerance discipline an electrical engineer applies to circuit design — because the cost of failure is equally real.
              </p>
              <p>
                I specialize at the intersection of deterministic AI engineering and enterprise backend architecture: the place where LLMs stop being interesting demos and start being reliable, auditable components of mission-critical systems.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {["LangGraph", "FastAPI", "Next.js", "RAG Pipelines", "Python", "TypeScript", "PostgreSQL", "MLOps"].map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ResumeDownload />
              <Magnetic>
                <Link href="/contact">
                  <Button size="lg" className="gap-2 font-bold shadow-sm">
                    Let&apos;s Talk <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative flex min-h-[500px] w-full items-center justify-center lg:justify-end">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-[120px]" />
            <div className="absolute right-0 top-8 z-20 flex items-center gap-2 rounded-full border border-border-default bg-base/80 px-4 py-2 shadow-lg backdrop-blur-md">
              <Bot className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold">Deterministic AI</span>
            </div>
            <div className="absolute right-0 top-56 z-20 flex items-center gap-2 rounded-full border border-border-default bg-base/80 px-4 py-2 shadow-lg backdrop-blur-md">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold">High-Performance APIs</span>
            </div>

            <div className="mt-[-40px] flex flex-col items-center">
              <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-accent/25 bg-elevated shadow-2xl md:h-80 md:w-80">
                <Image
                  src="/images/musharraf.webp"
                  alt="Musharraf Aziz"
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 288px, 320px"
                  className="object-cover object-[center_22%]"
                />
              </div>
              <BorderBeam radius={16} className="mt-8 w-full max-w-sm">
              <HudFrame className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Current Position</p>
                    <p className="text-xs text-secondary">Senior Applied AI/ML Engineer, Cygnus Technologies</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    ["5+", "Years"],
                    ["37+", "Projects"],
                    ["1", "Publication"],
                    ["3", "Awards"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <p className="font-display text-3xl font-bold text-primary">{v}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">{l}</p>
                    </div>
                  ))}
                </div>
              </HudFrame>
              </BorderBeam>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
