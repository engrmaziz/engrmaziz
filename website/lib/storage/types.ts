import { IndexResult } from '../indexing/types';

export interface VectorRecord {
  documentId: string;
  chunkId: string;
  text: string;
  embedding: number[];
  metadata: any;
}

export interface UpsertRequest {
  indexResult: IndexResult;
}

export interface StorageStatistics {
  documentCount: number;
  chunkCount: number;
  persistedChunkCount: number;
  storageDurationMs: number;
}

export interface UpsertResult {
  documentId: string;
  statistics: StorageStatistics;
}

export interface DeleteRequest {
  documentId: string;
}

export interface DeleteResult {
  documentId: string;
  success: boolean;
}
