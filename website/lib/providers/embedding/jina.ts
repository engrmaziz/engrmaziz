/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbeddingProvider } from '../types';
import { ProviderExecutionError, ProviderConfigurationError } from '../errors';
import { systemConfig } from '../../system/config';

export class JinaEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'JinaEmbeddingProvider';
  private apiKey: string;
  private model: string;
  private endpoint = 'https://api.jina.ai/v1/embeddings';
  private cache = new Map<string, number[]>();
  private maxCache = 256;

  constructor() {
    this.apiKey = systemConfig.JINA_API_KEY || '';
    this.model = systemConfig.JINA_EMBEDDING_MODEL;
  }

  async embed(text: string, task: string = 'retrieval.query'): Promise<number[]> {
    if (!this.apiKey) {
      throw new ProviderConfigurationError('JINA_API_KEY environment variable is not defined.');
    }

    const key = `${task}:${text}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 180);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          input: [text],
          task,
          dimensions: 1024
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ProviderExecutionError(`Jina Embeddings API error (Status ${response.status}): ${errorText}`);
      }

      const body = await response.json();
      if (!body || !body.data || body.data.length === 0) {
        throw new ProviderExecutionError('Invalid response structure returned by Jina AI Embeddings API.');
      }

      const embedding = body.data[0].embedding as number[];
      this.setCache(key, embedding);
      return embedding;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new ProviderExecutionError('Jina embedding timed out after 180ms');
      }
      if (err instanceof ProviderExecutionError || err instanceof ProviderConfigurationError) {
        throw err;
      }
      throw new ProviderExecutionError(`Jina Embedding generation failed: ${err.message}`);
    } finally {
      clearTimeout(timer);
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
