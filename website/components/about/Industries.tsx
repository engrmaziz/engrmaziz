"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Zap, Network, Shield, Building2, Terminal, Bot } from "lucide-react";
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

const industries = [
  {
    name: "Healthcare / MedTech",
    icon: <Heart className="w-8 h-8" />,
    detail: "Clinical AI, RAG systems, PHI redaction, hospital workflow automation.",
  },
  {
    name: "E-Commerce / Retail Tech",
    icon: <TrendingUp className="w-8 h-8" />,
    detail: "High-traffic storefronts, multi-channel inventory sync, payment gateway integration.",
  },
  {
    name: "Renewable Energy / Solar",
    icon: <Zap className="w-8 h-8" />,
    detail: "NOC architecture, inverter telemetry APIs, QA protocol engineering.",
  },
  {
    name: "Telecommunications",
    icon: <Network className="w-8 h-8" />,
    detail: "Large-scale ISP operations, SLA management, 50,000+ connection monitoring.",
  },
  {
    name: "FinTech",
    icon: <Shield className="w-8 h-8" />,
    detail: "Real-time fraud detection, ML anomaly detection pipelines, secure payment flows.",
  },
  {
    name: "Enterprise SaaS",
    icon: <Building2 className="w-8 h-8" />,
    detail: "Multi-tenant platforms, subscription billing, self-healing backend architectures.",
  },
  {
    name: "Agriculture / IoT",
    icon: <Terminal className="w-8 h-8" />,
    detail: "LoRaWAN sensor networks, real-time decision support systems, award-winning FYP.",
  },
  {
    name: "Artificial Intelligence",
    icon: <Bot className="w-8 h-8" />,
    detail: "Production LLM orchestration, agentic workflows, deterministic AI system design.",
  },
];

export function Industries() {
  return (
    <Section className="bg-elevated py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Industries</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Industries Served
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Production experience across regulated and high-scale environments where engineering quality directly impacts real outcomes.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {industries.map((ind, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="h-full p-6 bg-base border border-border-default rounded-xl text-center hover:border-accent/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent group-hover:bg-accent/20 transition-colors duration-300">
                  {ind.icon}
                </div>
                <h3 className="text-xs font-bold text-primary mb-2 leading-snug">{ind.name}</h3>
                <p className="text-xs text-secondary leading-relaxed">{ind.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
