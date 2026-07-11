"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

const workingStylePoints = [
  {
    title: "Async-First Communication",
    description:
      "Written communication is precise and context-rich. Progress is documented in structured updates, not status meetings. Every message lands with full context.",
  },
  {
    title: "Architecture Before Code",
    description:
      "No production code gets written without an approved architecture document. Data flow, failure modes, and interfaces are specified before touching a terminal.",
  },
  {
    title: "Documentation as Engineering",
    description:
      "Exhaustive documentation — ADRs, C4 diagrams, RAG-optimized READMEs — is not optional. Knowledge silos are a liability. Documentation is a first-class deliverable.",
  },
  {
    title: "Metric-Driven Ownership",
    description:
      "Responsibility ends at measurable outcomes, not code commits. Every system ships with defined KPIs: latency budgets, SLA targets, error rate thresholds.",
  },
  {
    title: "Test-Gated Deployments",
    description:
      "CI/CD pipelines block deployment on test failure — no exceptions. For AI systems: DeepEval golden datasets. For APIs: comprehensive PyTest suites on every push.",
  },
  {
    title: "Servant Leadership",
    description:
      "Technical authority comes from demonstrated competence, not title. Code reviews are teaching documents. Junior engineers learn by doing, not watching.",
  },
];

export function WorkingStyle() {
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
          <Badge variant="outline" className="mb-4">Working Style</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            How I Work
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Process, communication, and ownership norms that have produced consistent results across healthcare, e-commerce, and infrastructure projects.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {workingStylePoints.map((point, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="h-full p-6 bg-elevated border border-border-default rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-accent text-xs font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-primary">{point.title}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
