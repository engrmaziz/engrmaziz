/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Chunk {
  text: string;
  chunkNumber: number;
  section: string;
  tokenCount: number;
  metadata: {
    section?: string;
    heading?: string;
    parent_heading?: string;
    prevContext?: string;
    nextContext?: string;
    [key: string]: any;
  };
}

interface AtomicElement {
  type: 'heading' | 'code' | 'table' | 'yaml' | 'text';
  text: string;
  tokenCount: number;
  heading?: string;
  level?: number;
}

export class RAGChunker {
  private defaultMaxTokens = 800;
  private defaultOverlapTokens = 120;

  /**
   * Split document content into chunks based on semantic structure and size limits.
   */
  chunk(
    content: string,
    documentType: string,
    maxTokens: number = this.defaultMaxTokens,
    overlapTokens: number = this.defaultOverlapTokens
  ): Chunk[] {
    if (documentType !== 'markdown') {
      return this.characterChunking(content, maxTokens, overlapTokens);
    }

    const elements = this.parseToAtomicElements(content);
    const chunks: Chunk[] = [];
    let currentChunkElements: AtomicElement[] = [];
    let currentTokens = 0;
    let chunkIndex = 0;

    // Track active heading hierarchy
    let activeHeading = 'Introduction';
    let activeParentHeading = '';
    const headingHierarchy: Record<number, string> = {};

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!el) continue;

      // Update heading hierarchy
      if (el.type === 'heading' && el.level !== undefined) {
        const level = el.level;
        headingHierarchy[level] = el.text;
        
        // Clear lower level headings
        for (let l = level + 1; l <= 6; l++) {
          delete headingHierarchy[l];
        }

        activeHeading = el.text;
        // Find closest parent heading (any higher level heading present in hierarchy)
        let foundParent = '';
        for (let l = level - 1; l >= 1; l--) {
          if (headingHierarchy[l]) {
            foundParent = headingHierarchy[l]!;
            break;
          }
        }
        activeParentHeading = foundParent;
      }

      // If el itself exceeds maxTokens, we must ingest it as a single chunk
      if (el.tokenCount >= maxTokens) {
        // Flush current chunk if any
        if (currentChunkElements.length > 0) {
          chunks.push(
            this.createChunkFromElements(
              currentChunkElements,
              chunkIndex++,
              activeHeading,
              activeParentHeading
            )
          );
          currentChunkElements = [];
          currentTokens = 0;
        }

        // Add this massive element as its own chunk
        chunks.push(
          this.createChunkFromElements(
            [el],
            chunkIndex++,
            activeHeading,
            activeParentHeading
          )
        );
        continue;
      }

      // If adding this element exceeds our budget, flush
      if (currentTokens + el.tokenCount > maxTokens && currentChunkElements.length > 0) {
        chunks.push(
          this.createChunkFromElements(
            currentChunkElements,
            chunkIndex++,
            activeHeading,
            activeParentHeading
          )
        );

        // Compute overlap: roll back and keep elements up to overlapTokens budget
        const overlapEls: AtomicElement[] = [];
        let overlapSize = 0;
        for (let j = currentChunkElements.length - 1; j >= 0; j--) {
          const prevEl = currentChunkElements[j];
          if (prevEl && overlapSize + prevEl.tokenCount <= overlapTokens) {
            overlapEls.unshift(prevEl);
            overlapSize += prevEl.tokenCount;
          } else {
            break;
          }
        }

        currentChunkElements = overlapEls;
        currentTokens = overlapSize;
      }

