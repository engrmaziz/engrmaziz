"use client";

import * as React from "react";
import Link from "next/link";
import { Server, Cpu, Database, Globe, MessageSquare, LineChart, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { TiltCard } from "@/components/fx/TiltCard";
import { Reveal } from "@/components/fx/Reveal";
import { SectionEyebrow } from "@/components/fx/HudFrame";

const SERVICES = [
  { title: "Custom AI Call Agents", href: "/services/ai-agents/ai-call-agents", icon: MessageSquare, desc: "Inbound and outbound AI call agents with CRM write-back, queues, and human overflow—not a hosted receptionist with no memory.", span: "md:col-span-2" },
  { title: "Custom AI Chatbots", href: "/services/ai-agents/chatbots", icon: Globe, desc: "Website and in-app chatbots with RAG, streaming, and actions that book, route, and escalate.", span: "" },
  { title: "RAG Agents", href: "/services/ai-engineering/rag-development", icon: Database, desc: "Production retrieval-augmented generation: hybrid search, citations, evals, and permission-aware corpora.", span: "" },
  { title: "Workflow Automation", href: "/services/technical-consulting/workflow-automation", icon: LineChart, desc: "Python, webhook, and agent workflows that connect phones, CRMs, and back-office systems.", span: "" },
  { title: "AI Voice Agents", href: "/services/ai-agents/voice-agents", icon: Cpu, desc: "Low-latency conversational voice with barge-in, tool-calling, and bilingual routing for Florida and California lines.", span: "" },
  { title: "Backend Engineering", href: "/services/software-engineering/backend-engineering", icon: Server, desc: "APIs, queues, and concurrency so call agents and RAG actually hold production load.", span: "md:col-span-2" },
];

export function Services() {
  return (
    <Section id="services" className="bg-base">
      <Container>
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <SectionEyebrow>Capabilities</SectionEyebrow>
          <h2 className="mb-6 font-display text-3xl font-bold text-primary md:text-5xl">
            Custom AI Call Agents, Chatbots, RAG & Automation
          </h2>
          <p className="text-lg text-secondary">
            Production systems for California and Florida teams: voice, chat, retrieval, and the workflows that connect them.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ perspective: 1200 }}>
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.05} className={service.span}>
              <Link href={service.href} className="block h-full cursor-pointer">
                <TiltCard className="min-h-[240px] p-7">
                  <service.icon className="mb-5 h-6 w-6 text-accent" />
                  <h3 className="mb-3 font-display text-2xl font-bold text-primary">{service.title}</h3>
                  <p className="mb-6 leading-relaxed text-secondary">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
