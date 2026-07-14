import { IngestionDocument, ChunkMetadata } from './types';

export function generateMetadata(document: IngestionDocument, chunkId: string, chunkIndex: number): ChunkMetadata {
  return {
    documentId: document.id,
    chunkId: chunkId,
    source: document.source,
    title: document.title,
    chunkIndex: chunkIndex
  };
}
