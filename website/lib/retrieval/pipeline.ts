/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RetrievalRequest, RetrievalResult } from './types';
import { RetrievalValidator } from './validator';
import { RetrievalScorer } from './scorer';
import { ragDatabase } from '../rag/supabase';
import { RetrievalExecutionError } from './errors';

export class RetrievalPipeline {
  private validator: RetrievalValidator;
  private scorer: RetrievalScorer;

  constructor() {
    this.validator = new RetrievalValidator();
    this.scorer = new RetrievalScorer();
  }

  public async retrieve(request: RetrievalRequest): Promise<RetrievalResult> {
    const startTime = Date.now();

    try {
      // 1. Pure validation
      this.validator.validate(request);

      // 2. Execute existing persistence query
      const rawResults = await ragDatabase.matchEmbeddings(
        request.queryEmbedding,
        request.threshold || 0.0,
        request.limit || 50,
        request.filters || {}
      );

      // 3. Score normalization and stable ordering
      const candidates = this.scorer.score(rawResults);

      const durationMs = Date.now() - startTime;

      // 4. Return stable deterministic results
      return {
        candidates,
        statistics: {
          candidateCount: candidates.length,
          durationMs
        }
      };
    } catch (err: any) {
      if (err.name === 'RetrievalValidationError') {
        throw err;
      }
      throw new RetrievalExecutionError(`Retrieval pipeline failed: ${err.message}`);
    }
  }
}

export const retrievalPipeline = new RetrievalPipeline();
