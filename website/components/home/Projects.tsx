"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Database, Code2, ArrowRight, MessageSquare } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stack } from "@/components/layout/Stack";
import { SplitLayout } from "@/components/layout/SplitLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Projects() {
  return (
    <Section id="projects" className="bg-elevated border-y border-border-default">
      <Container>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Portfolio</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">Flagship Architecture</h2>
        </motion.div>

        <Stack gap="xl">
          {/* Project 1 - Left Aligned */}
          <SplitLayout
            ratio="50/50"
            left={
              <div className="h-full min-h-[400px] rounded-xl overflow-hidden bg-base border border-border-default relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent z-0 pointer-events-none" />
                <Database className="w-24 h-24 text-accent/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 border border-border-elevated rounded-xl m-4 pointer-events-none" />
              </div>
            }
            right={
              <div className="flex flex-col h-full justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>Python</Badge>
                  <Badge>FastAPI</Badge>
                  <Badge>Pinecone</Badge>
                  <Badge>LangChain</Badge>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-4">Enterprise RAG Engine</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Problem</h4>
                    <p className="text-secondary">Legacy documentation systems caused 40% support ticket bloat due to unsearchable, siloed data.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Solution</h4>
                    <p className="text-secondary">Architected a distributed vector search pipeline with dynamic metadata filtering and semantic chunking.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Impact</h4>
                    <p className="text-primary font-medium">Reduced MTTR by 60% and automated 15,000+ support queries monthly.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <Button>View Case Study</Button>
                  <Button variant="secondary" className="gap-2"><Code2 className="w-4 h-4" /> Source</Button>
                </div>
              </div>
            }
          />

          {/* Project 2 - Right Aligned (Order reversed on desktop) */}
          <SplitLayout
            ratio="50/50"
            className="flex-col-reverse md:flex-row-reverse"
            left={
              <div className="h-full min-h-[400px] rounded-xl overflow-hidden bg-base border border-border-default relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 to-transparent z-0 pointer-events-none" />
                <MessageSquare className="w-24 h-24 text-accent/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 border border-border-elevated rounded-xl m-4 pointer-events-none" />
              </div>
            }
            right={
              <div className="flex flex-col h-full justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>Node.js</Badge>
                  <Badge>WebSockets</Badge>
                  <Badge>Twilio</Badge>
                  <Badge>OpenAI</Badge>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-4">Real-time Voice AI Gateway</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Problem</h4>
                    <p className="text-secondary">High latency in LLM responses made telephony voice agents sound robotic and interruptive.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Solution</h4>
                    <p className="text-secondary">Built a custom streaming WebSocket server that chunks STT/TTS streams concurrently, achieving sub-400ms TTFB.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Impact</h4>
                    <p className="text-primary font-medium">Scaled to handle 500+ concurrent inbound calls with a 98% human-retention rate.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <Button>View Case Study</Button>
                  <Button variant="secondary" className="gap-2"><Code2 className="w-4 h-4" /> Source</Button>
                </div>
              </div>
            }
          />
        </Stack>
        
        <div className="flex justify-center mt-16">
          <Link href="/projects">
            <Button variant="outline" size="lg" className="gap-2 group">
              View All Projects <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
