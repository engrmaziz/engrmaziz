// @ts-nocheck
import { knowledgeService } from '../lib/knowledge/service';
import { ingestionPipeline } from '../lib/ingestion/pipeline';
import { indexingPipeline } from '../lib/indexing/pipeline';
import { storagePipeline } from '../lib/storage/pipeline';
import { KnowledgeValidationError, KnowledgeExecutionError } from '../lib/knowledge/errors';
import { logger } from '../lib/utils/logger';

async function verifyKnowledgeService() {
  logger.info('Starting Knowledge Management Service Verification...');

  // 1. Mock dependencies
  let ingestionCalled = 0;
  let indexingCalled = 0;
  let storageCalled = 0;

  const originalIngestion = ingestionPipeline.process;
  const originalIndexing = indexingPipeline.process;
  const originalStorage = storagePipeline.upsert;

  let executeOrder: string[] = [];

  ingestionPipeline.process = (req) => {
    ingestionCalled++;
    executeOrder.push('ingestion');
    if (req.content === 'TRIGGER_INGESTION_ERROR') {
      throw new Error('Mock ingestion error');
    }
    return { documentId: req.id, chunks: [] };
  };

  indexingPipeline.process = async (req) => {
    indexingCalled++;
    executeOrder.push('indexing');
    if (req.ingestionResult.documentId === 'INDEX_ERROR') {
      throw new Error('Mock indexing error');
    }
    return {
      document: { documentId: req.ingestionResult.documentId, chunks: [] },
      statistics: { chunkCount: 5, embeddingDurationMs: 10 }
    };
  };

  storagePipeline.upsert = async (req) => {
    storageCalled++;
    executeOrder.push('storage');
    return {
      documentId: req.indexResult.document.documentId,
      statistics: { documentCount: 1, chunkCount: 5, persistedChunkCount: 5, storageDurationMs: 10 }
    };
  };

  // 2. Test: Successful Orchestration
  const result = await knowledgeService.ingest({
    document: { id: 'doc-1', type: 'markdown', content: 'Valid content' }
  });

  if (!result.success || result.documentId !== 'doc-1' || result.statistics.chunkCount !== 5 || result.statistics.storedRecordCount !== 5) {
    throw new Error('Successful orchestration failed to return correct statistics.');
  }
  if (executeOrder.join('->') !== 'ingestion->indexing->storage') {
    throw new Error('Orchestration order was not strictly sequential.');
  }
  if (ingestionCalled !== 1 || indexingCalled !== 1 || storageCalled !== 1) {
    throw new Error('Pipelines were not invoked exactly once.');
  }
  logger.info('[PASS] Successful orchestration and deterministic sequence verified.');

  // 3. Test: Validation Reject (Empty content)
  let rejectedValidation = false;
  try {
    await knowledgeService.ingest({
      document: { id: 'doc-2', type: 'markdown', content: '' }
    });
  } catch (err) {
    if (err instanceof KnowledgeValidationError) rejectedValidation = true;
  }
  if (!rejectedValidation) throw new Error('Validator failed to reject empty content.');
  logger.info('[PASS] Validator correctly rejected malformed request.');

  // 4. Test: Downstream Failure Propagation
  let propagatedIngestionError = false;
  try {
    await knowledgeService.ingest({
      document: { id: 'doc-error', type: 'text', content: 'TRIGGER_INGESTION_ERROR' }
    });
  } catch (err) {
    if (err instanceof KnowledgeExecutionError && err.message.includes('Mock ingestion error')) {
      propagatedIngestionError = true;
    }
  }
  if (!propagatedIngestionError) throw new Error('Failed to propagate downstream ingestion error.');
  logger.info('[PASS] Downstream failure successfully propagated across boundary.');

  // Restore
  ingestionPipeline.process = originalIngestion;
  indexingPipeline.process = originalIndexing;
  storagePipeline.upsert = originalStorage;

  logger.info('Knowledge Management Service Verification Completed Successfully.');
}

verifyKnowledgeService().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
