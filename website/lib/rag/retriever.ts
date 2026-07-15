/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragEmbedder } from './embedder';
import { ragDatabase } from './supabase';
import { ragReranker } from './reranker';
import { telemetryLogger } from '../telemetry';
import { ragContextBuilder } from './context-builder';
import { providerFactory } from '../providers';
import { systemConfig } from '../system';

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
      
      telemetryLogger.log('RAG', `Normalized Query: "${normalizedQuery}"`);
      telemetryLogger.log('RAG', `Expanded Query: "${expandedQuery}"`);

      // --- 1. HyDE (Hypothetical Document Embeddings) ---
      let hypotheticalDocument = normalizedQuery;
      try {
        const { providerFactory } = await import('@/lib/providers');
        const aiClient = providerFactory.getChatProvider();
        const hydePrompt = `You are a technical expert. Write a concise, factual excerpt (3-4 sentences) that directly answers the following query. Write it in the style of official technical documentation.\n\nQuery: ${normalizedQuery}`;
        const hydeRes = await aiClient.generate({ prompt: hydePrompt });
        if (hydeRes && hydeRes.content) {
          hypotheticalDocument = hydeRes.content.trim();
          telemetryLogger.log('RAG', `HyDE generated: "${hypotheticalDocument.substring(0, 50)}..."`);
        }
      } catch (hydeErr) {
        telemetryLogger.error('RAG', `HyDE generation failed, falling back to original query.`, hydeErr);
      }

      // 2. Generate Query Vector Embedding using the Hypothetical Document (or fallback to query)
      const queryEmbedding = await ragEmbedder.embed(hypotheticalDocument);

      // 3. Deterministic Vector Retrieval Pipeline
      const { retrievalPipeline } = await import('../retrieval/pipeline');
      
      const retrievalResult = await retrievalPipeline.retrieve({
        queryEmbedding,
        limit: 50,
        threshold,
        filters,
        strategy: 'vector_only'
      });

      telemetryLogger.log('RAG', `Deterministic retrieval candidate count: ${retrievalResult.statistics.candidateCount}`);

      // Take the top 15 normalized candidates
      const top15Candidates = retrievalResult.candidates.slice(0, 15);

      if (top15Candidates.length === 0) {
        return { contextText: '', chunks: [], citations: [], cragEval: 'IRRELEVANT' };
      }

      // 4. Execute Reranker to filter down to the best candidates
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
        systemConfig.RAG_MAX_CONTEXT_TOKENS
      );

      // --- 8. CRAG (Corrective RAG) Context Evaluation ---
      let cragEval = 'RELEVANT';
      try {
        const { providerFactory } = await import('@/lib/providers');
        const aiClient = providerFactory.getChatProvider();
        const cragPrompt = `You are a grader evaluating the relevance of retrieved context to a user query. \n\nQuery: ${normalizedQuery}\n\nContext:\n${contextText}\n\nDoes the context contain sufficient relevant information to answer the query? Respond with exactly one word: "RELEVANT" or "IRRELEVANT".`;
        const cragRes = await aiClient.generate({ prompt: cragPrompt });
        const evalScore = cragRes?.content?.trim().toUpperCase();
        if (evalScore && evalScore.includes('IRRELEVANT')) {
          cragEval = 'IRRELEVANT';
          telemetryLogger.log('RAG', `CRAG Evaluation marked context as IRRELEVANT.`);
        } else {
          telemetryLogger.log('RAG', `CRAG Evaluation marked context as RELEVANT.`);
        }
      } catch (cragErr) {
        telemetryLogger.error('RAG', `CRAG evaluation failed, assuming RELEVANT.`, cragErr);
      }

      return {
        contextText,
        chunks: finalChunks,
        citations,
        cragEval
      };

    } catch (err: any) {
      telemetryLogger.error('RAG', 'Retrieval operation failed', err);
      return { contextText: '', chunks: [], citations: [], cragEval: 'ERROR' };
    }
  }
}

export const ragRetriever = new RAGRetriever();
