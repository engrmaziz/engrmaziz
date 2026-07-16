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

export class RAGContextBuilder {
  private defaultMaxTokens = 6000;

  /**
   * Builds an optimized, structured context string from retrieved chunks
   * by removing duplicates, merging neighboring sibling chunks, and enforcing a token budget.
   */
  buildContext(chunks: ContextChunk[], maxTokens: number = this.defaultMaxTokens): {
    contextText: string;
    citations: Array<{ title: string; url: string; category: string; pillar?: string }>;
  } {
    if (chunks.length === 0) {
      return { contextText: 'No relevant context found.', citations: [] };
    }

    // 1. Group chunks by document to preserve structural proximity
    const docGroups: Record<string, ContextChunk[]> = {};
    const uniqueCitations: Record<string, { id: number; title: string; url: string; category: string; pillar?: string }> = {};
    let citationCounter = 1;

    for (const chunk of chunks) {
      const docId = chunk.documentId;
      if (!docGroups[docId]) {
        docGroups[docId] = [];
      }
      docGroups[docId].push(chunk);

      // Collect human-readable citation references
      const meta = chunk.metadata;
      const citationKey = meta.url || meta.title;
      if (citationKey && !uniqueCitations[citationKey]) {
        uniqueCitations[citationKey] = {
          id: citationCounter++,
          title: meta.title,
          url: meta.url || '#',
          category: meta.category || 'general',
          ...(meta.pillar ? { pillar: meta.pillar } : {})
        };
      }
    }

    const contextBlocks: string[] = [];
    let currentTokens = 0;
    const tokenBudget = maxTokens;

    // 2. Iterate through each document group and merge adjacent chunks
    for (const docId of Object.keys(docGroups)) {
      const docChunks = docGroups[docId]!;
      // Sort chunks of the document in order of their sequence number
      docChunks.sort((a, b) => a.chunkNumber - b.chunkNumber);

      const mergedDocChunks: string[] = [];
      let lastChunkNumber = -999;
      let lastText = '';

      for (const chunk of docChunks) {
        const text = chunk.chunkText.trim();
        
        // If chunk is consecutive, merge to form a contiguous reading flow
        if (chunk.chunkNumber === lastChunkNumber + 1) {
          // Merge by checking for overlap. For simplicity and robustness, we join them
          // with a clean visual separator to indicate continuity
          lastText = `${lastText}\n\n[Continuity...]\n\n${text}`;
          if (mergedDocChunks.length > 0) {
            mergedDocChunks[mergedDocChunks.length - 1] = lastText;
          }
        } else {
          lastText = text;
          mergedDocChunks.push(lastText);
        }
        lastChunkNumber = chunk.chunkNumber;
      }

      // Format document blocks with clear metadata headers for the LLM
      const sampleMeta = docChunks[0]!.metadata;
      const citationKey = sampleMeta.url || sampleMeta.title;
      const sourceId = uniqueCitations[citationKey]?.id || '?';
      const docHeader = `[SOURCE ID: ${sourceId} | Title: ${sampleMeta.title}]\n---`;
      
      const docContent = mergedDocChunks.join('\n\n---\n\n');
      const docBlock = `${docHeader}\n${docContent}`;
      const docBlockTokens = this.estimateTokens(docBlock);

      // Enforce hard token budget limits
      if (currentTokens + docBlockTokens <= tokenBudget) {
        contextBlocks.push(docBlock);
        currentTokens += docBlockTokens;
      } else {
        // If we exceed the budget, see if we can pack parts of it
        const truncatedContent = docContent.substring(0, (tokenBudget - currentTokens) * 4);
        if (truncatedContent.length > 100) {
          contextBlocks.push(`${docHeader}\n${truncatedContent}\n... [Context truncated due to size limits]`);
        }
        break;
      }
    }

    const contextText = contextBlocks.join('\n\n==================================================\n\n');
    const citations = Object.values(uniqueCitations);

    return {
      contextText,
      citations
    };
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export const ragContextBuilder = new RAGContextBuilder();
