"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const learningRoadmap = [
  { status: "Active", item: "Kubernetes (K8s) for multi-node AI cluster orchestration" },
  { status: "Active", item: "Multimodal agent systems (video/audio native processing)" },
  { status: "Active", item: "Infrastructure as Code — Terraform" },
  { status: "Exploring", item: "WebAssembly (Wasm) for browser-side compute" },
  { status: "Exploring", item: "On-device AI inference (smaller models, private deployment)" },
  { status: "Exploring", item: "Distributed database systems — CockroachDB" },
  { status: "Roadmap", item: "Apache Kafka for event-driven enterprise architectures" },
  { status: "Roadmap", item: "Autonomous agentic swarms & multi-agent coordination protocols" },
];

export function LearningFocus() {
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
          <Badge variant="outline" className="mb-4">Learning Roadmap</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Current Learning Focus
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Continuous learning is a professional mandate, not a hobby. This is the current technical frontier being explored.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["Active", "Exploring", "Roadmap"] as const).map((status) => {
            const statusStyles = {
              Active: { color: "border-green-500/30 bg-green-500/5", dot: "bg-green-500 animate-pulse", label: "Currently Active" },
              Exploring: { color: "border-blue-500/30 bg-blue-500/5", dot: "bg-blue-400", label: "Exploring" },
              Roadmap: { color: "border-amber-500/30 bg-amber-500/5", dot: "bg-amber-400", label: "On Roadmap" },
            };
            const s = statusStyles[status];
            const items = learningRoadmap.filter((lr) => lr.status === status);
            return (
              <motion.div
                key={status}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className={`p-6 rounded-xl border h-full ${s.color}`}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">{s.label}</h3>
                  </div>
                  <ul className="space-y-3">
                    {items.map((lr, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm text-secondary leading-relaxed">{lr.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
