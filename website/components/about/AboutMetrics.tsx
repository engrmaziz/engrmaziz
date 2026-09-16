"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/fx/Reveal";

export function AboutMetrics() {
  return (
    <div className="border-y border-border-default bg-elevated/50">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-border-default md:grid-cols-4">
          {[
            { value: "Zero", label: "AI Hallucinations", sub: "Production RAG with evals" },
            { value: "500k+", label: "Monthly Visitors", sub: "E-commerce platform scaled" },
            { value: "99.95%", label: "Network Uptime", sub: "50,000+ ISP connections" },
            { value: "37+", label: "Production Projects", sub: "Documented engineering systems" },
          ].map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.05} className="px-6 py-8 text-center">
              <div className="mb-1 font-display text-3xl font-bold text-accent">{metric.value}</div>
              <div className="text-sm font-semibold text-primary">{metric.label}</div>
              <div className="mt-1 text-xs text-secondary">{metric.sub}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
