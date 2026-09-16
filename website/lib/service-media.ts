const HERO: Record<string, string> = {
  "ai-agents": "/images/services/ai-agents-hero.webp",
  "ai-call-agents": "/images/services/ai-call-agent-hero.webp",
  "voice-agents": "/images/services/ai-voice-agent-hero.webp",
  chatbots: "/images/services/chatbots-hero.webp",
  "whatsapp-agents": "/images/services/whatsapp-agents-tech.webp",
  "telegram-agents": "/images/services/ai-agents-hero.webp",
  "ai-engineering": "/images/services/ai-engineering-hero.webp",
  "llm-orchestration": "/images/services/ai-engineering-hero.webp",
  "rag-development": "/images/services/rag-development-tech.webp",
  "prompt-engineering": "/images/services/ai-engineering-hero.webp",
  "software-engineering": "/images/services/software-engineering-hero.webp",
  "backend-engineering": "/images/services/backend-engineering-tech.webp",
  "nextjs-development": "/images/services/software-engineering-hero.webp",
  "saas-development": "/images/services/software-engineering-hero.webp",
  "technical-consulting": "/images/services/technical-consulting-hero.webp",
  "architecture-review": "/images/services/technical-consulting-hero.webp",
  "ai-feasibility-study": "/images/services/technical-consulting-hero.webp",
  "workflow-automation": "/images/services/technical-consulting-hero.webp",
};

const TECH: Record<string, string> = {
  "ai-agents": "/images/services/ai-agents-tech.webp",
  "ai-call-agents": "/images/services/ai-call-agent-dashboard.webp",
  "voice-agents": "/images/services/ai-voice-agent-tech.webp",
  chatbots: "/images/services/chatbots-tech.webp",
  "whatsapp-agents": "/images/services/whatsapp-agents-tech.webp",
  "telegram-agents": "/images/services/ai-agents-tech.webp",
  "ai-engineering": "/images/services/ai-engineering-tech.webp",
  "llm-orchestration": "/images/services/ai-engineering-tech.webp",
  "rag-development": "/images/services/rag-development-tech.webp",
  "prompt-engineering": "/images/services/ai-engineering-tech.webp",
  "software-engineering": "/images/services/software-engineering-tech.webp",
  "backend-engineering": "/images/services/backend-engineering-tech.webp",
  "nextjs-development": "/images/services/software-engineering-tech.webp",
  "saas-development": "/images/services/software-engineering-tech.webp",
  "technical-consulting": "/images/services/technical-consulting-tech.webp",
  "architecture-review": "/images/services/technical-consulting-tech.webp",
  "ai-feasibility-study": "/images/services/technical-consulting-tech.webp",
  "workflow-automation": "/images/services/technical-consulting-tech.webp",
};

export function resolveServiceImage(slug: string, kind: "hero" | "tech") {
  const key = slug.split("/").filter(Boolean).pop() || slug;
  const table = kind === "hero" ? HERO : TECH;
  return table[key] || table[slug.split("/")[0] || ""] || HERO["ai-engineering"];
}
