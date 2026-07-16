/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export type RetrievalStrategy = 'vector_only';

export interface RetrievalRequest {
  queryEmbedding: number[];
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
  strategy?: RetrievalStrategy;
}

export interface RetrievalCandidate {
  chunk_id: string;
  document_id: string;
  chunk_text: string;
  chunk_number: number;
  metadata: Record<string, any>;
  similarity: number;
}

export interface RetrievalStatistics {
  candidateCount: number;
  durationMs: number;
}

export interface RetrievalResult {
  candidates: RetrievalCandidate[];
  statistics: RetrievalStatistics;
}
