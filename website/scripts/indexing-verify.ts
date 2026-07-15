import { indexingPipeline } from '../lib/indexing/pipeline';
import { RecordBuilder } from '../lib/indexing/record';
import { providerFactory, EmbeddingProvider } from '../lib/providers';
import { IngestionResult, Chunk } from '../lib/ingestion/types';
import { IndexValidationError, DuplicateIndexError } from '../lib/indexing/errors';
import { logger } from '../lib/utils/logger';

// Mock Embedding Provider for deterministic testing without external APIs
class MockEmbeddingProvider implements EmbeddingProvider {
  name = 'mock_embedder';
  async embed(text: string): Promise<number[]> {
    // Return a dummy deterministic embedding based on length
    return [text.length, text.length * 2, 0.5];
  }
}

async function verifyIndexing() {
  logger.info('Starting Knowledge Indexing Verification...');

  // 1. Mock the Provider Factory for this test
  const originalGetEmbeddingProvider = providerFactory.getEmbeddingProvider.bind(providerFactory);
  const mockProvider = new MockEmbeddingProvider();
  providerFactory.getEmbeddingProvider = () => mockProvider;

  // 2. Prepare mock ingestion data
  const mockChunks: Chunk[] = [
    {
      id: 'chunk-1',
      content: 'This is the first chunk.',
      metadata: { documentId: 'doc-1', chunkId: 'chunk-1', source: 'test.md', title: 'Test', chunkIndex: 0 }
    },
    {
      id: 'chunk-2',
      content: 'This is the second chunk.',
      metadata: { documentId: 'doc-1', chunkId: 'chunk-2', source: 'test.md', title: 'Test', chunkIndex: 1 }
    }
  ];

  const mockIngestionResult: IngestionResult = {
    documentId: 'doc-1',
    chunks: mockChunks
  };

  // 3. Test: Identical input produces identical output & sequential ordering
  const result1 = await indexingPipeline.process({ ingestionResult: mockIngestionResult });
  const result2 = await indexingPipeline.process({ ingestionResult: mockIngestionResult });

  // Exclude non-deterministic duration from comparison
  const result1Stable = { ...result1, statistics: { chunkCount: result1.statistics.chunkCount } };
  const result2Stable = { ...result2, statistics: { chunkCount: result2.statistics.chunkCount } };

  if (JSON.stringify(result1Stable) !== JSON.stringify(result2Stable)) {
    throw new Error('Indexing pipeline is not deterministic.');
  }
  logger.info('[PASS] Identical input produces identical indexed output.');

  // Check ordering
  if (result1.document.chunks[0].chunkId !== 'chunk-1' || result1.document.chunks[1].chunkId !== 'chunk-2') {
    throw new Error('Deterministic chunk ordering was not preserved.');
  }
  logger.info('[PASS] Deterministic chunk ordering preserved.');

  // 4. Test: RecordBuilder purity
  const builder = new RecordBuilder();
  const pureRecord = builder.buildRecord(mockChunks[0], [1, 2, 3]);
  if (pureRecord.chunkId !== 'chunk-1' || pureRecord.embedding[0] !== 1) {
    throw new Error('RecordBuilder failed to build pure record.');
  }
  logger.info('[PASS] RecordBuilder remains pure and deterministic.');

  // 5. Test: Validator rejections
  let rejectedDuplicate = false;
  try {
    const duplicateChunks = [...mockChunks, mockChunks[0]];
    await indexingPipeline.process({ ingestionResult: { documentId: 'doc-1', chunks: duplicateChunks } });
  } catch (err) {
    if (err instanceof DuplicateIndexError) rejectedDuplicate = true;
  }
  if (!rejectedDuplicate) throw new Error('Failed to reject duplicate chunks.');
  logger.info('[PASS] Duplicate chunks deterministically rejected.');

  let rejectedMissingMetadata = false;
  try {
    const badChunks = [{ ...mockChunks[0], metadata: null as any }];
    await indexingPipeline.process({ ingestionResult: { documentId: 'doc-1', chunks: badChunks } });
  } catch (err) {
    if (err instanceof IndexValidationError) rejectedMissingMetadata = true;
  }
  if (!rejectedMissingMetadata) throw new Error('Failed to reject malformed metadata.');
  logger.info('[PASS] Malformed metadata deterministically rejected.');

  let rejectedEmpty = false;
  try {
    await indexingPipeline.process({ ingestionResult: { documentId: 'doc-1', chunks: [] } });
  } catch (err) {
    if (err instanceof IndexValidationError) rejectedEmpty = true;
  }
  if (!rejectedEmpty) throw new Error('Failed to reject empty chunk array.');
  logger.info('[PASS] Empty chunk arrays deterministically rejected.');

  // Restore mock
  providerFactory.getEmbeddingProvider = originalGetEmbeddingProvider;

  logger.info('Knowledge Indexing Verification Completed Successfully.');
}

verifyIndexing().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
