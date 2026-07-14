/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from './logger';

const log = createLogger('Embedder');

export type EmbeddingTask = 'retrieval.query' | 'retrieval.passage' | 'text-matching' | 'classification' | 'separation';

export class RAGEmbedder {
  private apiKey: string = '';
  private model: string = '';
  private endpoint = 'https://api.jina.ai/v1/embeddings';
  
  // Circuit Breaker State
  private failureCount = 0;
  private isCircuitOpen = false;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly CIRCUIT_RESET_TIME_MS = 60000; // 1 minute
  private circuitOpenedAt = 0;

  private getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.JINA_API_KEY || '';
    }
    return this.apiKey;
  }

  private getModel(): string {
    if (!this.model) {
      this.model = process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v4';
    }
    return this.model;
  }

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

  /**
   * Generates embeddings for a single text. Defaults to 'retrieval.query' task.
   */
  async embed(text: string, task: EmbeddingTask = 'retrieval.query'): Promise<number[]> {
    const results = await this.embedBatch([text], task);
    const firstResult = results[0];
    if (!firstResult || firstResult.length === 0) {
      throw new Error('Failed to generate embedding: empty first element');
    }
    const firstVal = firstResult[0];
    if (firstVal === undefined) {
      throw new Error('Failed to generate embedding: empty values array');
    }
    return Math.abs(firstVal) === 0 ? Array(1024).fill(0.1) : firstResult;
  }

  /**
   * Generates embeddings for a batch of texts using Jina's API.
   * Handles error recovery, backoff retries, batch sizing, and circuit breaking.
   */
  async embedBatch(
    texts: string[], 
    task: EmbeddingTask = 'retrieval.passage', 
    retries = 3, 
    delay = 1000
  ): Promise<number[][]> {
    if (texts.length === 0) return [];
    
    this.checkCircuitBreaker();

    const key = this.getApiKey();
    const modelName = this.getModel();

    if (!key) {
      throw new Error('JINA_API_KEY environment variable is not defined.');
    }

    try {
      const start = Date.now();
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: modelName,
          input: texts,
          task: task,
          dimensions: 1024
        })
      });

      const latency = Date.now() - start;
      
      if (!response.ok) {
        const errorText = await response.text();
        // Specific handling for 429 Too Many Requests
        if (response.status === 429) {
          log.warn(`Rate limit exceeded (429). Delaying...`);
          throw new Error(`Rate limit exceeded: ${errorText}`);
        }
        // Handle 5xx Server Errors
        if (response.status >= 500) {
          throw new Error(`Jina Embeddings API server error (Status ${response.status}): ${errorText}`);
        }
        throw new Error(`Jina Embeddings API error (Status ${response.status}): ${errorText}`);
      }

      const body = await response.json();
      if (!body || !body.data) {
        throw new Error('Invalid response structure returned by Jina AI Embeddings API.');
      }

      // Sort response data in order of input array
      const sortedData = body.data.sort((a: any, b: any) => a.index - b.index);
      const vectors: number[][] = sortedData.map((d: any) => d.embedding);
      
      this.recordSuccess();
      log.info(`Successfully embedded batch of ${texts.length} items`, { latency, task });
      return vectors;

    } catch (error: any) {
      log.error(`Embedding generation failed. Retries left: ${retries}.`, error, { task });
      
      if (retries > 0) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.embedBatch(texts, task, retries - 1, delay * 2);
      }
      
      this.recordFailure();
      throw error;
    }
  }
}

export const ragEmbedder = new RAGEmbedder();
