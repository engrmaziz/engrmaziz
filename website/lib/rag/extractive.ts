import { RAG_IDENTITY_FACTS, buildServiceOfferAnswer } from './identity';
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
    return buildServiceOfferAnswer();
  }

  if (/hire you|how do i hire|book a meeting|\bcontact\b/.test(q)) {
    return [
      'Hire Musharraf as the production owner: freelance for a scoped build, or full-time on a US remote team.',
      '',
      'He already ships the hard parts — voice and WhatsApp agents at 1,000+ daily interactions, RAG with evaluation gates, and backends that held 500,000+ monthly visitors.',
      '',
      'Email [io@maziz.me](mailto:io@maziz.me) with the channel (voice, chat, RAG, or automation), the system of record, and whether this is a project or a seat. Or open the hire page and pick an intent.',
      '',
      '**Explore**',
      '- [Hire Musharraf](/hire)',
      '- [Contact](/contact)',
      '- [What he builds](/services)',
    ].join('\n');
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
    return `${buildServiceOfferAnswer()}`;
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
