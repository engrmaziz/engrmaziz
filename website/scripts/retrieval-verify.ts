// @ts-nocheck
import { retrievalPipeline } from '../lib/retrieval/pipeline';
import { ragDatabase } from '../lib/rag/supabase';
import { RetrievalRequest } from '../lib/retrieval/types';
import { RetrievalValidationError } from '../lib/retrieval/errors';
import { logger } from '../lib/utils/logger';

async function verifyRetrieval() {
  logger.info('Starting Retrieval Engine Verification...');

  // 1. Mock the existing database abstraction
  const originalMatchEmbeddings = ragDatabase.matchEmbeddings;
  let receivedFilters: any = null;

  ragDatabase.matchEmbeddings = async (embedding, threshold, limit, filters) => {
    receivedFilters = filters;
    
    return [
      { chunk_id: 'C', chunk_text: 'Text C', similarity: 0.8 },
      { chunk_id: 'A', chunk_text: 'Text A', similarity: 0.95 },
      { chunk_id: 'B', chunk_text: 'Text B', similarity: 0.95 }, // Tie with A
      { chunk_id: 'D', chunk_text: 'Text D', similarity: -0.1 }, // Needs clamp
    ];
  };

  // 2. Test: Normalization, Ordering, and Tie-breaking
  const req: RetrievalRequest = {
    queryEmbedding: [0.1, 0.2, 0.3],
    filters: { category: 'docs' }
  };

  const result = await retrievalPipeline.retrieve(req);

  // Validate ordering & stable tie breaking (A should precede B despite tie)
  if (result.candidates[0].chunk_id !== 'A' || result.candidates[1].chunk_id !== 'B') {
    throw new Error('Stable tie-breaking failed or ordering is incorrect.');
  }
  logger.info('[PASS] Deterministic ordering and stable tie-breaking verified.');

  // Validate clamping (similarity: -0.1 should become 0.0)
  if (result.candidates[3].chunk_id !== 'D' || result.candidates[3].similarity !== 0.0) {
    throw new Error('Score normalization failed to clamp negative values correctly.');
  }
  logger.info('[PASS] Score normalization clamped correctly.');

  // Validate filter passing
  if (receivedFilters.category !== 'docs') {
    throw new Error('Filters were not properly passed to ragDatabase.');
  }
  logger.info('[PASS] Metadata filters properly passed.');

  // 3. Test: Validator rejections
  let rejectedEmptyEmbedding = false;
  try {
    await retrievalPipeline.retrieve({ queryEmbedding: [] });
  } catch (err) {
    if (err instanceof RetrievalValidationError) rejectedEmptyEmbedding = true;
  }
  if (!rejectedEmptyEmbedding) throw new Error('Failed to reject empty embeddings.');
  logger.info('[PASS] Validator deterministically rejected empty embeddings.');

  let rejectedNegativeLimit = false;
  try {
    await retrievalPipeline.retrieve({ queryEmbedding: [0.1], limit: -5 });
  } catch (err) {
    if (err instanceof RetrievalValidationError) rejectedNegativeLimit = true;
  }
  if (!rejectedNegativeLimit) throw new Error('Failed to reject negative limits.');
  logger.info('[PASS] Validator deterministically rejected invalid limits.');

  let rejectedComplexFilters = false;
  try {
    await retrievalPipeline.retrieve({ queryEmbedding: [0.1], filters: { nested: { prop: 1 } } });
  } catch (err) {
    if (err instanceof RetrievalValidationError) rejectedComplexFilters = true;
  }
  if (!rejectedComplexFilters) throw new Error('Failed to reject complex nested filters.');
  logger.info('[PASS] Validator deterministically rejected complex nested filters.');

  // Restore mock
  ragDatabase.matchEmbeddings = originalMatchEmbeddings;

  logger.info('Retrieval Engine Verification Completed Successfully.');
}

verifyRetrieval().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
