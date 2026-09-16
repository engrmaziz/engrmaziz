"use client";

import * as React from "react";
import { Server, Database, Cloud, Globe, GitBranch } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "@/components/fx/TiltCard";
import { Reveal } from "@/components/fx/Reveal";
import { SectionEyebrow } from "@/components/fx/HudFrame";

const STACK = [
  { category: "Backend Core", icon: Server, items: ["Python", "Go", "Node.js", "FastAPI", "Express"] },
  { category: "AI & Data", icon: Database, items: ["PyTorch", "LangChain", "Pinecone", "Milvus", "OpenAI API"] },
  { category: "Cloud & DevOps", icon: Cloud, items: ["AWS", "GCP", "Docker", "Kubernetes", "GitHub Actions"] },
  { category: "Databases", icon: Database, items: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch"] },
  { category: "Frontend", icon: Globe, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Architecture", icon: GitBranch, items: ["Microservices", "Event-Driven", "REST", "GraphQL", "WebSockets"] },
];

export function Stack() {
  return (
    <Section className="border-y border-border-default bg-elevated/40">
      <Container>
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <SectionEyebrow>Stack</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold text-primary md:text-5xl">Technical Arsenal</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
          {STACK.map((stack, i) => (
            <Reveal key={stack.category} delay={i * 0.05}>
              <TiltCard className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <stack.icon className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-xl font-bold text-primary">{stack.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
