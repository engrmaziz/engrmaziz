"use client";

import * as React from "react";
import Link from "next/link";
import { Database, Code2, ArrowRight, MessageSquare } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/fx/Reveal";
import { HudFrame, SectionEyebrow } from "@/components/fx/HudFrame";
import { Magnetic } from "@/components/fx/Magnetic";

export function Projects() {
  return (
    <Section id="projects" className="border-y border-border-default bg-elevated/40">
      <Container>
        <Reveal className="mb-16">
          <SectionEyebrow>Portfolio</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold text-primary md:text-5xl">Flagship Architecture</h2>
        </Reveal>

        <div className="space-y-8">
          <Reveal>
            <HudFrame className="grid overflow-hidden md:grid-cols-2">
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-base/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_55%)]" />
                <Database className="relative h-24 w-24 text-accent/30" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  {["Python", "FastAPI", "Pinecone", "LangChain"].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <h3 className="mb-4 font-display text-3xl font-bold text-primary">Enterprise RAG Engine</h3>
                <div className="mb-8 space-y-4">
                  <p className="text-secondary">Legacy documentation systems caused 40% support ticket bloat due to unsearchable, siloed data.</p>
                  <p className="text-secondary">Architected a distributed vector search pipeline with dynamic metadata filtering and semantic chunking.</p>
                  <p className="font-medium text-primary">Reduced MTTR by 60% and automated 15,000+ support queries monthly.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/projects"><Button>View Case Study</Button></Link>
                  <Button variant="secondary" className="gap-2"><Code2 className="h-4 w-4" /> Source</Button>
                </div>
              </div>
            </HudFrame>
          </Reveal>

          <Reveal delay={0.08}>
            <HudFrame className="grid overflow-hidden md:grid-cols-2">
              <div className="order-2 flex flex-col justify-center p-8 md:order-1 md:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  {["Node.js", "WebSockets", "Twilio", "OpenAI"].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <h3 className="mb-4 font-display text-3xl font-bold text-primary">Real-time Voice AI Gateway</h3>
                <div className="mb-8 space-y-4">
                  <p className="text-secondary">High latency in LLM responses made telephony voice agents sound robotic and interruptive.</p>
                  <p className="text-secondary">Built a custom streaming WebSocket server that chunks STT/TTS streams concurrently, achieving sub-400ms TTFB.</p>
                  <p className="font-medium text-primary">Scaled to handle 500+ concurrent inbound calls with a 98% human-retention rate.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/projects"><Button>View Case Study</Button></Link>
                  <Button variant="secondary" className="gap-2"><Code2 className="h-4 w-4" /> Source</Button>
                </div>
              </div>
              <div className="relative order-1 flex min-h-[280px] items-center justify-center overflow-hidden bg-base/60 md:order-2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,color-mix(in_srgb,var(--color-gold)_16%,transparent),transparent_55%)]" />
                <MessageSquare className="relative h-24 w-24 text-gold/40" />
              </div>
            </HudFrame>
          </Reveal>
        </div>

        <div className="mt-16 flex justify-center">
          <Magnetic>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2">
                View All Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Magnetic>
        </div>
      </Container>
    </Section>
  );
}
