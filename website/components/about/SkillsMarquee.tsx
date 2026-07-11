"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, Cpu, Workflow, Network, Lock, Zap, Database, Layers, Search, FileText, TrendingUp, Shield, Terminal } from "lucide-react";
import {
  SiSupabase,
  SiPostgresql, SiRedis, SiPython, SiFastapi, SiNodedotjs, SiNextdotjs, SiTypescript, SiSanity,
  SiVercel, SiCloudflare, SiGithub, SiGithubactions,
  SiDocker, SiGooglecloud, SiLinux, SiNginx,
} from "react-icons/si";
import { Globe } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Marquee } from "@/components/ui/Marquee";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function SkillsMarquee() {
  return (
    <Section className="bg-base py-24 overflow-hidden">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <Badge variant="outline" className="mb-4">Skills</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Technical Expertise
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            The frameworks, platforms, and tools I actively use to build production-grade AI systems and high-performance backends.
          </p>
        </motion.div>
      </Container>

      <div className="flex flex-col gap-6 w-full max-w-[100vw] overflow-hidden group">
        <Marquee direction="left" className="py-4">
          {[...Array(3)].flatMap(() => [
            { name: "OpenAI GPT-OSS", icon: <Bot /> },
            { name: "Groq", icon: <Cpu /> },
            { name: "LangGraph", icon: <Workflow /> },
            { name: "LangChain", icon: <Network /> },
            { name: "FastAPI", icon: <SiFastapi /> },
            { name: "Python", icon: <SiPython /> },
            { name: "TypeScript", icon: <SiTypescript /> },
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "Node.js", icon: <SiNodedotjs /> },
            { name: "Supabase", icon: <SiSupabase /> },
            { name: "PostgreSQL", icon: <SiPostgresql /> },
            { name: "Redis", icon: <SiRedis /> },
            { name: "Docker", icon: <SiDocker /> },
            { name: "JWT", icon: <Lock /> },
            { name: "REST API", icon: <Network /> },
            { name: "WebSockets", icon: <Zap /> },
            { name: "RAG", icon: <Database /> },
            { name: "Vector Search", icon: <Layers /> },
            { name: "Jina Embeddings", icon: <Search /> },
            { name: "Hybrid Search", icon: <Workflow /> }
          ]).map((tech, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-3 bg-elevated/80 backdrop-blur-md border border-border-default rounded-full shadow-sm hover:border-accent/50 hover:bg-elevated hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-default">
              <div className="w-5 h-5 flex items-center justify-center text-primary/80 shrink-0">{tech.icon}</div>
              <span className="text-sm font-bold text-primary whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </Marquee>

        <Marquee direction="right" className="py-4">
          {[...Array(3)].flatMap(() => [
            { name: "Cloudflare", icon: <SiCloudflare /> },
            { name: "Vercel", icon: <SiVercel /> },
            { name: "GitHub", icon: <SiGithub /> },
            { name: "GitHub Actions", icon: <SiGithubactions /> },
            { name: "Linux", icon: <SiLinux /> },
            { name: "Nginx", icon: <SiNginx /> },
            { name: "Sanity", icon: <SiSanity /> },
            { name: "Resend", icon: <Globe /> },
            { name: "Google Cloud", icon: <SiGooglecloud /> },
            { name: "n8n", icon: <Workflow /> },
            { name: "MCP", icon: <Network /> },
            { name: "OCR", icon: <FileText /> },
            { name: "OpenRouter", icon: <Network /> },
            { name: "CI/CD", icon: <Workflow /> },
            { name: "Monitoring", icon: <TrendingUp /> },
            { name: "Security", icon: <Shield /> },
            { name: "Prompt Engineering", icon: <Terminal /> },
            { name: "Workflow Automation", icon: <Zap /> }
          ]).map((tech, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-3 bg-elevated/80 backdrop-blur-md border border-border-default rounded-full shadow-sm hover:border-accent/50 hover:bg-elevated hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-default">
              <div className="w-5 h-5 flex items-center justify-center text-primary/80 shrink-0">{tech.icon}</div>
              <span className="text-sm font-bold text-primary whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
