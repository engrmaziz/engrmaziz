/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { embeddings } from '@/lib/rag/embeddings';

export class HybridSearch {
  async retrieveContext(query: string, limit: number = 5) {
    // 1. Generate Dense Vector
    const vector = await embeddings.generateEmbedding(query);

    // 2. Execute Hybrid Search (Vector Similarity + BM25 Keyword match)
    // In production, this calls a custom Supabase RPC function that combines
    // pgvector (cosine distance) with full-text search (tsvector).
    
    // const { data } = await supabase.rpc('hybrid_search', {
    //   query_embedding: vector,
    //   query_text: query,
    //   match_count: limit
    // });

    // Simulated retrieval
    const simulatedData = [
      { id: '1', content: 'Musharraf specializes in Go backend engineering and RAG.', source: 'About', score: 0.92 },
      { id: '2', content: 'Built enterprise LLM orchestration layers.', source: 'Projects', score: 0.85 }
    ];

    // 3. Format Citations
    const citations = simulatedData.map(doc => ({
      id: doc.id,
      title: doc.source,
      url: `/knowledge/${doc.id}`,
      score: doc.score
    }));

    return {
      contextText: simulatedData.map(d => d.content).join('\n\n'),
      citations
    };
  }
}

export const hybridSearch = new HybridSearch();
