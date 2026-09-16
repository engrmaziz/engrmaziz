/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ContextChunk {
  chunkId: string;
  documentId: string;
  chunkText: string;
  chunkNumber: number;
  metadata: {
    title: string;
    url: string;
    category: string;
    pillar?: string;
    service?: string;
    project?: string;
    heading?: string;
    parent_heading?: string;
    [key: string]: any;
  };
  score: number;
}

const JSONLD_RE = /"@context"\s*:\s*"https:\/\/schema\.org"/i;

export class RAGContextBuilder {
  private defaultMaxTokens = 1600;

  buildContext(chunks: ContextChunk[], maxTokens: number = this.defaultMaxTokens): {
    contextText: string;
    citations: Array<{ id: number; title: string; url: string; category: string; pillar?: string }>;
  } {
    if (chunks.length === 0) {
      return { contextText: 'No additional source excerpts were retrieved.', citations: [] };
    }

    const citations: Array<{ id: number; title: string; url: string; category: string; pillar?: string }> = [];
    const blocks: string[] = [];
    let tokens = 0;
    let sourceId = 1;

    for (const chunk of chunks) {
      const text = this.cleanChunk(chunk.chunkText);
      if (!text) continue;

      const meta = chunk.metadata || {};
      const title = meta.title || 'Untitled';
      const url = meta.url || '#';
      const heading = meta.heading ? ` | ${meta.heading}` : '';
      const header = `[SOURCE ID: ${sourceId} | ${title}${heading}]`;
      const block = `${header}\n${text}`;
      const blockTokens = this.estimateTokens(block);

      if (tokens + blockTokens > maxTokens) {
        const remaining = Math.max(0, (maxTokens - tokens) * 4);
        if (remaining > 180) {
          blocks.push(`${header}\n${text.slice(0, remaining)}`);
          citations.push({ id: sourceId, title, url, category: meta.category || 'general', ...(meta.pillar ? { pillar: meta.pillar } : {}) });
        }
        break;
      }

      blocks.push(block);
      citations.push({ id: sourceId, title, url, category: meta.category || 'general', ...(meta.pillar ? { pillar: meta.pillar } : {}) });
      tokens += blockTokens;
      sourceId += 1;
    }

    return {
      contextText: blocks.join('\n\n---\n\n') || 'No additional source excerpts were retrieved.',
      citations
    };
  }

  private cleanChunk(raw: string): string {
    if (!raw) return '';
    if (JSONLD_RE.test(raw) && raw.trim().startsWith('```')) {
      const stripped = raw.replace(/```json[\s\S]*?```/g, '').trim();
      if (stripped.length < 80) return '';
      return stripped.replace(/\s+/g, ' ').trim();
    }
    return raw.replace(/\s+/g, ' ').trim();
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export const ragContextBuilder = new RAGContextBuilder();
