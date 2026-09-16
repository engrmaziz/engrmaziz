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

Education: B.S. (Hons.) Electrical Engineering, COMSATS University.`;

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

export function buildServiceOfferAnswer(): string {
  const items = (() => {
    try {
      const listed = listLeafServices();
      return listed.length ? listed : FALLBACK_SERVICES;
    } catch {
      return FALLBACK_SERVICES;
    }
  })();

  const bySlug = new Map(items.map((s) => [s.path.replace('/services/', ''), s]));
  const pick = (slug: string) => bySlug.get(slug);

  const line = (slug: string, pitch: string) => {
    const item = pick(slug);
    const name = item?.name || SHORT_SERVICE_NAMES[slug] || slug;
    return `- **${name}** — ${pitch}`;
  };

  const body = [
    'Musharraf Aziz is the engineer you hire when a chatbot demo is not enough. He designs production AI that answers the phone, grounds every reply in your data, and writes back to the systems your team already runs.',
    '',
    '**Agents that take action**',
    line('ai-agents/ai-call-agents', 'Inbound and outbound voice with CRM write-back, queues, and human overflow. Built for real call volume, not a receptionist that forgets the last sentence.'),
    line('ai-agents/chatbots', 'Website and in-app agents that retrieve, cite, book, and escalate — instead of looping the same FAQ.'),
    line('ai-agents/voice-agents', 'Sub-500ms conversational voice with barge-in and tool-calling, so callers can interrupt and still get a correct answer.'),
    line('ai-agents/whatsapp-agents', 'WhatsApp Business agents that handle async conversations, media, and booking without losing context overnight.'),
    line('ai-agents/telegram-agents', 'High-concurrency Telegram bots for support, ops, and gated communities — Python backends, not no-code toys.'),
    '',
    '**The intelligence layer**',
    line('ai-engineering/rag-development', 'Corrective RAG with hybrid retrieval, citations, and evals. The model fails closed instead of inventing.'),
    line('ai-engineering/llm-orchestration', 'LangGraph multi-agent workflows with deterministic routing, retries, and audit trails.'),
    line('ai-engineering/prompt-engineering', 'Production prompt systems: schemas, injection defense, and output you can actually parse.'),
    '',
    '**Product and backend**',
    line('software-engineering/backend-engineering', 'High-concurrency APIs, queues, and auth so agents and RAG hold production load.'),
    line('software-engineering/nextjs-development', 'Next.js App Router products that are fast, crawlable, and wired to the same APIs as the agents.'),
    line('software-engineering/saas-development', 'Multi-tenant SaaS: billing, RBAC, and dashboards — not a prototype that collapses at the first customer.'),
    '',
    '**Before you spend the budget**',
    line('technical-consulting/workflow-automation', 'Python and webhook automation that connects phones, CRMs, and back-office tools.'),
    line('technical-consulting/architecture-review', 'Architecture and code audits that name the bottleneck and the fix, not a slide deck of logos.'),
    line('technical-consulting/ai-feasibility-study', 'Feasibility and due diligence so you know the data, cost, and risk before you commit.'),
    '',
    'This is already in production: 1,000+ daily voice and WhatsApp interactions, hallucination-gated RAG, and e-commerce backends that served 500,000+ monthly visitors. Freelance builds and full-time US roles are both open.',
    '',
    'If you want a named engineer who owns the system through production, email [io@maziz.me](mailto:io@maziz.me) or start at [Hire Musharraf](/hire).',
    '',
    '**Explore the services**',
    ...items.map((s) => `- [${s.name}](${s.path})`),
  ];

  return body.join('\n');
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

