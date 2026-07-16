// @ts-nocheck
import { storagePipeline } from '../lib/storage/pipeline';
import { ragDatabase } from '../lib/rag/supabase';
import { UpsertRequest } from '../lib/storage/types';
import { StorageValidationError, DuplicateRecordError } from '../lib/storage/errors';
import { logger } from '../lib/utils/logger';

async function verifyStorage() {
  logger.info('Starting Vector Storage Verification...');

  // 1. Mock the existing database abstraction
  let mockInsertedChunks: any[] = [];
  let mockInsertedEmbeddings: any[] = [];
  let mockDeletedDocuments: string[] = [];

  const originalInsert = ragDatabase.insertChunksAndEmbeddings;
  const originalDelete = ragDatabase.deleteDocument;

  ragDatabase.insertChunksAndEmbeddings = async (chunks, embeddings) => {
    mockInsertedChunks = [...chunks];
    mockInsertedEmbeddings = [...embeddings];
  };

  ragDatabase.deleteDocument = async (id: string) => {
    mockDeletedDocuments.push(id);
  };

  // 2. Prepare mock indexing data
  const mockUpsertRequest: UpsertRequest = {
    indexResult: {
      document: {
        documentId: 'doc-1',
        chunks: [
          {
            chunkId: 'chunk-1',
            documentId: 'doc-1',
            text: 'Test chunk text 1',
            embedding: [0.1, 0.2, 0.3],
            metadata: { documentId: 'doc-1', chunkId: 'chunk-1', source: 'test.md', title: 'Test', chunkIndex: 0 }
          },
          {
            chunkId: 'chunk-2',
            documentId: 'doc-1',
            text: 'Test chunk text 2',
            embedding: [0.4, 0.5, 0.6],
            metadata: { documentId: 'doc-1', chunkId: 'chunk-2', source: 'test.md', title: 'Test', chunkIndex: 1 }
          }
        ]
      },
      statistics: {
        chunkCount: 2,
        embeddingDurationMs: 10
      }
    }
  };

  // 3. Test: Upsert logic and pure formatting
  const upsertResult = await storagePipeline.upsert(mockUpsertRequest);
  
  if (upsertResult.statistics.persistedChunkCount !== 2) {
    throw new Error('Pipeline did not report correct persisted chunk count.');
  }

  // Validate the repository formatted it correctly for the existing ragDatabase abstraction
  if (mockInsertedChunks.length !== 2 || mockInsertedEmbeddings.length !== 2) {
    throw new Error('Repository failed to map chunks and embeddings correctly.');
  }

  // Verify deterministic ordering
  if (mockInsertedChunks[0].chunk_hash !== 'chunk-1' || mockInsertedChunks[1].chunk_hash !== 'chunk-2') {
    throw new Error('Repository did not preserve deterministic ordering.');
  }
  logger.info('[PASS] Repository correctly maps IndexedChunks to Database records with ordering preserved.');

  // 4. Test: Delete logic
  await storagePipeline.deleteDocument({ documentId: 'doc-1' });
  if (mockDeletedDocuments[0] !== 'doc-1') {
    throw new Error('Pipeline did not delegate deletion correctly.');
  }
  logger.info('[PASS] Delete requests correctly delegated to ragDatabase.');

  // 5. Test: Validator rejections
  let rejectedDuplicate = false;
  try {
    const badRequest = JSON.parse(JSON.stringify(mockUpsertRequest));
    badRequest.indexResult.document.chunks.push(badRequest.indexResult.document.chunks[0]); // Create duplicate
    await storagePipeline.upsert(badRequest);
  } catch (err) {
    if (err instanceof DuplicateRecordError) rejectedDuplicate = true;
  }
  if (!rejectedDuplicate) throw new Error('Failed to reject duplicate chunks.');
  logger.info('[PASS] Validator deterministically rejected duplicate records.');

  let rejectedMissingEmbedding = false;
  try {
    const badRequest = JSON.parse(JSON.stringify(mockUpsertRequest));
    badRequest.indexResult.document.chunks[0].embedding = []; // Missing embedding
    await storagePipeline.upsert(badRequest);
  } catch (err) {
    if (err instanceof StorageValidationError) rejectedMissingEmbedding = true;
  }
  if (!rejectedMissingEmbedding) throw new Error('Failed to reject missing embeddings.');
  logger.info('[PASS] Validator deterministically rejected missing embeddings.');

  let rejectedMismatchDimension = false;
  try {
    const badRequest = JSON.parse(JSON.stringify(mockUpsertRequest));
    badRequest.indexResult.document.chunks[1].embedding = [0.1, 0.2]; // Dimension mismatch (expected 3)
    await storagePipeline.upsert(badRequest);
  } catch (err) {
    if (err instanceof StorageValidationError) rejectedMismatchDimension = true;
  }
  if (!rejectedMismatchDimension) throw new Error('Failed to reject dimensional inconsistencies.');
  logger.info('[PASS] Validator deterministically rejected embedding dimensional mismatch.');

  // Restore mock
  ragDatabase.insertChunksAndEmbeddings = originalInsert;
  ragDatabase.deleteDocument = originalDelete;

  logger.info('Knowledge Storage Verification Completed Successfully.');
}

verifyStorage().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
