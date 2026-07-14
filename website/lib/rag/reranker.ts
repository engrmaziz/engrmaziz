/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RerankResult {
  index: number;
  document: string;
  relevanceScore: number;
}

export class RAGReranker {
  private apiKey: string;
  private endpoint = 'https://api.jina.ai/v1/rerank';
  private model = 'jina-reranker-v2-base-multilingual';

  constructor() {
    this.apiKey = process.env.JINA_API_KEY || '';
  }

  /**
   * Reranks a query against a list of text documents retrieved from hybrid search.
   * If the API fails or JINA_API_KEY is not configured, it gracefully falls back to 
   * our local multi-factor scorer (merging pgvector cosine similarity and weighted lexical overlap).
   */
  async rerank(
    query: string,
    searchResults: any[],
    topN: number
  ): Promise<RerankResult[]> {
    if (searchResults.length === 0) return [];
    
    const documents = searchResults.map((res) => res.chunk_text || res.content || '');

    // Check if reranker is enabled in env settings
    const enabled = process.env.RERANKING_ENABLED !== 'false';
    if (!enabled || !this.apiKey) {
      telemetryLogger.log('RAG', 'Jina Reranker disabled or key missing. Falling back to multi-factor local scoring.');
      return this.localRerank(query, searchResults, topN);
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
          query,
          documents,
          top_n: topN
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jina Reranker API error (Status ${response.status}): ${errorText}`);
      }

      const body = await response.json();
      if (!body || !body.results) {
        throw new Error('Invalid response structure returned by Jina AI Reranker API.');
      }

      return body.results.map((res: any) => ({
        index: res.index,
        document: documents[res.index] || '',
        relevanceScore: res.relevance_score
      }));

    } catch (err: any) {
      telemetryLogger.error('RAG', 'Jina Reranker failed', err);
      return this.localRerank(query, searchResults, topN);
    }
  }

  /**
   * Local multi-factor fallback scoring:
   * Merges dense vector similarity scores from the database with a weighted heuristic
   * lexical term-frequency overlap score.
   */
  private localRerank(
    query: string,
    searchResults: any[],
    topN: number
  ): RerankResult[] {
    // Standardize query terms and filter out minor stop words
    const queryTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 2);
    
    const scoredDocs = searchResults.map((res, index) => {
      const docLower = (res.chunk_text || res.content || '').toLowerCase();
      let lexicalMatch = 0;
      let totalWeight = 0;
      
      for (const term of queryTerms) {
        // Longer technical terms receive higher rank weights
        const weight = term.length > 5 ? 1.5 : 1.0;
        totalWeight += weight;
        if (docLower.includes(term)) {
          lexicalMatch += weight;
        }
      }
      
      const lexicalScore = totalWeight > 0 ? lexicalMatch / totalWeight : 0;
      
      // Pull semantic density score from pgvector match (cosine similarity)
      const denseScore = res.similarity || res.semantic_score || 0.0;
      
      // Merge dense vector scores and sparse keyword matching (60% dense / 40% lexical weight)
      const mergedScore = denseScore * 0.6 + lexicalScore * 0.4;
      
      return {
        index,
        document: res.chunk_text || res.content || '',
        relevanceScore: mergedScore
      };
    });

    // Sort by merged scores descending and slice top N
    return scoredDocs
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topN);
  }
}

export const ragReranker = new RAGReranker();
