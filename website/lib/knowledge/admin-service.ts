import { knowledgeService } from './service';
import { storagePipeline } from '../storage/pipeline';
import { VectorRepository } from '../storage/repository';
import {
  CreateKnowledgeDocumentRequest,
  CreateKnowledgeDocumentResponse,
  DeleteKnowledgeDocumentRequest,
  DeleteKnowledgeDocumentResponse,
  GetKnowledgeDocumentResponse
} from './contracts';

export class AdminKnowledgeService {
  private repository: VectorRepository;

  constructor() {
    this.repository = new VectorRepository();
  }

  public async createDocument(req: CreateKnowledgeDocumentRequest): Promise<CreateKnowledgeDocumentResponse> {
    const result = await knowledgeService.ingest({
      document: {
        id: req.id,
        type: req.type,
        content: req.content,
        metadata: req.metadata
      }
    });

    return {
      documentId: result.documentId,
      chunkCount: result.statistics.chunkCount,
      storedRecordCount: result.statistics.storedRecordCount,
      durationMs: result.statistics.durationMs,
      success: result.success
    };
  }

  public async deleteDocument(req: DeleteKnowledgeDocumentRequest): Promise<DeleteKnowledgeDocumentResponse> {
    const result = await storagePipeline.deleteDocument({
      documentId: req.documentId
    });

    return {
      documentId: result.documentId,
      success: result.success
    };
  }

  public async getDocument(documentId: string): Promise<GetKnowledgeDocumentResponse> {
    const docMeta = await this.repository.getDocumentMetadata(documentId);
    
    if (!docMeta) {
      return { document: null };
    }

    return {
      document: {
        documentId: docMeta.id,
        type: docMeta.document_type,
        title: docMeta.title,
        uploadedAt: docMeta.created_at || new Date().toISOString(),
        status: docMeta.embedding_status || 'completed',
        metadata: docMeta.metadata || {}
      }
    };
  }
}

export const adminKnowledgeService = new AdminKnowledgeService();
