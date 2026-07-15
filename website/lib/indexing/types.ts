import { IngestionResult, ChunkMetadata } from '../ingestion/types';

export interface IndexedChunk {
  chunkId: string;
  documentId: string;
  text: string;
  embedding: number[];
  metadata: ChunkMetadata;
}

export interface IndexDocument {
  documentId: string;
  chunks: IndexedChunk[];
}

export interface IndexRequest {
  ingestionResult: IngestionResult;
}

export interface IndexStatistics {
  chunkCount: number;
  embeddingDurationMs: number;
}

export interface IndexResult {
  document: IndexDocument;
  statistics: IndexStatistics;
}
