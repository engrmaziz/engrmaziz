"use client";

import * as React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/fx/Reveal";
import { SectionEyebrow } from "@/components/fx/HudFrame";
import { TracingRail } from "@/components/fx/TracingRail";

const PHASES = [
  { step: "01", title: "Discovery & Scope", desc: "Deep dive into business requirements, identifying constraints, scale expectations, and core data models." },
  { step: "02", title: "System Architecture", desc: "Drafting the blueprint. Selecting the right databases, defining API contracts, and planning the infrastructure." },
  { step: "03", title: "Agile Development", desc: "Writing clean, modular code with continuous integration. Building the core engine first, UI second." },
  { step: "04", title: "Rigorous Testing", desc: "Automated unit tests, integration tests, and simulated load testing to guarantee fault tolerance." },
  { step: "05", title: "Deployment & Ops", desc: "Containerized deployment to staging, blue-green production rollouts, and setting up observability dashboards." },
];

export function Process() {
  return (
    <Section className="bg-base">
      <Container>
        <Reveal className="mb-16">
          <SectionEyebrow>Methodology</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold text-primary md:text-5xl">Engineering Lifecycle</h2>
        </Reveal>

        <div className="relative">
          <TracingRail className="relative">
            <div className="space-y-10">
              {PHASES.map((phase, i) => (
                <Reveal
                  key={phase.step}
                  delay={i * 0.06}
                  className={`relative flex flex-col items-start gap-8 md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse md:text-right" : ""}`}
                >
                  <div className="md:w-1/2" />
                  <div className="absolute left-0 z-10 flex h-8 w-8 -translate-x-[15px] items-center justify-center rounded-full border border-accent bg-base font-mono text-xs font-bold text-accent md:left-1/2 md:-translate-x-1/2">
                    {phase.step}
                  </div>
                  <div className="flex w-full flex-col justify-center pl-12 md:w-1/2 md:pl-0">
                    <div className={`rounded-2xl border border-border-default bg-elevated/70 p-6 backdrop-blur-md ${i % 2 === 0 ? "md:mr-12" : "md:ml-12"}`}>
                      <h3 className="mb-2 font-display text-xl font-bold text-primary">{phase.title}</h3>
                      <p className="text-secondary">{phase.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </TracingRail>
        </div>
      </Container>
    </Section>
  );
}
