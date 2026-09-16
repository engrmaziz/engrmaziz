import { RAG_IDENTITY_FACTS, classifyRagIntent } from './identity';
import { looksLikeBoilerplate, sliceAtBoundary } from './knowledge-clean';
import { RetrievedChunk } from './retriever';

export function sanitizeKnowledgeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*(overview|executive summary|engineering solution|our solution)\s+/i, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildExtractiveAnswer(query: string, chunks: RetrievedChunk[] = []): string {
  return buildGroundedFallback(chunks, query);
}

export function buildGroundedFallback(chunks: RetrievedChunk[] = [], query = ''): string {
  const intent = classifyRagIntent(query);
  if (intent === 'hire' || intent === 'identity') {
    return [
      RAG_IDENTITY_FACTS.split('\n\n')[0],
      '',
      intent === 'hire'
        ? 'Freelance builds and full-time US remote roles are both open. Email [io@maziz.me](mailto:io@maziz.me) with the channel (voice, chat, RAG, or automation) and whether this is a project or a seat. Resume: [Musharraf_Aziz_CV.pdf](/Musharraf_Aziz_CV.pdf).'
        : 'Ask about experience, a named project, or a service. Resume: [Musharraf_Aziz_CV.pdf](/Musharraf_Aziz_CV.pdf).',
      '',
      '**Explore**',
      '- [Hire Musharraf](/hire)',
      '- [About](/about)',
      '- [Resume](/Musharraf_Aziz_CV.pdf)',
    ].join('\n');
  }

  const usable = chunks
    .map((chunk) => sanitizeKnowledgeText(chunk.chunkText || ''))
    .filter((body) => body.length >= 80 && !looksLikeBoilerplate(body))
    .slice(0, 2)
    .map((body) => sliceAtBoundary(body, 380));

  if (usable.length === 0) {
    return [
      RAG_IDENTITY_FACTS.split('\n\n')[0],
      '',
      'Ask about a role, a project, or a service. Download the resume at [Musharraf_Aziz_CV.pdf](/Musharraf_Aziz_CV.pdf), or email io@maziz.me to hire.',
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
    'Email [io@maziz.me](mailto:io@maziz.me) or open [Hire Musharraf](/hire) if you want this in production. Resume: [Musharraf_Aziz_CV.pdf](/Musharraf_Aziz_CV.pdf).',
    '',
    '**Explore**',
    '- [About](/about)',
    '- [Services](/services)',
    '- [Hire](/hire)',
  ].join('\n');
}
