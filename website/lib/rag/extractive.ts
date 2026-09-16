import { RAG_IDENTITY_FACTS, getCompactServiceCatalog } from './identity';
import { RetrievedChunk } from './retriever';

const JSONLD_RE = /"@context"\s*:\s*"https:\/\/schema\.org"/i;

function clean(text: string): string {
  return text
    .replace(/```json[\s\S]*?```/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(JSONLD_RE, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isFastIntent(query: string): boolean {
  const q = query.toLowerCase();
  return /who is|about musharraf|your background|tell me about you|what services|what do you offer|services do you|call agent|voice agent|chatbot|whatsapp|telegram|hire you|contact/.test(q);
}

export function buildExtractiveAnswer(query: string, chunks: RetrievedChunk[]): string {
  const q = query.toLowerCase();

  if (/who is|about musharraf|your background|tell me about you/.test(q)) {
    return `${RAG_IDENTITY_FACTS.split('\n\n')[0]}\n\nAsk about a specific project or service if you want architecture details.`;
  }

  if (/what services|what do you offer|services do you/.test(q)) {
    return `Musharraf builds custom AI systems for hire. Core offerings:\n${getCompactServiceCatalog()}\n\nEmail io@maziz.me to start a project.`;
  }

  if (/aegisflow|\baegis\b/.test(q)) {
    const excerpt = chunks[0] ? clean(chunks[0].chunkText || '').slice(0, 380) : '';
    return `AegisFlow is Musharraf's visual workflow automation and FinTech orchestration platform (Next.js + FastAPI, with production ML where needed). ${excerpt}`.trim();
  }

  if (/dentl/.test(q)) {
    const excerpt = chunks[0] ? clean(chunks[0].chunkText || '').slice(0, 380) : '';
    return `Dentl2 is a dental SaaS product with patient dashboards and interactive 3D charting. ${excerpt}`.trim();
  }

  if (/voicerag|voice rag/.test(q)) {
    const excerpt = chunks[0] ? clean(chunks[0].chunkText || '').slice(0, 380) : '';
    return `VoiceRAG is Musharraf's real-time voice AI stack for telephony call agents (STT/TTS, Groq, sub-500ms target). ${excerpt}`.trim();
  }

  if (/call agent|voice agent|chatbot|whatsapp|telegram/.test(q)) {
    const catalog = getCompactServiceCatalog();
    const lines = catalog.split('\n').filter((line) => /call|voice|chat|whatsapp|telegram|rag/i.test(line));
    return `Yes. Musharraf designs and deploys custom AI call agents, voice agents, and chatbots for sales and support.\n${(lines.length ? lines : catalog.split('\n').slice(0, 6)).join('\n')}\n\nEmail io@maziz.me to scope a build.`;
  }

  const excerpts = chunks.slice(0, 2).map((chunk) => {
    const title = chunk.metadata?.title ? `${chunk.metadata.title}: ` : '';
    return `${title}${clean(chunk.chunkText || '').slice(0, 420)}`;
  }).filter(Boolean);

  if (excerpts.length === 0) {
    return `I can help with Musharraf Aziz's AI agents, RAG systems, workflow automation, and related services. ${RAG_IDENTITY_FACTS.split('\n')[0]} For project work, email io@maziz.me.`;
  }

  return excerpts.join('\n\n');
}
