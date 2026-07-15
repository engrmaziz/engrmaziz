import { UpsertRequest, UpsertResult, DeleteRequest, DeleteResult } from './types';
import { StorageValidator } from './validator';
import { VectorRepository } from './repository';

export class StoragePipeline {
  private validator: StorageValidator;
  private repository: VectorRepository;

  constructor() {
    this.validator = new StorageValidator();
    this.repository = new VectorRepository();
  }

  public async upsert(request: UpsertRequest): Promise<UpsertResult> {
    const startTime = Date.now();

    // 1. Pure validation
    this.validator.validateUpsertRequest(request);

    const { documentId, chunks } = request.indexResult.document;

    // 2. Deterministic persistence
    await this.repository.upsert(documentId, chunks);

    const storageDurationMs = Date.now() - startTime;

    // 3. Minimal statistics return
    return {
      documentId,
      statistics: {
        documentCount: 1,
        chunkCount: chunks.length,
        persistedChunkCount: chunks.length,
        storageDurationMs
      }
    };
  }

  public async deleteDocument(request: DeleteRequest): Promise<DeleteResult> {
    await this.repository.deleteDocument(request.documentId);
    return {
      documentId: request.documentId,
      success: true
    };
  }
}

export const storagePipeline = new StoragePipeline();
