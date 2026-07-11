import React from 'react';
import { Marquee } from '@/components/ui/Marquee';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

// Lucide Fallbacks
import {
  Bot, Database, Network, Code, FileText,
  Shield, Workflow, Terminal, Server, Globe,
  Cpu, Lock, Search, Zap, Layers, MessageCircle
} from "lucide-react";

// React Icons
import {
  SiHuggingface, SiPytorch, SiTensorflow, SiSupabase,
  SiPostgresql, SiRedis, SiSqlite, SiPandas, SiNumpy,
  SiPython, SiFastapi, SiDjango, SiNodedotjs, SiExpress,
  SiGraphql, SiNextdotjs, SiReact, SiTypescript, SiJavascript,
  SiTailwindcss, SiHtml5, SiFramer, SiSanity,
  SiZod, SiVercel, SiCloudflare, SiGithub, SiGithubactions,
  SiDocker, SiGooglecloud, SiLinux, SiNginx, SiZapier,
  SiMake, SiWhatsapp, SiTelegram, SiDiscord,
  SiPostman, SiInsomnia, SiSwagger, SiMarkdown
} from "react-icons/si";

interface TechPillProps {
  name: string;
  icon: React.ReactNode;
}

function TechPill({ name, icon }: TechPillProps) {
  return (
    <div 
      className="flex items-center gap-2 px-4 py-2 bg-base/50 backdrop-blur-sm border border-border-default rounded-full shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-accent/50 hover:bg-elevated transition-all duration-300 cursor-default"
      aria-label={`Technology: ${name}`}
      tabIndex={0}
    >
      <div className="w-5 h-5 flex items-center justify-center text-primary/80 shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium text-primary whitespace-nowrap">{name}</span>
    </div>
  );
}

const row1 = [
  { name: "OpenAI GPT-OSS", icon: <Bot /> },
  { name: "Groq", icon: <Cpu /> },
  { name: "LangChain", icon: <Network /> },
  { name: "LangGraph", icon: <Workflow /> },
  { name: "Vector Search", icon: <Layers /> },
  { name: "Jina AI", icon: <Search /> },
  { name: "Hugging Face", icon: <SiHuggingface /> },
  { name: "Transformers", icon: <Bot /> },
  { name: "PyTorch", icon: <SiPytorch /> },
  { name: "TensorFlow", icon: <SiTensorflow /> },
  { name: "Sentence Transformers", icon: <Layers /> },
  { name: "Local AI", icon: <Server /> },
  { name: "OpenRouter", icon: <Network /> },
  { name: "DSPy", icon: <Code /> },
  { name: "RAG", icon: <Database /> },
  { name: "Embeddings", icon: <Layers /> },
  { name: "Prompt Engineering", icon: <Terminal /> },
  { name: "Agentic AI", icon: <Bot /> },
];

const row2 = [
  { name: "Supabase", icon: <SiSupabase /> },
  { name: "PostgreSQL", icon: <SiPostgresql /> },
  { name: "pgvector", icon: <Database /> },
  { name: "Pinecone", icon: <Network /> },
  { name: "Weaviate", icon: <Database /> },
  { name: "Chroma", icon: <Database /> },
  { name: "Redis", icon: <SiRedis /> },
  { name: "SQLite", icon: <SiSqlite /> },
  { name: "Pandas", icon: <SiPandas /> },
  { name: "NumPy", icon: <SiNumpy /> },
  { name: "SQL", icon: <Database /> },
  { name: "JSON", icon: <FileText /> },
  { name: "CSV", icon: <FileText /> },
  { name: "Parquet", icon: <Database /> },
];

const row3 = [
  { name: "Python", icon: <SiPython /> },
  { name: "FastAPI", icon: <SiFastapi /> },
  { name: "Django", icon: <SiDjango /> },
  { name: "Node.js", icon: <SiNodedotjs /> },
  { name: "Express.js", icon: <SiExpress /> },
  { name: "REST API", icon: <Network /> },
  { name: "GraphQL", icon: <SiGraphql /> },
  { name: "WebSockets", icon: <Zap /> },
  { name: "AsyncIO", icon: <Zap /> },
  { name: "Pydantic", icon: <Code /> },
  { name: "Celery", icon: <Workflow /> },
  { name: "JWT", icon: <Lock /> },
  { name: "OAuth", icon: <Lock /> },
];

