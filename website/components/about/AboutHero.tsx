"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Briefcase, Bot, Database } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResumeDownload } from "@/components/ui/ResumeDownload";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function AboutHero() {
  return (
    <Section className="pt-24 pb-16 bg-base">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-elevated border border-border-default rounded-full text-sm w-max shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-primary font-medium text-xs">Available for Projects</span>
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-3 leading-tight tracking-tight">
                Musharraf Aziz
              </h1>
              <p className="text-xl md:text-2xl text-accent font-semibold tracking-tight">
                AI Engineer · Senior Software Engineer · ENGR.
              </p>
            </div>

            <div className="space-y-4 text-secondary leading-relaxed text-lg">
              <p>
                I build production-grade AI systems and high-performance full-stack platforms that solve real enterprise problems. My work spans clinical AI (zero hallucinations in a hospital setting), e-commerce infrastructure (500,000+ monthly visitors), and renewable energy operations — each demanding the same discipline: systems that work when they are needed most.
              </p>
              <p>
                My foundation is Electrical Engineering (B.Sc., COMSATS University), which gave me a rigorous first-principles understanding of hardware constraints, failure modes, and systems design. That mindset now shapes every backend architecture, RAG pipeline, and LLM agent I deploy. Software is engineered with the same tolerance discipline an electrical engineer applies to circuit design — because the cost of failure is equally real.
              </p>
              <p>
                I specialize at the intersection of deterministic AI engineering and enterprise backend architecture: the place where LLMs stop being interesting demos and start being reliable, auditable components of mission-critical systems.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {["LangGraph", "FastAPI", "Next.js 14", "RAG Pipelines", "Python", "TypeScript", "PostgreSQL", "Healthcare AI"].map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <ResumeDownload />
              <Link href="/contact">
                <Button size="lg" variant="primary" className="font-bold gap-2 shadow-sm">
                  Let&apos;s Talk <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center lg:justify-end -translate-y-12"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-accent/5 rounded-full blur-[120px] -z-10" />

            {/* Floating Chip */}
            <div className="absolute top-8 right-0 z-20 flex items-center gap-2 rounded-full border border-border-default bg-base/80 px-4 py-2 backdrop-blur-md shadow-lg">
              <Bot className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold">Deterministic AI</span>
            </div>

            {/* Floating Chip */}
            <div className="absolute top-56 right-0 z-20 flex items-center gap-2 rounded-full border border-border-default bg-base/80 px-4 py-2 backdrop-blur-md shadow-lg">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold">High-Performance APIs</span>
            </div>

            {/* Image + Card Container */}
            <div className="mt-[-40px] flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-border-default bg-elevated shadow-2xl md:h-80 md:w-80">
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

              {/* Glass Stats Card */}
              <div className="mt-8 w-full max-w-sm rounded-2xl border border-border-default bg-base/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-primary">Current Position</p>
                    <p className="text-xs text-secondary">AI Engineer & IT Manager</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-3xl font-bold text-primary">4+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">Years</p>
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-primary">37+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">Projects</p>
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-primary">1</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">Publication</p>
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">Awards</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}