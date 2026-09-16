"use client";

import * as React from "react";
import Link from "next/link";
import { Code2, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/fx/Reveal";
import { HudFrame, SectionEyebrow } from "@/components/fx/HudFrame";
import { Magnetic } from "@/components/fx/Magnetic";
import { ProjectFlow } from "@/components/fx/ProjectFlow";

const FLAGSHIP = [
  {
    slug: "self-healing-rag",
    title: "Self-Healing RAG Pipeline",
    source: "https://github.com/engrmaziz/Self-Healing-RAG-Pipeline",
    tags: ["Python", "FastAPI", "Qdrant", "Groq"],
    problem: "Naive RAG answers from whatever the vector store returns. Bad chunks become confident hallucinations.",
    solution: "Corrective RAG with a confidence firewall: grade retrieval, rewrite the query, re-retrieve, or refuse.",
    result: "Groq grading hop dropped from 1.2s to 180ms. The model fails closed instead of inventing.",
    variant: "rag" as const,
    visualFirst: true,
  },
  {
    slug: "voicerag",
    title: "VoiceRAG Core",
    source: "https://github.com/engrmaziz/voice-rag",
    tags: ["Django", "WebSockets", "Whisper", "LangGraph"],
    problem: "Blocking LLM round-trips make telephony agents sound robotic. Anything over a second breaks the call.",
    solution: "ASGI WebSocket pipeline: Whisper STT, hybrid Pinecone + BM25 retrieval, streamed Groq tokens into TTS.",
    result: "Sub-500ms conversational loop with barge-in, used in production at 1,000+ daily interactions.",
    variant: "voice" as const,
    visualFirst: false,
  },
];

export function Projects() {
  return (
    <Section id="projects" className="border-y border-border-default bg-elevated/40">
      <Container>
        <Reveal className="mb-16">
          <SectionEyebrow>Portfolio</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold text-primary md:text-5xl">Flagship Architecture</h2>
        </Reveal>

        <div className="space-y-8">
          {FLAGSHIP.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <HudFrame className="grid overflow-hidden md:grid-cols-2">
                <div
                  className={`relative min-h-[220px] overflow-hidden bg-base/60 sm:min-h-[260px] md:min-h-[300px] ${
                    project.visualFirst ? "" : "order-1 md:order-2"
                  }`}
                >
                  <ProjectFlow variant={project.variant} />
                </div>
                <div
                  className={`flex flex-col justify-center p-6 sm:p-8 md:p-10 ${
                    project.visualFirst ? "" : "order-2 md:order-1"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="mb-4 font-display text-2xl font-bold text-primary sm:text-3xl">{project.title}</h3>
                  <div className="mb-8 space-y-4">
                    <p className="text-secondary">{project.problem}</p>
                    <p className="text-secondary">{project.solution}</p>
                    <p className="font-medium text-primary">{project.result}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-[color:var(--color-bg-base)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-gold)_35%,transparent)] transition-colors hover:bg-gold-hover"
                    >
                      View Case Study
                    </Link>
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-default bg-elevated/80 px-6 text-sm font-semibold text-primary backdrop-blur-md transition-colors hover:border-accent/50"
                    >
                      <Code2 className="h-4 w-4" /> Source
                    </a>
                  </div>
                </div>
              </HudFrame>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Magnetic>
            <Link
              href="/projects"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-accent/50 bg-transparent px-8 text-lg font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </Container>
    </Section>
  );
}
