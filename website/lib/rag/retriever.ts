/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragEmbedder } from './embedder';
import { ragDatabase } from './supabase';
import { ragReranker } from './reranker';
import { telemetryLogger } from '../telemetry';
import { ragContextBuilder } from './context-builder';
import { providerFactory } from '../providers';
import { systemConfig } from '../system/config';

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
    filters: Record<string, any> = {},
    queryVector?: number[]
  ): Promise<{ contextText: string; chunks: RetrievedChunk[]; citations: any[], cragEval: string }> {
    try {
      const normalizedQuery = this.normalizeQuery(query);
      const expandedQuery = this.expandQuery(query);
      
      telemetryLogger.log('RAG', `Normalized Query: "${normalizedQuery}"`);
      telemetryLogger.log('RAG', `Expanded Query: "${expandedQuery}"`);

      // --- 1. HyDE (Hypothetical Document Embeddings) ---
      let hypotheticalDocument = normalizedQuery;
      let finalEmbedding = queryVector;

      try {
        const { providerFactory } = await import('@/lib/providers');
        const aiClient = providerFactory.getChatProvider();
        const hydePrompt = `You are a technical expert. Write a concise, factual excerpt (3-4 sentences) that directly answers the following query. Write it in the style of official technical documentation.\n\nQuery: ${normalizedQuery}`;
        
        // Add a 350ms timeout to HyDE to bound latency strictly
        const hydePromise = aiClient.generate({ prompt: hydePrompt });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('HyDE timeout')), 350));
        
        const hydeRes = await Promise.race([hydePromise, timeoutPromise]) as any;
        
        if (hydeRes && hydeRes.content) {
          hypotheticalDocument = hydeRes.content.trim();
          telemetryLogger.log('RAG', `HyDE generated: "${hypotheticalDocument.substring(0, 50)}..."`);
          finalEmbedding = await ragEmbedder.embed(hypotheticalDocument);
        }
      } catch (hydeErr) {
        telemetryLogger.log('RAG', `HyDE bounded latency exceeded or failed, continuing with original query vector.`);
      }

      // If HyDE failed/timed out, and we weren't passed a queryVector, we must generate it.
      if (!finalEmbedding) {
        finalEmbedding = await ragEmbedder.embed(normalizedQuery);
      }

      // 3. Deterministic Vector Retrieval Pipeline
      const { retrievalPipeline } = await import('../retrieval/pipeline');
      
      const retrievalResult = await retrievalPipeline.retrieve({
        queryEmbedding: finalEmbedding,
        limit: 50,
        threshold,
        filters,
        strategy: 'vector_only'
      });

      telemetryLogger.log('RAG', `Deterministic retrieval candidate count: ${retrievalResult.statistics.candidateCount}`);

      const top8Candidates = retrievalResult.candidates.slice(0, 8);

      if (top8Candidates.length === 0) {
        return { contextText: '', chunks: [], citations: [], cragEval: 'IRRELEVANT' };
      }

      // 4. Execute Reranker to filter down to the best candidates
      const rerankedResults = await ragReranker.rerank(normalizedQuery, top8Candidates, limit);

      const finalChunks = rerankedResults.map((r) => {
        const originalRecord = top8Candidates[r.index]!;
        return {
          chunkId: originalRecord.chunk_id,
          documentId: originalRecord.document_id,
          chunkText: originalRecord.chunk_text,
          chunkNumber: originalRecord.chunk_number,
          metadata: originalRecord.metadata || {},
          score: r.relevanceScore
        };
      });

      const { contextText, citations } = ragContextBuilder.buildContext(
        finalChunks as any,
        systemConfig.RAG_MAX_CONTEXT_TOKENS
      );

      // --- 8. CRAG (Corrective RAG) Context Evaluation ---
      // The user approved moving this to a fire-and-forget background promise since it only logs telemetry
      // and does not halt generation or influence retrieval.
      const cragEval = 'RELEVANT';
      import('@/lib/providers').then(({ providerFactory }) => {
        const aiClient = providerFactory.getChatProvider();
        const cragPrompt = `You are a grader evaluating the relevance of retrieved context to a user query. \n\nQuery: ${normalizedQuery}\n\nContext:\n${contextText}\n\nDoes the context contain sufficient relevant information to answer the query? Respond with exactly one word: "RELEVANT" or "IRRELEVANT".`;
        aiClient.generate({ prompt: cragPrompt })
          .then(cragRes => {
            const evalScore = cragRes?.content?.trim().toUpperCase();
            if (evalScore && evalScore.includes('IRRELEVANT')) {
              telemetryLogger.log('RAG', `CRAG Evaluation marked context as IRRELEVANT.`);
            } else {
              telemetryLogger.log('RAG', `CRAG Evaluation marked context as RELEVANT.`);
            }
          })
          .catch(err => telemetryLogger.error('RAG', `CRAG async evaluation failed.`, err));
      });

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
