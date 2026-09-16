import { getAllServices } from '../services';

export const RAG_IDENTITY_FACTS = `Musharraf Aziz (ENGR., PEC registered) is a Senior Applied AI/ML Engineer with more than five years of production experience. He builds custom AI call agents, chatbots, RAG systems, multi-agent orchestration, backend APIs, and workflow automation. He is available for remote freelance projects and full-time hiring, and serves clients in California, Florida, and worldwide from Lahore. Contact: io@maziz.me.

Signature work:
- VoiceRAG / agentic CallBot: real-time voice and WhatsApp AI (Twilio, STT/TTS, Groq Llama 3.3 70B, 1,000+ daily production interactions)
- AegisFlow: visual workflow automation / FinTech orchestration
- Self-Healing RAG: corrective retrieval pipelines with evaluation gates
- LLM Guardrail Gateway: PII redaction and outbound schema validation
- Git Archaeologist: MCP server for Git history analysis

Current roles:
- Cygnus Technologies (Jul 2026 – Present): Senior Applied AI/ML Engineer — ETL, LangChain, LlamaIndex, AWS MLOps, Presidio PII redaction, hallucination evals
- Bano Qabil Pakistan / Alkhidmat Foundation (Aug 2026 – Present): Trainer, Applied Artificial Intelligence — part-time volunteer instructorship covering Python, LLMs, RAG, agents, embeddings, and MLOps

Prior experience:
- Allama Iqbal Hospital / AIHK (Aug 2024 – Jul 2026): AI Engineer & Operations Manager — production RAG voice/chat agents, n8n, MCP, Azure
- NovaSole (e-commerce scale, 500k+ monthly visitors), Ihsan Solar, Transworld Home (telecom)
- Alkhidmat Foundation: District Coordinator (volunteer emergency response, COVID-19 and 2025 Pakistan floods)

Education: B.S. (Hons.) Electrical Engineering, COMSATS University.

Resume: visitors download the current PDF at /Musharraf_Aziz_CV.pdf`;

const SHORT_SERVICE_NAMES: Record<string, string> = {
  'ai-agents/ai-call-agents': 'Custom AI Call Agents',
  'ai-agents/chatbots': 'Custom AI Chatbots',
  'ai-agents/voice-agents': 'AI Voice Agents',
  'ai-agents/whatsapp-agents': 'WhatsApp AI Agents',
  'ai-agents/telegram-agents': 'Telegram AI Bots',
  'ai-engineering/rag-development': 'Custom RAG Systems',
  'ai-engineering/llm-orchestration': 'LLM Orchestration',
  'ai-engineering/prompt-engineering': 'Prompt Engineering',
  'software-engineering/backend-engineering': 'Backend Engineering',
  'software-engineering/nextjs-development': 'Next.js Development',
  'software-engineering/saas-development': 'SaaS Development',
  'technical-consulting/workflow-automation': 'Workflow Automation',
  'technical-consulting/architecture-review': 'Architecture Review',
  'technical-consulting/ai-feasibility-study': 'AI Feasibility Studies',
};

const SITE = 'https://musharrafaziz.com';

function friendlyServiceName(slug: string, title: string): string {
  if (SHORT_SERVICE_NAMES[slug]) return SHORT_SERVICE_NAMES[slug];
  return title
    .replace(/\s+Company.*$/i, '')
    .replace(/\s+&\s+Services$/i, '')
    .replace(/\s+Services$/i, '')
    .trim();
}

function listLeafServices() {
  return getAllServices()
    .filter((s) => s.slugArray.length > 1)
    .map((s) => ({
      name: friendlyServiceName(s.slug, s.title),
      description: (s.description || '').replace(/\s+/g, ' ').trim(),
      path: `/services/${s.slug}`,
      url: `${SITE}/services/${s.slug}`,
    }));
}

/** Catalog for the LLM: full sentences, paths on their own line, never mid-word cuts. */
export function getCompactServiceCatalog(): string {
  if (cachedCatalog) return cachedCatalog;

  try {
    const items = listLeafServices();
    cachedCatalog = items.length
      ? items.map((s) => `- ${s.name} — ${s.description}\n  page: ${s.path}`).join('\n')
      : FALLBACK_SERVICE_CATALOG;
  } catch {
    cachedCatalog = FALLBACK_SERVICE_CATALOG;
  }

  return cachedCatalog;
}

