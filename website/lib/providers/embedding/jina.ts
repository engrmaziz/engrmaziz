import { EmbeddingProvider } from '../types';
import { ProviderExecutionError, ProviderConfigurationError } from '../errors';
import { systemConfig } from '../../system/config';
import { createLogger } from '../../rag/logger';

const log = createLogger('JinaEmbeddingProvider');

export class JinaEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'JinaEmbeddingProvider';
  private apiKey: string;
  private model: string;
  private endpoint = 'https://api.jina.ai/v1/embeddings';

  constructor() {
    this.apiKey = systemConfig.JINA_API_KEY || '';
    this.model = systemConfig.JINA_EMBEDDING_MODEL;
  }

  async embed(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new ProviderConfigurationError('JINA_API_KEY environment variable is not defined.');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          input: [text], // Jina API expects an array
          task: 'retrieval.query',
          dimensions: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ProviderExecutionError(`Jina Embeddings API error (Status ${response.status}): ${errorText}`);
      }

      const body = await response.json();
      if (!body || !body.data || body.data.length === 0) {
        throw new ProviderExecutionError('Invalid response structure returned by Jina AI Embeddings API.');
      }

      return body.data[0].embedding;
    } catch (err: any) {
      if (err instanceof ProviderExecutionError || err instanceof ProviderConfigurationError) {
        throw err;
      }
      throw new ProviderExecutionError(`Jina Embedding generation failed: ${err.message}`);
    }
  }
}
