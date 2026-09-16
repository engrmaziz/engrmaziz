/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from './logger';
import { providerFactory } from '../providers';

const log = createLogger('Embedder');

export type EmbeddingTask = 'retrieval.query' | 'retrieval.passage' | 'text-matching' | 'classification' | 'separation';

export class RAGEmbedder {
  private failureCount = 0;
  private isCircuitOpen = false;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly CIRCUIT_RESET_TIME_MS = 60000;
  private circuitOpenedAt = 0;
  private cache = new Map<string, number[]>();
  private maxCache = 256;

  private checkCircuitBreaker() {
    if (this.isCircuitOpen) {
      if (Date.now() - this.circuitOpenedAt > this.CIRCUIT_RESET_TIME_MS) {
        log.info('Circuit breaker reset time elapsed. Attempting to close circuit.');
        this.isCircuitOpen = false;
        this.failureCount = 0;
      } else {
        throw new Error('CIRCUIT_OPEN: Jina AI Embeddings API is currently unreachable. Operating in degraded mode.');
      }
    }
  }

  private recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.isCircuitOpen = true;
      this.circuitOpenedAt = Date.now();
      log.error(`Circuit breaker tripped after ${this.failureCount} consecutive failures.`);
    }
  }

  private recordSuccess() {
    if (this.failureCount > 0) {
      log.info('API call successful. Resetting failure count.');
      this.failureCount = 0;
      this.isCircuitOpen = false;
    }
  }

  async embed(text: string, task: EmbeddingTask = 'retrieval.query'): Promise<number[]> {
    const cacheKey = `${task}:${text}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const results = await this.embedBatch([text], task, 0, 0);
    const firstResult = results[0];
    if (!firstResult || firstResult.length === 0) {
      throw new Error('Failed to generate embedding: empty first element');
    }
    this.setCache(cacheKey, firstResult);
    return firstResult;
  }

  async embedBatch(
    texts: string[],
    task: EmbeddingTask = 'retrieval.passage',
    retries = 2,
    delay = 200
  ): Promise<number[][]> {
    if (texts.length === 0) return [];

    this.checkCircuitBreaker();

    try {
      const start = Date.now();
      const provider = providerFactory.getEmbeddingProvider();
      const vectors = await Promise.all(texts.map((text) => provider.embed(text, task)));
      this.recordSuccess();
      log.info(`Successfully embedded batch of ${texts.length} items`, { latency: Date.now() - start, task });
      return vectors;
    } catch (error: any) {
      log.error(`Embedding generation failed. Retries left: ${retries}.`, error, { task });
      if (/timed out/i.test(String(error?.message || ''))) {
        throw error;
      }
      if (/401|403|Invalid API|AUTH_INVALID/i.test(String(error?.message || ''))) {
        this.recordFailure();
        throw error;
      }

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.embedBatch(texts, task, retries - 1, delay * 2);
      }
      this.recordFailure();
      throw error;
    }
  }

  private setCache(key: string, embedding: number[]) {
    if (this.cache.size >= this.maxCache) {
      const first = this.cache.keys().next().value;
      if (first) this.cache.delete(first);
    }
    this.cache.set(key, embedding);
  }
}

export const ragEmbedder = new RAGEmbedder();
