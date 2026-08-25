"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Server, Cpu, Database, Globe, MessageSquare, LineChart, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Services() {
  return (
    <Section id="services" className="bg-base">
      <Container>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4">Capabilities</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Custom AI Call Agents, Chatbots, RAG & Automation</h2>
          <p className="text-lg text-secondary">
            Production systems for California and Florida teams: voice, chat, retrieval, and the workflows that connect them.
          </p>
        </motion.div>

        <ContentGrid columns={3} gap="lg">
          {[
            { title: "Custom AI Call Agents", href: "/services/ai-agents/ai-call-agents", icon: MessageSquare, desc: "Inbound and outbound AI call agents with CRM write-back, queues, and human overflow—not a hosted receptionist with no memory." },
            { title: "Custom AI Chatbots", href: "/services/ai-agents/chatbots", icon: Globe, desc: "Website and in-app chatbots with RAG, streaming, and actions that book, route, and escalate." },
            { title: "RAG Agents", href: "/services/ai-engineering/rag-development", icon: Database, desc: "Production retrieval-augmented generation: hybrid search, citations, evals, and permission-aware corpora." },
            { title: "Workflow Automation", href: "/services/technical-consulting/workflow-automation", icon: LineChart, desc: "Python, webhook, and agent workflows that connect phones, CRMs, and back-office systems." },
            { title: "AI Voice Agents", href: "/services/ai-agents/voice-agents", icon: Cpu, desc: "Low-latency conversational voice with barge-in, tool-calling, and bilingual routing for Florida and California lines." },
            { title: "Backend Engineering", href: "/services/software-engineering/backend-engineering", icon: Server, desc: "APIs, queues, and concurrency so call agents and RAG actually hold production load." }
          ].map((service, i) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card interactive className="h-full bg-elevated border border-border-default hover:border-accent/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary leading-relaxed">{service.desc}</p>
                </CardContent>
                <CardFooter>
                  <Link href={service.href} className="text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1 group">
                    Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </ContentGrid>
      </Container>
    </Section>
  );
}
