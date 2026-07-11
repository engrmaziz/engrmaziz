/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
export interface Chunk {
  text: string;
  sequence: number;
  section?: string | undefined;
  prev?: string | undefined; // Reference to previous chunk text (overlap/context)
  next?: string | undefined; // Reference to next chunk text
}

export class SemanticChunker {
  /**
   * Intelligent Markdown semantic chunking.
   * Splits cleanly on Headers (##, ###) and avoids splitting within Code Blocks.
   */
  chunk(content: string, type: string): Chunk[] {
    if (type !== 'markdown' && type !== 'sanity') {
      return this.fallbackChunking(content);
    }

    const chunks: Chunk[] = [];
    const lines = content.split('\n');
    let currentChunk = '';
    let currentSection = 'Introduction';
    let sequence = 0;
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

      // If we hit a new header and we're not inside a code block, flush the chunk
      if (line.startsWith('#') && !inCodeBlock && currentChunk.trim().length > 100) {
        chunks.push({
          text: currentChunk.trim(),
          sequence: sequence++,
          section: currentSection
        });
        currentChunk = '';
        currentSection = line.replace(/#/g, '').trim();
      }

      currentChunk += line + '\n';
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        sequence: sequence++,
        section: currentSection
      });
    }

    // Attach neighboring context for overlapping retrieval expansion
    return chunks.map((c, i) => ({
      ...c,
      prev: i > 0 ? chunks[i - 1]?.text.substring(0, 100) : undefined,
      next: i < chunks.length - 1 ? chunks[i + 1]?.text.substring(0, 100) : undefined,
    }));
  }

  private fallbackChunking(content: string): Chunk[] {
    // Fallback fixed-length chunking with overlap for plain text / CSV
    const chunkSize = 1000;
    const overlap = 200;
    const chunks: Chunk[] = [];
    let i = 0;
    let seq = 0;

    while (i < content.length) {
      chunks.push({
        text: content.substring(i, i + chunkSize),
        sequence: seq++,
        section: 'General'
      });
      i += (chunkSize - overlap);
    }
    return chunks;
  }
}

export const semanticChunker = new SemanticChunker();
