"use client";

import * as React from "react";
import { Shield, Workflow, Terminal } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/fx/Reveal";
import { SectionEyebrow } from "@/components/fx/HudFrame";

const ITEMS = [
  {
    icon: Shield,
    title: "Security & Reliability",
    body: "Every API endpoint assumes it is under attack. Rate limiting, input validation, and zero-trust architectures are not afterthoughts—they are the foundation. Systems must fail gracefully and log aggressively.",
  },
  {
    icon: Workflow,
    title: "Scalable By Design",
    body: "Monoliths are fine until they aren't. I design systems with bounded contexts, preparing for horizontal scaling and decoupled microservices when the business demands it. Statelessness is paramount.",
  },
  {
    icon: Terminal,
    title: "Test Driven Reality",
    body: "Code without tests is legacy code the moment it is committed. I enforce strict CI/CD pipelines with unit, integration, and load testing. Documentation is treated as executable code.",
  },
];

export function Philosophy() {
  return (
    <Section className="bg-base">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative z-0 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionEyebrow>Philosophy</SectionEyebrow>
            <h2 className="mb-6 font-display text-3xl font-bold leading-tight text-primary md:text-5xl">
              Software is not just written. It is <span className="text-accent">architected.</span>
            </h2>
            <p className="text-lg text-secondary">
              I believe in backend-first thinking. A flashy frontend cannot hide a brittle database schema or a synchronous bottleneck.
            </p>
          </Reveal>

          <div className="relative z-10 flex flex-col gap-6 lg:col-span-7">
            {ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex gap-5 rounded-2xl border border-border-default bg-elevated p-6">
                  <item.icon className="mt-1 h-6 w-6 shrink-0 text-accent" />
                  <div>
                    <h3 className="mb-3 font-display text-2xl font-bold text-primary">{item.title}</h3>
                    <p className="text-lg leading-relaxed text-secondary">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
