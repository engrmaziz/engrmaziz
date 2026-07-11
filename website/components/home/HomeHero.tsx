"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ArrowRight, FileText } from "lucide-react";
import { HeroContainer } from "@/components/layout/HeroContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function HomeHero() {
  return (
    <HeroContainer pattern="grid">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-elevated border border-border-default rounded-full w-fit shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-primary">Available for Q4 2026</span>
            </div>
            <Badge variant="outline" className="font-sans">Principal AI Engineer</Badge>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
            Architecting <span className="text-accent">Intelligence</span><br/> at Enterprise Scale.
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg lg:text-xl text-secondary max-w-2xl leading-relaxed">
            I design and build highly concurrent, fault-tolerant backend systems and production-grade RAG pipelines. Stop building wrappers—start building resilient AI infrastructure.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-4">
            <Link href="/projects">
              <Button size="lg" className="gap-2 group">
                View Architecture
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Discuss a Project
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-4 mt-6 pt-6 border-t border-border-default">
            <Link href="/resume.pdf" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
                <FileText className="w-4 h-4" /> Résumé
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
                <Code2 className="w-4 h-4" /> GitHub
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <GlassPanel withLiquidEffect className="p-8 border border-border-default shadow-2xl relative z-10 bg-base/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-default/50">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 font-mono text-xs text-secondary">system_health.log</span>
            </div>
            <div className="font-mono text-sm space-y-4">
              <div className="flex justify-between items-center text-secondary">
                <span>&gt; [SYSTEM] Initializing LLM Orchestrator...</span>
                <span className="text-green-500">OK</span>
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span>&gt; [RAG] Connecting Vector DB (Pinecone)...</span>
                <span className="text-green-500">24ms</span>
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span>&gt; [API] WebSocket Gateway...</span>
                <span className="text-green-500">10k C/s</span>
              </div>
              <div className="pt-4 border-t border-border-default/30 flex items-center justify-between">
                <span className="text-primary font-bold">SYSTEM STATUS</span>
                <Badge variant="accent">ONLINE</Badge>
              </div>
            </div>
          </GlassPanel>
          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-transparent blur-2xl -z-10 rounded-full opacity-50 pointer-events-none" />
        </motion.div>
      </div>
    </HeroContainer>
  );
}
