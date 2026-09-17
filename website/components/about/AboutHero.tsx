"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
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
import { ConstellationField } from "@/components/fx/ConstellationField";
import { Meteors } from "@/components/fx/Meteors";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function PortraitFrame({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(42);
  const glareY = useMotionValue(22);
  const rx = useSpring(rotateX, { stiffness: 180, damping: 16 });
  const ry = useSpring(rotateY, { stiffness: 180, damping: 16 });
  const glare = useMotionTemplate`radial-gradient(280px circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--color-accent) 32%, transparent), transparent 58%)`;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -16);
    rotateY.set((px - 0.5) * 18);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(42);
    glareY.set(22);
  };

  return (
    <div className="relative [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-full border border-dashed border-accent/35 motion-safe:animate-orbit"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-full border border-gold/25 motion-safe:animate-orbit-rev"
      />
      <motion.div
        style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry, transformStyle: "preserve-3d" }}
        className="relative h-72 w-72 overflow-hidden rounded-3xl border border-accent/30 bg-elevated shadow-[0_24px_80px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] md:h-80 md:w-80"
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base/70 to-transparent"
        />
      </motion.div>
    </div>
  );
}

export function AboutHero() {
  return (
    <Section withContainer={false} className="relative overflow-hidden bg-base pb-16 pt-24">
      <ConstellationField className="opacity-80" />
      <Meteors count={10} />
      <Container className="relative z-10">
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

          <Reveal delay={0.1} className="relative flex w-full flex-col items-center justify-center lg:items-end">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-[120px]" />
            <div className="flex flex-col items-center gap-8 pt-8">
              <PortraitFrame>
                <Image
                  src="/images/musharraf.webp"
                  alt="Musharraf Aziz"
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 288px, 320px"
                  className="object-cover object-[center_22%]"
                />
              </PortraitFrame>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-base/90 px-4 py-2 text-xs font-semibold text-primary shadow-lg backdrop-blur-md">
                  <Bot className="h-4 w-4 text-accent" />
                  Deterministic AI
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-base/90 px-4 py-2 text-xs font-semibold text-primary shadow-lg backdrop-blur-md">
                  <Database className="h-4 w-4 text-accent" />
                  High-Performance APIs
                </span>
              </div>

              <BorderBeam radius={16} className="w-full max-w-sm">
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