const FALLBACK_SERVICES = [
  { name: 'Custom AI Call Agents', description: 'Inbound and outbound voice agents for sales and support.', path: '/services/ai-agents/ai-call-agents', url: `${SITE}/services/ai-agents/ai-call-agents` },
  { name: 'Custom AI Chatbots', description: 'Website and in-app conversational agents.', path: '/services/ai-agents/chatbots', url: `${SITE}/services/ai-agents/chatbots` },
  { name: 'AI Voice Agents', description: 'Real-time telephony voice AI.', path: '/services/ai-agents/voice-agents', url: `${SITE}/services/ai-agents/voice-agents` },
  { name: 'WhatsApp AI Agents', description: 'WhatsApp Business automation.', path: '/services/ai-agents/whatsapp-agents', url: `${SITE}/services/ai-agents/whatsapp-agents` },
  { name: 'Telegram AI Bots', description: 'Telegram support and sales bots.', path: '/services/ai-agents/telegram-agents', url: `${SITE}/services/ai-agents/telegram-agents` },
  { name: 'Custom RAG Systems', description: 'Grounded retrieval assistants on private data.', path: '/services/ai-engineering/rag-development', url: `${SITE}/services/ai-engineering/rag-development` },
  { name: 'LLM Orchestration', description: 'Multi-model routing and agent graphs.', path: '/services/ai-engineering/llm-orchestration', url: `${SITE}/services/ai-engineering/llm-orchestration` },
  { name: 'Prompt Engineering', description: 'Production prompt systems.', path: '/services/ai-engineering/prompt-engineering', url: `${SITE}/services/ai-engineering/prompt-engineering` },
  { name: 'Workflow Automation', description: 'Business process automation.', path: '/services/technical-consulting/workflow-automation', url: `${SITE}/services/technical-consulting/workflow-automation` },
  { name: 'Next.js Development', description: 'High-performance App Router products.', path: '/services/software-engineering/nextjs-development', url: `${SITE}/services/software-engineering/nextjs-development` },
  { name: 'Backend Engineering', description: 'FastAPI and Node APIs.', path: '/services/software-engineering/backend-engineering', url: `${SITE}/services/software-engineering/backend-engineering` },
  { name: 'SaaS Development', description: 'Full-stack product engineering.', path: '/services/software-engineering/saas-development', url: `${SITE}/services/software-engineering/saas-development` },
  { name: 'Architecture Review', description: 'Architecture and code audits.', path: '/services/technical-consulting/architecture-review', url: `${SITE}/services/technical-consulting/architecture-review` },
  { name: 'AI Feasibility Studies', description: 'Technical due diligence before you build.', path: '/services/technical-consulting/ai-feasibility-study', url: `${SITE}/services/technical-consulting/ai-feasibility-study` },
];

let cachedCatalog: string | null = null;

const FALLBACK_SERVICE_CATALOG = FALLBACK_SERVICES
  .map((s) => `- ${s.name} — ${s.description}\n  page: ${s.path}`)
  .join('\n');

const FOLLOW_UP_RE = /^(what about|and\b|also\b|how about|tell me more|that\b|it\b|those\b|this\b|why|how does it|compare (it|them|that)|same for)/i;

export type RagIntent = 'services' | 'experience' | 'identity' | 'hire' | 'generic';

const SERVICES_RE =
  /\b(services?|offerings?|what (can|does) (he|you|musharraf) (do|build|sell|offer)|what do you (do|offer|build)|capabilities|what (all )?can you)\b/i;
const EXPERIENCE_RE =
  /\b(experience|experiences|career|cv roles?|work history|where (did|has|have) (he|you) work|current (role|job|position|employer)|cygnus|allama iqbal|\baihk\b|bano qabil|alkhidmat|novasole|employment|who (does|did) he work)\b/i;
const IDENTITY_RE =
  /\b(who is|about musharraf|your background|tell me about (you|him|musharraf)|who are you)\b/i;
const HIRE_RE =
  /\b(hire you|how do i hire|book a meeting|get in touch|reach (him|musharraf)|full[- ]time|freelance)\b/i;

export function classifyRagIntent(query: string): RagIntent {
  const q = query.toLowerCase().trim();
  if (EXPERIENCE_RE.test(q)) return 'experience';
  if (SERVICES_RE.test(q)) return 'services';
  if (IDENTITY_RE.test(q)) return 'identity';
  if (HIRE_RE.test(q)) return 'hire';
  return 'generic';
}

export function isFollowUpQuery(query: string): boolean {
  return FOLLOW_UP_RE.test(query.trim());
}

export function expandFollowUpQuery(query: string, history: { role?: string; content?: string }[]): string {
  const trimmed = query.trim();
  if (classifyRagIntent(trimmed) !== 'generic') return trimmed;
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

