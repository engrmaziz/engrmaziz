import { createHash } from 'crypto';
import { IngestionDocument, Chunk } from './types';
import { INGESTION_CONSTANTS } from './constants';
import { generateMetadata } from './metadata';

export class DocumentChunker {
  public chunk(document: IngestionDocument): Chunk[] {
    const { content } = document;
    const { CHUNK_SIZE_CHARS, CHUNK_OVERLAP_CHARS } = INGESTION_CONSTANTS;
    
    const chunks: Chunk[] = [];
    
    if (content.length === 0) {
      return chunks;
    }

    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < content.length) {
      const endIndex = Math.min(startIndex + CHUNK_SIZE_CHARS, content.length);
      const textChunk = content.substring(startIndex, endIndex);

      const chunkId = this.generateChunkId(document.id, chunkIndex);
      
      const chunk: Chunk = {
        id: chunkId,
        content: textChunk,
        metadata: generateMetadata(document, chunkId, chunkIndex)
      };

      chunks.push(chunk);

      if (endIndex === content.length) {
        break; // reached the end
      }
      
      // Advance by size minus overlap
      startIndex += (CHUNK_SIZE_CHARS - CHUNK_OVERLAP_CHARS);
      chunkIndex++;
    }

    return chunks;
  }

  private generateChunkId(documentId: string, chunkIndex: number): string {
    const payload = `${documentId}:${chunkIndex}`;
    return createHash('sha256').update(payload).digest('hex');
  }
}
