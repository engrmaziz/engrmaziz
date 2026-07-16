/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export interface KnowledgeDocument {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeRequest {
  document: KnowledgeDocument;
}

export interface KnowledgeStatistics {
  chunkCount: number;
  storedRecordCount: number;
  durationMs: number;
}

export interface KnowledgeResult {
  documentId: string;
  success: boolean;
  statistics: KnowledgeStatistics;
}
