/* eslint-disable @typescript-eslint/no-explicit-any */
import { telemetryLogger } from '../telemetry';
import { providerFactory } from '../providers';
import { systemConfig } from '../system';

export interface RerankResult {
  index: number;
  document: string;
  relevanceScore: number;
}

export class RAGReranker {
  /**
   * Reranks a query against a list of text documents retrieved from hybrid search.
   * If the provider fails, it gracefully falls back to 
   * our local multi-factor scorer (merging pgvector cosine similarity and weighted lexical overlap).
   */
  async rerank(
    query: string,
    searchResults: any[],
    topN: number
  ): Promise<RerankResult[]> {
    if (searchResults.length === 0) return [];
    
    // Check if reranker is enabled in env settings
    const enabled = systemConfig.RERANKING_ENABLED;
    if (!enabled) {
      telemetryLogger.log('RAG', 'Reranker disabled. Falling back to multi-factor local scoring.');
      return this.localRerank(query, searchResults, topN);
    }

    try {
      const provider = providerFactory.getRerankerProvider();
      
      const documents = searchResults.map((res, index) => ({
        text: res.chunk_text || res.content || '',
        originalIndex: index,
        ...res
      }));

      const providerResults = await provider.rerank(query, documents);
      
      // Map back to RerankResult structure
      return providerResults.map((doc, idx) => ({
        index: doc.originalIndex !== undefined ? doc.originalIndex : idx,
        document: doc.text,
        relevanceScore: doc.relevanceScore || 0
      })).slice(0, topN);

    } catch (err: any) {
      telemetryLogger.error('RAG', `Reranker provider failed: ${err.message}`, err);
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
