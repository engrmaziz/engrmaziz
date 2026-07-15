import { Chunk } from '../ingestion/types';
import { IndexedChunk } from './types';

export class RecordBuilder {
  /**
   * Transforms raw chunks and embeddings into pure, deterministic indexed records.
   * Does not validate, embed, or perform any side effects.
   */
  public buildRecord(chunk: Chunk, embedding: number[]): IndexedChunk {
    return {
      chunkId: chunk.id,
      documentId: chunk.metadata.documentId,
      text: chunk.content,
      embedding: embedding,
      metadata: chunk.metadata
    };
  }
}
