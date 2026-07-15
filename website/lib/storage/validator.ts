import { UpsertRequest } from './types';
import { StorageValidationError, DuplicateRecordError } from './errors';

export class StorageValidator {
  public validateUpsertRequest(request: UpsertRequest): void {
    if (!request.indexResult || !request.indexResult.document) {
      throw new StorageValidationError('UpsertRequest must contain a valid IndexResult document.');
    }

    const { documentId, chunks } = request.indexResult.document;

    if (!documentId) {
      throw new StorageValidationError('IndexResult must contain a valid documentId.');
    }

    if (!chunks || chunks.length === 0) {
      throw new StorageValidationError(`Document ${documentId} contains no chunks to store.`);
    }

    const seenChunkIds = new Set<string>();
    let expectedDimension: number | null = null;

    for (const chunk of chunks) {
      if (!chunk.chunkId || !chunk.text) {
        throw new StorageValidationError('Chunk is missing required chunkId or text.');
      }

      if (seenChunkIds.has(chunk.chunkId)) {
        throw new DuplicateRecordError(`Duplicate chunk ID found during storage validation: ${chunk.chunkId}`);
      }
      seenChunkIds.add(chunk.chunkId);

      if (!chunk.metadata || chunk.metadata.documentId !== documentId) {
        throw new StorageValidationError(`Chunk ${chunk.chunkId} has malformed or mismatched metadata.`);
      }

      if (!chunk.embedding || !Array.isArray(chunk.embedding) || chunk.embedding.length === 0) {
        throw new StorageValidationError(`Chunk ${chunk.chunkId} is missing a valid embedding array.`);
      }

      if (expectedDimension === null) {
        expectedDimension = chunk.embedding.length;
      } else if (chunk.embedding.length !== expectedDimension) {
        throw new StorageValidationError(`Dimensional consistency failure: Expected ${expectedDimension}, got ${chunk.embedding.length} for chunk ${chunk.chunkId}`);
      }
    }
  }
}
