export interface CreateKnowledgeDocumentRequest {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface CreateKnowledgeDocumentResponse {
  documentId: string;
  chunkCount: number;
  storedRecordCount: number;
  durationMs: number;
  success: boolean;
}

export interface DeleteKnowledgeDocumentRequest {
  documentId: string;
}

export interface DeleteKnowledgeDocumentResponse {
  documentId: string;
  success: boolean;
}

export interface KnowledgeDocumentSummary {
  documentId: string;
  type: string;
  title: string;
  uploadedAt: string;
  status: string;
  metadata?: Record<string, any>;
}

export interface GetKnowledgeDocumentResponse {
  document: KnowledgeDocumentSummary | null;
}
