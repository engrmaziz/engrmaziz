/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragEmbedder } from './embedder';
import { ragDatabase } from './supabase';
import { ragReranker } from './reranker';
import { ragContextBuilder } from './context-builder';

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  chunkText: string;
  chunkNumber: number;
  metadata: Record<string, any>;
  score: number;
}

// Synonym Map for intent and technical abbreviation query expansions
const SYNONYM_EXPANSION_MAP: Record<string, string[]> = {
  'chatbot': ['chatbot', 'assistant', 'conversational agent', 'chat interface', 'user support'],
  'agent': ['agent', 'workflow', 'langgraph', 'autonomous', 'orchestration', 'multi-agent'],
  'rag': ['rag', 'retrieval-augmented generation', 'vector search', 'embeddings', 'pgvector', 'semantic search'],
  'voicerag': ['voicerag', 'telephony', 'asterisk', 'voice assistant', 'call agent', 'real-time audio'],
  'aegisflow': ['aegisflow', 'workflow automation', 'workflow engine', 'visual editor', 'integrations'],
  'auranode': ['auranode', 'knowledge graph', 'neo4j', 'semantic metadata', 'nodes', 'relationships'],
  'dentl2': ['dentl2', 'dental saas', '3d charting', 'three.js', 'patient dashboard'],
  'concurrency': ['concurrency', 'high-throughput', 'throughput', 'load testing', 'performance scaling'],
  'healthcare': ['healthcare', 'clinical protocols', 'hipaa', 'hospital', 'patient records'],
  'nextjs': ['nextjs', 'next.js', 'react', 'ssr', 'web app', 'typescript'],
  'python': ['python', 'fastapi', 'microservice', 'scipy', 'numpy', 'machine learning']
};

export class RAGRetriever {
  /**
   * Normalizes the incoming user query by removing punctuation and lowercasing.
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim();
  }

  /**
   * Automatically expands query strings with synonymous technical jargon and concepts.
   */
  private expandQuery(query: string): string {
    const words = this.normalizeQuery(query).split(/\s+/);
    const expansions = new Set<string>(words);

    for (const word of words) {
      if (SYNONYM_EXPANSION_MAP[word]) {
        SYNONYM_EXPANSION_MAP[word]!.forEach((expanded) => expansions.add(expanded));
      }
    }

    return Array.from(expansions).join(' ');
  }

