import { IndexRequest, IndexedChunk } from './types';
import { IndexValidationError, DuplicateIndexError } from './errors';

export class IndexingValidator {
  public validateRequest(request: IndexRequest): void {
    if (!request.ingestionResult) {
      throw new IndexValidationError('IndexRequest must contain an ingestionResult.');
    }

    const { documentId, chunks } = request.ingestionResult;

    if (!documentId) {
      throw new IndexValidationError('IngestionResult must contain a documentId.');
    }

    if (!chunks || chunks.length === 0) {
      throw new IndexValidationError(`Document ${documentId} contains no chunks to index.`);
    }

    const seenChunkIds = new Set<string>();

    for (const chunk of chunks) {
      if (!chunk.id || !chunk.content) {
        throw new IndexValidationError(`Chunk is missing required ID or content.`);
      }

      if (seenChunkIds.has(chunk.id)) {
        throw new DuplicateIndexError(`Duplicate chunk ID found during indexing validation: ${chunk.id}`);
      }
      seenChunkIds.add(chunk.id);

      if (!chunk.metadata || chunk.metadata.documentId !== documentId || chunk.metadata.chunkId !== chunk.id) {
        throw new IndexValidationError(`Chunk ${chunk.id} has malformed or mismatched metadata.`);
      }
    }
  }

  public validateIndexedChunks(indexedChunks: IndexedChunk[]): void {
    for (const chunk of indexedChunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        throw new IndexValidationError(`Chunk ${chunk.chunkId} is missing its embedding.`);
      }
    }
  }
}
