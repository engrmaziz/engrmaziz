import { RerankerProvider, Document } from '../types';
import { ProviderExecutionError, ProviderConfigurationError } from '../errors';
import { systemConfig } from '../../system/config';

export class JinaRerankerProvider implements RerankerProvider {
  readonly name = 'JinaRerankerProvider';
  private apiKey: string;
  private endpoint = 'https://api.jina.ai/v1/rerank';
  private model = 'jina-reranker-v2-base-multilingual';

  constructor() {
    this.apiKey = systemConfig.JINA_API_KEY || '';
  }

  async rerank(query: string, documents: Document[]): Promise<Document[]> {
    if (!this.apiKey) {
      throw new ProviderConfigurationError('JINA_API_KEY environment variable is not defined.');
    }
    
    if (documents.length === 0) return [];

    const rawDocs = documents.map(d => d.text);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          query,
          documents: rawDocs,
          top_n: documents.length
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ProviderExecutionError(`Jina Reranker API error (Status ${response.status}): ${errorText}`);
      }

      const body = await response.json();
      if (!body || !body.results) {
        throw new ProviderExecutionError('Invalid response structure returned by Jina AI Reranker API.');
      }

      // Re-map scores to the original documents preserving metadata
      const results: Document[] = [];
      for (const res of body.results) {
        const originalDoc = documents[res.index];
        results.push({
          ...originalDoc,
          relevanceScore: res.relevance_score
        });
      }

      return results;
    } catch (err: any) {
      if (err instanceof ProviderExecutionError || err instanceof ProviderConfigurationError) {
        throw err;
      }
      throw new ProviderExecutionError(`Jina Reranker failed: ${err.message}`);
    }
  }
}
