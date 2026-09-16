import { getAllServices } from '../services';

export const RAG_IDENTITY_FACTS = `Musharraf Aziz (ENGR., PEC registered) is a Senior Applied AI/ML Engineer with 4+ years of production experience since March 2022. He builds custom AI call agents, chatbots, RAG systems, multi-agent orchestration, and workflow automation. He is available for remote freelance projects and full-time hiring, and serves clients in California, Florida, and worldwide from Lahore. Contact: io@maziz.me.

Signature work:
- VoiceRAG: real-time voice AI (telephony, STT/TTS, Groq, sub-500ms target)
- AegisFlow: visual workflow automation / FinTech orchestration
- Self-Healing RAG: corrective retrieval pipelines with pgvector and evaluation gates
- AuraNode: knowledge-graph SaaS (Neo4j / semantic metadata)
- Dentl2: dental SaaS with 3D charting and patient dashboards
- Git Archaeologist: MCP server for Git history analysis

Experience includes Cygnus Technologies (applied AI), Allama Iqbal Hospital / AIHK (clinical LLM agents, zero-hallucination target), NovaSole (e-commerce scale), Ihsan Solar, Transworld Home (telecom), and Sybrid.

Education: B.S. (Hons.) Electrical Engineering, COMSATS University.`;

let cachedCatalog: string | null = null;

export function getCompactServiceCatalog(): string {
  if (cachedCatalog) return cachedCatalog;

  try {
    const items = getAllServices()
      .filter((s) => s.slugArray.length > 1)
      .map((s) => {
        const desc = (s.description || '').replace(/\s+/g, ' ').slice(0, 72);
        return `- ${s.title}${desc ? `: ${desc}` : ''} (/services/${s.slug})`;
      });
    cachedCatalog = items.length ? items.join('\n') : FALLBACK_SERVICE_CATALOG;
  } catch {
    cachedCatalog = FALLBACK_SERVICE_CATALOG;
  }

  return cachedCatalog;
}

const FALLBACK_SERVICE_CATALOG = `- AI Call Agents: inbound/outbound voice agents for sales and support (/services/ai-agents/ai-call-agents)
- Chatbots: website and in-app conversational agents (/services/ai-agents/chatbots)
- Voice Agents: real-time telephony voice AI (/services/ai-agents/voice-agents)
- WhatsApp Agents: WhatsApp Business automation (/services/ai-agents/whatsapp-agents)
- Telegram Agents: Telegram support/sales bots (/services/ai-agents/telegram-agents)
- RAG Development: grounded retrieval assistants on private data (/services/ai-engineering/rag-development)
- LLM Orchestration: multi-model routing and agent graphs (/services/ai-engineering/llm-orchestration)
- Prompt Engineering: production prompt systems (/services/ai-engineering/prompt-engineering)
- Workflow Automation: AegisFlow-style business process automation (/services/technical-consulting/workflow-automation)
- Next.js Development: high-performance App Router products (/services/software-engineering/nextjs-development)
- Backend Engineering: FastAPI/Node APIs (/services/software-engineering/backend-engineering)
- SaaS Development: full-stack product engineering (/services/software-engineering/saas-development)`;

const FOLLOW_UP_RE = /^(what about|and\b|also\b|how about|tell me more|that\b|it\b|those\b|this\b|why|how does it|compare (it|them|that)|same for)/i;

export function isFollowUpQuery(query: string): boolean {
  return FOLLOW_UP_RE.test(query.trim());
}

export function expandFollowUpQuery(query: string, history: { role?: string; content?: string }[]): string {
  const trimmed = query.trim();
  if (!isFollowUpQuery(trimmed)) return trimmed;

  const lastUser = [...history].reverse().find((m) => m.role === 'user' && m.content);
  if (!lastUser?.content) return trimmed;
  return `${lastUser.content} — follow-up: ${trimmed}`;
}

export function isToolHarnessQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  if (q.includes('echo:') || q.includes('infinite_loop_test') || q.includes('tool_failure_test') || q.includes('invalid_tool_test') || q.includes('schema_fail_test') || q.includes('multi_tool_test')) {
    return true;
  }
  return /^(health|status|time|timezone)$/i.test(q);
}

try {
  getCompactServiceCatalog();
} catch {
  // Catalog is filled lazily if the knowledge-base path is unavailable at import time.
}

