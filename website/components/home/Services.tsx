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
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Engineering Solutions</h2>
          <p className="text-lg text-secondary">
            Transforming complex business requirements into scalable, fault-tolerant technical architectures.
          </p>
        </motion.div>

        <ContentGrid columns={3} gap="lg">
          {[
            { title: "Backend Engineering", icon: Server, desc: "High-performance microservices, API gateways, and distributed databases built with Go and Python." },
            { title: "AI/ML Engineering", icon: Cpu, desc: "Custom LLM orchestration, model fine-tuning, and production-grade agentic workflows." },
            { title: "RAG Pipelines", icon: Database, desc: "Advanced vector search, semantic chunking, and contextual retrieval for enterprise knowledge bases." },
            { title: "Full Stack Web Apps", icon: Globe, desc: "End-to-end web applications utilizing Next.js, React, and robust serverless architectures." },
            { title: "Voice & Call Agents", icon: MessageSquare, desc: "Real-time conversational AI pipelines with sub-second latency for telephony integrations." },
            { title: "Data Automation", icon: LineChart, desc: "ETL pipelines, workflow automation, and structured data extraction systems." }
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
                  <Link href={`/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1 group">
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
