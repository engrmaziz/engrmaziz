import { IngestionDocument, Chunk } from './types';
import { InvalidDocumentError, DuplicateChunkError, InvalidChunkMetadataError } from './errors';
import { INGESTION_CONSTANTS } from './constants';

export class IngestionValidator {
  public validateDocument(document: IngestionDocument): void {
    if (!document.content || document.content.trim().length === 0) {
      throw new InvalidDocumentError(`Document ${document.id} is empty or contains only whitespace.`);
    }
  }

  public validateChunks(chunks: Chunk[]): void {
    const seenIds = new Set<string>();

    for (const chunk of chunks) {
      // Duplicate chunk IDs
      if (seenIds.has(chunk.id)) {
        throw new DuplicateChunkError(`Duplicate chunk ID found: ${chunk.id}`);
      }
      seenIds.add(chunk.id);

      // Oversized chunks (strictly enforcing constant size + 1 character buffer or strictly size)
      if (chunk.content.length > INGESTION_CONSTANTS.CHUNK_SIZE_CHARS) {
        throw new InvalidChunkMetadataError(`Chunk ${chunk.id} exceeds maximum size limit of ${INGESTION_CONSTANTS.CHUNK_SIZE_CHARS} characters.`);
      }

      // Invalid metadata
      if (!chunk.metadata || !chunk.metadata.documentId || !chunk.metadata.chunkId) {
        throw new InvalidChunkMetadataError(`Chunk ${chunk.id} has malformed metadata.`);
      }
      
      if (chunk.metadata.chunkId !== chunk.id) {
        throw new InvalidChunkMetadataError(`Chunk ${chunk.id} metadata chunkId mismatch: ${chunk.metadata.chunkId}`);
      }
    }
  }
}