const row4 = [
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "React", icon: <SiReact /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "HTML5", icon: <SiHtml5 /> },
  { name: "CSS3", icon: <Globe /> },
  { name: "Framer Motion", icon: <SiFramer /> },
  { name: "Sanity CMS", icon: <SiSanity /> },
  { name: "React Hook Form", icon: <Code /> },
  { name: "Zod", icon: <SiZod /> },
  { name: "Vercel", icon: <SiVercel /> },
];

const row5 = [
  { name: "Cloudflare Turnstile", icon: <SiCloudflare /> },
  { name: "CSP", icon: <Shield /> },
  { name: "CORS", icon: <Shield /> },
  { name: "HTTPS", icon: <Lock /> },
  { name: "JWT", icon: <Lock /> },
  { name: "OAuth 2.0", icon: <Lock /> },
  { name: "RBAC", icon: <Shield /> },
  { name: "Rate Limiting", icon: <Shield /> },
  { name: "Input Validation", icon: <Shield /> },
  { name: "OWASP", icon: <Shield /> },
  { name: "Encryption", icon: <Lock /> },
  { name: "Secrets Management", icon: <Lock /> },
  { name: "Audit Logging", icon: <FileText /> },
];

const row6 = [
  { name: "Git", icon: <SiGithub /> },
  { name: "GitHub", icon: <SiGithub /> },
  { name: "GitHub Actions", icon: <SiGithubactions /> },
  { name: "Docker", icon: <SiDocker /> },
  { name: "Cloudflare", icon: <SiCloudflare /> },
  { name: "Vercel", icon: <SiVercel /> },
  { name: "Supabase", icon: <SiSupabase /> },
  { name: "Sanity", icon: <SiSanity /> },
  { name: "Resend", icon: <Globe /> },
  { name: "Google Cloud", icon: <SiGooglecloud /> },
  { name: "Google Calendar API", icon: <Globe /> },
  { name: "CI/CD", icon: <Workflow /> },
  { name: "Linux", icon: <SiLinux /> },
  { name: "Nginx", icon: <SiNginx /> },
];

const row7 = [
  { name: "n8n", icon: <Workflow /> },
  { name: "Zapier", icon: <SiZapier /> },
  { name: "Make", icon: <SiMake /> },
  { name: "WhatsApp API", icon: <SiWhatsapp /> },
  { name: "Telegram Bot API", icon: <SiTelegram /> },
  { name: "Discord API", icon: <SiDiscord /> },
  { name: "Slack API", icon: <MessageCircle /> },
  { name: "Webhooks", icon: <Network /> },
  { name: "Cron Jobs", icon: <Terminal /> },
  { name: "Email Automation", icon: <Globe /> },
  { name: "Workflow Automation", icon: <Workflow /> },
  { name: "API Integrations", icon: <Network /> },
];

const row8 = [
  { name: "Model Context Protocol", icon: <Network /> },
  { name: "Cursor", icon: <Code /> },
  { name: "Claude Code", icon: <Terminal /> },
  { name: "GitHub Copilot", icon: <SiGithub /> },
  { name: "VS Code", icon: <Code /> },
  { name: "Postman", icon: <SiPostman /> },
  { name: "Insomnia", icon: <SiInsomnia /> },
  { name: "Swagger", icon: <SiSwagger /> },
  { name: "OpenAPI", icon: <Network /> },
  { name: "Markdown", icon: <SiMarkdown /> },
  { name: "Mermaid", icon: <Workflow /> },
  { name: "JSON Schema", icon: <FileText /> },
  { name: "Playwright", icon: <Terminal /> },
];

export function SkillsShowcase() {
  return (
    <Section className="bg-base py-20 md:py-32 overflow-hidden">
      <Container>
        <div className="mb-16">
          <Badge variant="outline" className="mb-4">Skills</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Technical Expertise
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Expertise grouped into engineering domains, showcasing the technologies, frameworks, platforms, and tools I actively use to build production-grade AI systems.
          </p>
        </div>
      </Container>
      
      <div className="flex flex-col gap-6 md:gap-8 max-w-[100vw] overflow-hidden">
        <Marquee direction="left">
          {row1.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="right">
          {row2.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="left">
          {row3.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="right">
          {row4.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="left">
          {row5.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="right">
          {row6.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="left">
          {row7.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
        
        <Marquee direction="right">
          {row8.map((tech, i) => <TechPill key={i} name={tech.name} icon={tech.icon} />)}
        </Marquee>
      </div>
    </Section>
  );
}
