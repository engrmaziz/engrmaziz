"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Brain, Shield, Layers, FileCode, TrendingUp, BookOpen } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const philosophyPoints = [
  {
    icon: <Brain className="w-6 h-6 text-accent" />,
    title: "First-Principles Over Frameworks",
    text: "Every tool has a domain where it excels and a boundary where it fails. I learn the underlying mathematics and system constraints before adopting a framework, ensuring architectural decisions survive the inevitable churn of library ecosystems.",
  },
  {
    icon: <Shield className="w-6 h-6 text-accent" />,
    title: "Security as Architecture",
    text: "Security is not a layer bolted onto a finished system. It is designed into the data model, the API contract, and the deployment pipeline from day one. PII redaction, Row-Level Security, and Guardrail Gateways are structural, not optional.",
  },
  {
    icon: <Layers className="w-6 h-6 text-accent" />,
    title: "Determinism Over Hype",
    text: "In AI engineering, non-determinism is the enemy of production reliability. Every system enforces output schema validation, CI/CD LLM evaluation, and structured logging so that deviations are caught before they reach users.",
  },
  {
    icon: <FileCode className="w-6 h-6 text-accent" />,
    title: "Documentation as Infrastructure",
    text: "A system that cannot be maintained by a new engineer in three months is a liability. Documentation is versioned, reviewed, and architected for both human and machine consumption.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-accent" />,
    title: "Scale Readiness",
    text: "Architectures are designed for the scale the business will need in 18 months. Bounded contexts, stateless services, and connection pooling are decisions made at the design phase — not during an outage.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-accent" />,
    title: "Continuous Learning as Mandate",
    text: "The AI landscape evolves weekly. New frameworks are prototyped within days of release, certifications are pursued rigorously, and every project generates transferable architectural knowledge.",
  },
];

export function EngineeringPhilosophy() {
  return (
    <Section className="bg-base py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Philosophy</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Engineering Philosophy
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            How I think about building systems that will be maintained, extended, and trusted in production — sometimes in environments where failure has real human consequences.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {philosophyPoints.map((point, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="h-full p-6 bg-elevated border border-border-default rounded-xl hover:border-accent/30 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  {point.icon}
                </div>
                <h3 className="text-base font-bold text-primary mb-3">{point.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{point.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-16 relative"
        >
          <div className="p-8 md:p-12 bg-elevated border-y border-r border-l-4 border-l-accent border-y-border-default border-r-border-default rounded-r-2xl relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent z-0 pointer-events-none" />
            <div className="relative z-10 max-w-4xl mx-auto flex gap-6">
              <div className="hidden md:block">
                <span className="text-6xl font-serif text-accent/40 leading-none">&quot;</span>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-medium text-primary leading-relaxed mb-6">
                  Engineering is the art of constraints. The best architectures don&apos;t emerge from unlimited resources—they emerge from building the tightest possible system within the sharpest possible boundaries.
                </p>
                <p className="text-accent font-bold text-lg flex items-center gap-2">
                  — Musharraf Aziz <span className="text-secondary font-medium">· ENGR.</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
