import { RAG_IDENTITY_FACTS } from './identity';
import { looksLikeBoilerplate, sliceAtBoundary } from './knowledge-clean';
import { RetrievedChunk } from './retriever';

export function sanitizeKnowledgeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildExtractiveAnswer(query: string, chunks: RetrievedChunk[] = []): string {
  return buildGroundedFallback(chunks, query);
}

export function buildGroundedFallback(chunks: RetrievedChunk[] = [], _query = ''): string {
  const usable = chunks
    .map((chunk) => {
      const heading = String(chunk.metadata?.heading || '');
      const title = String(chunk.metadata?.title || '');
      const body = sanitizeKnowledgeText(chunk.chunkText || '');
      if (!body || body.length < 60 || looksLikeBoilerplate(body)) return '';
      const skipHeading = /^(overview|introduction)$/i.test(heading);
      const lead = !skipHeading && heading && !body.toLowerCase().includes(heading.toLowerCase())
        ? heading
        : (title && !body.toLowerCase().includes(title.toLowerCase().slice(0, 24)) ? title : '');
      const composed = lead ? `**${lead}.** ${body}` : body;
      return sliceAtBoundary(composed, 420);
    })
    .filter(Boolean)
    .slice(0, 3);

  if (usable.length === 0) {
    return [
      RAG_IDENTITY_FACTS.split('\n\n')[0],
      '',
      'Ask about a role, a project, or a service. Email io@maziz.me to hire.',
      '',
      '**Explore**',
      '- [About](/about)',
      '- [Services](/services)',
      '- [Hire](/hire)',
    ].join('\n');
  }

  return [
    usable.join('\n\n'),
    '',
    'Email [io@maziz.me](mailto:io@maziz.me) or open [Hire Musharraf](/hire) if you want this in production.',
    '',
    '**Explore**',
    '- [About](/about)',
    '- [Services](/services)',
    '- [Hire](/hire)',
  ].join('\n');
}
