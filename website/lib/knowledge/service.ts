import { KnowledgeRequest, KnowledgeResult } from './types';
import { KnowledgeValidator } from './validator';
import { KnowledgeExecutionError, KnowledgeValidationError } from './errors';
import { ingestionPipeline } from '../ingestion/pipeline';
import { indexingPipeline } from '../indexing/pipeline';
import { storagePipeline } from '../storage/pipeline';

export class KnowledgeService {
  private validator: KnowledgeValidator;

  constructor() {
    this.validator = new KnowledgeValidator();
  }

  public async ingest(request: KnowledgeRequest): Promise<KnowledgeResult> {
    const startTime = Date.now();

    try {
      // 1. Pure validation
      this.validator.validate(request);

      // 2. Synchronous Orchestration: Ingestion
      const ingestionResult = ingestionPipeline.process({
        id: request.document.id,
        content: request.document.content,
        metadata: request.document.metadata
      });

      // 3. Synchronous Orchestration: Indexing
      const indexResult = await indexingPipeline.process({
        ingestionResult
      });

      // 4. Synchronous Orchestration: Storage
      const upsertResult = await storagePipeline.upsert({
        indexResult
      });

      const durationMs = Date.now() - startTime;

      // 5. Immutable Result
      return {
        documentId: upsertResult.documentId,
        success: true,
        statistics: {
          chunkCount: indexResult.statistics.chunkCount,
          storedRecordCount: upsertResult.statistics.persistedChunkCount,
          durationMs
        }
      };

    } catch (err: any) {
      if (err instanceof KnowledgeValidationError) {
        throw err;
      }
      if (err.name === 'IngestionValidationError' || err.name === 'IndexValidationError' || err.name === 'StorageValidationError') {
        throw new KnowledgeValidationError(`Validation failed in pipeline: ${err.message}`);
      }
      throw new KnowledgeExecutionError(`Knowledge ingestion failed: ${err.message}`);
    }
  }
}

export const knowledgeService = new KnowledgeService();
