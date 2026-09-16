"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Code2 } from "lucide-react";
import { HeroContainer } from "@/components/layout/HeroContainer";
import { Button } from "@/components/ui/Button";
import { DirectAnswer } from "@/components/seo/DirectAnswer";
import { Magnetic } from "@/components/fx/Magnetic";
import { HudFrame } from "@/components/fx/HudFrame";
import { downloadResume } from "@/lib/download-resume";

const LINES = [
  { label: "orchestrator", value: "LangGraph + Groq", ok: "READY" },
  { label: "retrieval", value: "hybrid + pgvector", ok: "24ms" },
  { label: "voice", value: "barge-in streaming", ok: "OK" },
  { label: "markets", value: "CA · FL · remote", ok: "LIVE" },
];

export function HomeHero() {
  return (
    <HeroContainer pattern="dots">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <motion.div
          className="flex flex-col gap-6 lg:col-span-7"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-elevated/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                Open to freelance & full-time
              </span>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Senior AI Engineer</span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}
            className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary lg:text-6xl"
          >
            Hire a senior AI engineer for custom call agents, chatbots, and RAG.
          </motion.h1>

          <motion.div variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
            <DirectAnswer title="Direct answer">
              Musharraf Aziz is a senior AI engineer available for remote freelance projects and full-time roles. He
              builds custom AI call agents, custom AI chatbots, RAG agents, and workflow automation for California and
              Florida companies.
            </DirectAnswer>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link href="/contact?intent=freelance" className="inline-flex">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}>
                  Hire for a project
                </Button>
              </Link>
            </Magnetic>
            <Link href="/hire" className="inline-flex">
              <Button variant="secondary" size="lg">
                Freelance or full-time
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}
            className="mt-4 flex flex-wrap items-center gap-4 border-t border-border-default pt-6"
          >
            <button
              type="button"
              onClick={downloadResume}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border-default bg-elevated/80 px-6 py-3 font-semibold text-primary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
              Download Resume
            </button>
            <Link href="https://github.com/engrmaziz" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
                <Code2 className="h-4 w-4" /> GitHub
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <HudFrame label="ragx.telemetry" className="overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
              <div className="h-12 w-full bg-gradient-to-b from-accent/40 to-transparent motion-safe:animate-hud-scan" />
            </div>
            <div className="mb-6 flex items-center gap-3 border-b border-border-default/60 pb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-gold/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
                system_health.log
              </span>
            </div>
            <div className="space-y-4 font-mono text-sm">
              {LINES.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-secondary">
                  <span>
                    <span className="text-accent">&gt;</span> {row.label}
                    <span className="text-primary/70"> · {row.value}</span>
                  </span>
                  <span className="text-accent">{row.ok}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border-default/60 pt-6">
              {[
                ["TTFT", "<500ms"],
                ["Voice", "sub-400"],
                ["RAG", "cited"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border-default bg-base/50 px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">{k}</p>
                  <p className="mt-1 font-display text-lg text-primary">{v}</p>
                </div>
              ))}
            </div>
          </HudFrame>
        </motion.div>
      </div>
    </HeroContainer>
  );
}