  /**
   * Performs hybrid semantic and lexical retrieval on Supabase using Reciprocal Rank Fusion (RRF),
   * applies metadata filtering, executes the reranker, and constructs the optimized prompt context.
   * Integrates HyDE (Hypothetical Document Embeddings) for improved dense retrieval and CRAG evaluation.
   */
  async retrieve(
    query: string,
    limit: number = 5,
    threshold: number = 0.3,
    filters: Record<string, any> = {}
  ): Promise<{ contextText: string; chunks: RetrievedChunk[]; citations: any[], cragEval: string }> {
    try {
      const normalizedQuery = this.normalizeQuery(query);
      const expandedQuery = this.expandQuery(query);
      
      console.log(`[RAGRetriever] Normalized Query: "${normalizedQuery}"`);
      console.log(`[RAGRetriever] Expanded Query: "${expandedQuery}"`);

      // --- 1. HyDE (Hypothetical Document Embeddings) ---
      let hypotheticalDocument = normalizedQuery;
      try {
        const { createAIClient } = await import('@/lib/ai/client');
        const aiClient = createAIClient();
        const hydePrompt = `You are a technical expert. Write a concise, factual excerpt (3-4 sentences) that directly answers the following query. Write it in the style of official technical documentation.\n\nQuery: ${normalizedQuery}`;
        const hydeRes = await aiClient.generateSimpleResponse(hydePrompt);
        if (hydeRes && hydeRes.content) {
          hypotheticalDocument = hydeRes.content.trim();
          console.log(`[RAGRetriever] HyDE generated: "${hypotheticalDocument.substring(0, 50)}..."`);
        }
      } catch (hydeErr) {
        console.warn(`[RAGRetriever] HyDE generation failed, falling back to original query.`, hydeErr);
      }

      // 2. Generate Query Vector Embedding using the Hypothetical Document (or fallback to query)
      const queryEmbedding = await ragEmbedder.embed(hypotheticalDocument);

      // 3. Parallel Dense Vector Search & Sparse BM25 Text Search
      const [denseResults, sparseResults] = await Promise.all([
        ragDatabase.matchEmbeddings(queryEmbedding, threshold, 50, filters),
        ragDatabase.ftsSearch(expandedQuery, 50, filters)
      ]);

      console.log(`[RAGRetriever] Dense match candidate count: ${denseResults.length}`);
      console.log(`[RAGRetriever] Sparse match candidate count: ${sparseResults.length}`);

      // 4. Reciprocal Rank Fusion (RRF) Merging
      // RRF_Score = 1 / (60 + dense_rank) + 1 / (60 + sparse_rank)
      const rrfRegistry: Record<string, { rankDense?: number; rankSparse?: number; item: any }> = {};

      denseResults.forEach((res, rankIdx) => {
        const id = res.chunk_id;
        if (!rrfRegistry[id]) {
          rrfRegistry[id] = { item: res };
        }
        rrfRegistry[id]!.rankDense = rankIdx + 1;
      });

      sparseResults.forEach((res, rankIdx) => {
        const id = res.chunk_id;
        if (!rrfRegistry[id]) {
          rrfRegistry[id] = { item: res };
        }
        rrfRegistry[id]!.rankSparse = rankIdx + 1;
      });

      const fusedCandidates = Object.values(rrfRegistry).map(({ rankDense, rankSparse, item }) => {
        const rrfDense = rankDense ? 1 / (60 + rankDense) : 0;
        const rrfSparse = rankSparse ? 1 / (60 + rankSparse) : 0;
        const rrfScore = rrfDense + rrfSparse;
        
        // Retain original pgvector cosine similarity score for local fallback reranking
        const similarity = item.similarity || item.score || 0.0;

        return {
          ...item,
          similarity,
          rrfScore
        };
      });

      // Sort by RRF score descending and take the top 15 candidate matches
      const top15Candidates = fusedCandidates
        .sort((a, b) => b.rrfScore - a.rrfScore)
        .slice(0, 15);

      if (top15Candidates.length === 0) {
        return { contextText: '', chunks: [], citations: [], cragEval: 'IRRELEVANT' };
      }

      // 5. Execute Reranker to filter down to the best candidates
      const rerankedResults = await ragReranker.rerank(normalizedQuery, top15Candidates, limit);

      // 6. Map reranked indices to original database records
      const finalChunks = rerankedResults.map((r) => {
        const originalRecord = top15Candidates[r.index]!;
        return {
          chunkId: originalRecord.chunk_id,
          documentId: originalRecord.document_id,
          chunkText: originalRecord.chunk_text,
          chunkNumber: originalRecord.chunk_number,
          metadata: originalRecord.metadata || {},
          score: r.relevanceScore
        };
      });

      // 7. Build optimized context block and extract citations using the Context Builder
      const { contextText, citations } = ragContextBuilder.buildContext(
        finalChunks as any,
        parseInt(process.env.RAG_MAX_CONTEXT_TOKENS || '6000', 10)
      );

      // --- 8. CRAG (Corrective RAG) Context Evaluation ---
      let cragEval = 'RELEVANT';
      try {
        const { createAIClient } = await import('@/lib/ai/client');
        const aiClient = createAIClient();
        const cragPrompt = `You are a grader evaluating the relevance of retrieved context to a user query. \n\nQuery: ${normalizedQuery}\n\nContext:\n${contextText}\n\nDoes the context contain sufficient relevant information to answer the query? Respond with exactly one word: "RELEVANT" or "IRRELEVANT".`;
        const cragRes = await aiClient.generateSimpleResponse(cragPrompt);
        const evalScore = cragRes?.content?.trim().toUpperCase();
        if (evalScore && evalScore.includes('IRRELEVANT')) {
          cragEval = 'IRRELEVANT';
          console.warn(`[RAGRetriever] CRAG Evaluation marked context as IRRELEVANT.`);
        } else {
          console.log(`[RAGRetriever] CRAG Evaluation marked context as RELEVANT.`);
        }
      } catch (cragErr) {
        console.warn(`[RAGRetriever] CRAG evaluation failed, assuming RELEVANT.`, cragErr);
      }

      return {
        contextText,
        chunks: finalChunks,
        citations,
        cragEval
      };

    } catch (err: any) {
      console.error('Retrieval operation failed:', err);
      return { contextText: '', chunks: [], citations: [], cragEval: 'ERROR' };
    }
  }
}

export const ragRetriever = new RAGRetriever();