      currentChunkElements.push(el);
      currentTokens += el.tokenCount;
    }

    // Flush any remaining elements
    if (currentChunkElements.length > 0) {
      chunks.push(
        this.createChunkFromElements(
          currentChunkElements,
          chunkIndex++,
          activeHeading,
          activeParentHeading
        )
      );
    }

    // Link sibling chunks with context references
    return chunks.map((c, idx) => {
      const prevChunk = chunks[idx - 1];
      const nextChunk = chunks[idx + 1];
      
      return {
        ...c,
        metadata: {
          ...c.metadata,
          prevContext: prevChunk ? prevChunk.text.substring(0, 200) + '...' : undefined,
          nextContext: nextChunk ? nextChunk.text.substring(0, 200) + '...' : undefined,
        }
      } as Chunk;
    });
  }

  /**
   * Parse markdown text into atomic structural blocks (YAML, code, tables, headings, text)
   */
  private parseToAtomicElements(content: string): AtomicElement[] {
    const elements: AtomicElement[] = [];
    const lines = content.split('\n');
    let i = 0;

    // 1. Parse YAML Frontmatter
    if (lines[0]?.trim() === '---') {
      const yamlLines = [lines[0]];
      i++;
      while (i < lines.length && lines[i]?.trim() !== '---') {
        yamlLines.push(lines[i]!);
        i++;
      }
      if (i < lines.length) {
        yamlLines.push(lines[i]!); // include closing '---'
        i++;
      }
      const text = yamlLines.join('\n');
      elements.push({
        type: 'yaml',
        text,
        tokenCount: this.estimateTokens(text),
      });
    }

    while (i < lines.length) {
      const line = lines[i];
      if (line === undefined) {
        i++;
        continue;
      }

      const trimmed = line.trim();

      // Skip blank lines
      if (!trimmed) {
        i++;
        continue;
      }

      // 2. Parse Code Blocks
      if (trimmed.startsWith('```')) {
        const codeLines = [line];
        i++;
        while (i < lines.length && !lines[i]?.trim().startsWith('```')) {
          codeLines.push(lines[i]!);
          i++;
        }
        if (i < lines.length) {
          codeLines.push(lines[i]!); // include closing
          i++;
        }
        const text = codeLines.join('\n');
        elements.push({
          type: 'code',
          text,
          tokenCount: this.estimateTokens(text),
        });
        continue;
      }

      // 3. Parse Headings
      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1]!.length;
          const text = match[2]!;
          elements.push({
            type: 'heading',
            text,
            level,
            tokenCount: this.estimateTokens(line),
          });
          i++;
          continue;
        }
      }

      // 4. Parse Tables
      if (trimmed.startsWith('|')) {
        const tableLines = [line];
        i++;
        while (i < lines.length && lines[i]?.trim().startsWith('|')) {
          tableLines.push(lines[i]!);
          i++;
        }
        const text = tableLines.join('\n');
        elements.push({
          type: 'table',
          text,
          tokenCount: this.estimateTokens(text),
        });
        continue;
      }

      // 5. Paragraphs/Text Block
      const textLines = [line];
      i++;
      while (
        i < lines.length &&
        lines[i]?.trim() &&
        !lines[i]?.trim().startsWith('```') &&
        !lines[i]?.trim().startsWith('#') &&
        !lines[i]?.trim().startsWith('|')
      ) {
        textLines.push(lines[i]!);
        i++;
      }
      const text = textLines.join('\n');
      elements.push({
        type: 'text',
        text,
        tokenCount: this.estimateTokens(text),
      });
    }

    return elements;
  }

  /**
   * Character-based sliding window chunking for non-markdown files.
   */
  private characterChunking(content: string, maxTokens: number, overlapTokens: number): Chunk[] {
    const chunks: Chunk[] = [];
    const maxChars = maxTokens * 4;
    const overlapChars = overlapTokens * 4;
    let start = 0;
    let chunkIndex = 0;

    while (start < content.length) {
      const end = Math.min(start + maxChars, content.length);
      const text = content.substring(start, end).trim();
      
      chunks.push(
        this.createChunkRecord(text, chunkIndex++, 'General', '', maxTokens)
      );
      
      start += (maxChars - overlapChars);
      if (start >= content.length || end === content.length) {
        break;
      }
    }

    return chunks.map((c, idx) => {
      const prevChunk = chunks[idx - 1];
      const nextChunk = chunks[idx + 1];
      return {
        ...c,
        metadata: {
          ...c.metadata,
          prevContext: prevChunk ? prevChunk.text.substring(0, 200) + '...' : undefined,
          nextContext: nextChunk ? nextChunk.text.substring(0, 200) + '...' : undefined,
        }
      } as Chunk;
    });
  }

  private createChunkFromElements(
    elements: AtomicElement[],
    chunkNumber: number,
    heading: string,
    parentHeading: string
  ): Chunk {
    let text = elements.map((e) => e.text).join('\n\n');
    const tokenCount = elements.reduce((sum, e) => sum + e.tokenCount, 0);

    // Prefix context hierarchy
    const prefix = `[Context: ${parentHeading ? parentHeading + ' > ' : ''}${heading}]\n`;
    text = prefix + text;

    return {
      text,
      chunkNumber,
      section: heading,
      tokenCount,
      metadata: {
        section: heading,
        heading,
        parent_heading: parentHeading,
      },
    };
  }

  private createChunkRecord(
    text: string,
    chunkNumber: number,
    section: string,
    parentHeading: string,
    tokenCount: number
  ): Chunk {
    const prefix = `[Context: ${parentHeading ? parentHeading + ' > ' : ''}${section}]\n`;
    const enrichedText = text.startsWith('[Context:') ? text : prefix + text;

    return {
      text: enrichedText,
      chunkNumber,
      section,
      tokenCount,
      metadata: {
        section,
        heading: section,
        parent_heading: parentHeading,
      },
    };
  }

  private estimateTokens(text: string): number {
    // Standard rule: 1 token is roughly 4 characters in English
    return Math.ceil(text.length / 4);
  }
}

export const ragChunker = new RAGChunker();
