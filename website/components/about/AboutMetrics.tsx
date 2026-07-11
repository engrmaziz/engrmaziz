"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function AboutMetrics() {
  return (
    <div className="border-y border-border-default bg-elevated">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-default"
        >
          {[
            { value: "Zero", label: "AI Hallucinations", sub: "12+ months clinical production" },
            { value: "500k+", label: "Monthly Visitors", sub: "E-commerce platform scaled" },
            { value: "99.95%", label: "Network Uptime", sub: "50,000+ ISP connections" },
            { value: "37+", label: "Production Projects", sub: "Documented engineering systems" },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className="py-8 px-6 text-center"
            >
              <div className="text-3xl font-bold text-accent mb-1">{metric.value}</div>
              <div className="text-sm font-semibold text-primary">{metric.label}</div>
              <div className="text-xs text-secondary mt-1">{metric.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
