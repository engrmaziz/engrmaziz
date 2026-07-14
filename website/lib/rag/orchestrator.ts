import { randomUUID } from 'crypto';
import { ragRetriever } from './retriever';
import { ragDatabase } from './supabase';
import { ragEmbedder } from './embedder';
import { createAIClient } from '../ai/client';
import { CONVERSATION_REWRITER_PROMPT } from './prompts';
import { ragCache } from './cache';
import { ragMemory } from './memory';
import { promptBuilder } from './prompt-builder';

export interface StageTelemetry {
  startTime: number;
  memoryMs?: number;
  retrievalMs?: number;
  promptAssemblyMs?: number;
  llmMs?: number;
  persistenceMs?: number;
  totalMs?: number;
}

export interface RequestContext {
  requestId: string;
  sessionId?: string;
  conversationId?: string;
  query: string;
  optimizedQuery: string;
  history: any[];
  summary?: string;
  retrievedContext?: string;
  citations: any[];
  assistantResponse?: string;
  metadata: Record<string, unknown>;
  telemetry: StageTelemetry;
  diagnostics: {
    denseCandidates?: number;
    sparseCandidates?: number;
    rerankedCandidates?: number;
  };
  toolOutputs: any[];
  flags: {
    memory: boolean;
    rag: boolean;
    reranker: boolean;
    hyde: boolean;
    crag: boolean;
  };
}

export class RAGOrchestrator {
  private log(stage: string, reqId: string, duration: number, success: boolean, msg: string = '') {
    console.log(`[RAG] requestId=${reqId} stage=${stage} duration=${duration}ms success=${success} ${msg}`);
  }

  async execute(requestBody: any): Promise<any> {
    const aiClient = createAIClient();
    const startTotal = Date.now();
    const requestId = randomUUID();
    const queryText = requestBody.query || '';
    const sessionId = requestBody.sessionId || '';
    const filters = requestBody.filters || {};

    if (!queryText.trim()) {
      throw new Error('Query text cannot be empty.');
    }

    const context: RequestContext = {
      requestId,
      sessionId,
      conversationId: sessionId || undefined,
      query: queryText,
      optimizedQuery: queryText,
      history: [],
      citations: [],
      toolOutputs: [],
      metadata: {},
      diagnostics: {},
      telemetry: { startTime: startTotal },
      flags: { memory: true, rag: true, reranker: true, hyde: true, crag: true }
    };

    let conversation: any = null;

    // ==========================================
    // STAGE 1: MEMORY
    // ==========================================
    const startMemory = Date.now();
    try {
      if (sessionId) {
        conversation = await ragMemory.loadConversation(sessionId);
        if (!conversation) {
          conversation = await ragMemory.createConversation(sessionId);
        }
        context.summary = conversation?.summary || undefined;
        context.history = await ragMemory.loadRecentMessages(sessionId, 6);

        if (context.history.length > 0) {
          const historyStr = context.history
            .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
            .join('\n');
          
          const rewritePrompt = CONVERSATION_REWRITER_PROMPT
            .replace('{history}', historyStr)
            .replace('{query}', queryText);
          
          const rewriteRes = await aiClient.generateSimpleResponse(rewritePrompt);
          if (rewriteRes && rewriteRes.content) {
            context.optimizedQuery = rewriteRes.content.trim();
          }
        }
      }
      context.telemetry.memoryMs = Date.now() - startMemory;
      this.log('Memory', requestId, context.telemetry.memoryMs, true);
    } catch (err: any) {
      context.telemetry.memoryMs = Date.now() - startMemory;
      this.log('Memory', requestId, context.telemetry.memoryMs, false, err.message);
      throw err;
    }

    // ==========================================
    // CACHE CHECK
    // ==========================================
    let queryVector: number[] = [];
    try {
      queryVector = await ragEmbedder.embed(context.optimizedQuery);
      const cached = await ragCache.get(context.optimizedQuery, queryVector, 0.98);
      if (cached) {
        context.telemetry.totalMs = Date.now() - startTotal;
        this.log('Cache', requestId, context.telemetry.totalMs, true, 'Cache Hit');
        
        ragDatabase.insertLog({
          session_id: sessionId,
          query_text: queryText,
          query_embedding: queryVector,
          response_text: cached.responseText,
          latency_ms: context.telemetry.totalMs,
          llm_model: 'Semantic Cache',
          metadata: { cacheHit: true, similarity: cached.similarity, originalQuery: queryText },
          cache_hit: true
        }).catch(err => console.error('[RAG] Failed to log cached telemetry:', err));

        return { answer: cached.responseText, citations: cached.metadata?.citations || [], cacheHit: true, latencyMs: context.telemetry.totalMs };
      }
    } catch (cacheErr) {
      console.warn('[RAG] Cache check failed, continuing search.', cacheErr);
    }

    // ==========================================
    // STAGE 2: RETRIEVAL
    // ==========================================
    const startRetrieval = Date.now();
    try {
      const retrievalResult = await ragRetriever.retrieve(context.optimizedQuery, 5, 0.3, filters);
      context.retrievedContext = retrievalResult.contextText;
      context.citations = retrievalResult.citations;
      // diagnostics mapping (retriever logs internal numbers, but we extract what we can)
      context.diagnostics.rerankedCandidates = retrievalResult.chunks.length;
      
      context.telemetry.retrievalMs = Date.now() - startRetrieval;
      this.log('Retrieval', requestId, context.telemetry.retrievalMs, true);
    } catch (err: any) {
      context.telemetry.retrievalMs = Date.now() - startRetrieval;
      this.log('Retrieval', requestId, context.telemetry.retrievalMs, false, err.message);
      throw err;
    }

    // ==========================================
    // STAGE 3: PROMPT ASSEMBLY
    // ==========================================
    const startPrompt = Date.now();
    let llmMessages: any[] = [];
    try {
      llmMessages = promptBuilder.buildPrompt(
        context.summary || null,
        context.history,
        context.retrievedContext || '',
        queryText
      );
      context.telemetry.promptAssemblyMs = Date.now() - startPrompt;
      this.log('PromptAssembly', requestId, context.telemetry.promptAssemblyMs, true);
    } catch (err: any) {
      context.telemetry.promptAssemblyMs = Date.now() - startPrompt;
      this.log('PromptAssembly', requestId, context.telemetry.promptAssemblyMs, false, err.message);
      throw err;
    }

    // ==========================================
    // STAGE 4: LLM INVOCATION
    // ==========================================
    const startLlm = Date.now();
    let llmRes: any;
    try {
      llmRes = await aiClient.generateComplexResponse(llmMessages);
      context.assistantResponse = llmRes.content;
      context.telemetry.llmMs = Date.now() - startLlm;
      this.log('LLM', requestId, context.telemetry.llmMs, true);
    } catch (err: any) {
      context.telemetry.llmMs = Date.now() - startLlm;
      this.log('LLM', requestId, context.telemetry.llmMs, false, err.message);
      throw err;
    }

    // ==========================================
    // STAGE 5: PERSISTENCE
    // ==========================================
    const startPersistence = Date.now();
    try {
      if (sessionId && context.assistantResponse) {
        await ragMemory.saveUserMessage(sessionId, queryText);
        await ragMemory.saveAssistantMessage(sessionId, context.assistantResponse, context.citations, llmRes.model, context.telemetry.llmMs);
      }
      
      if (queryVector.length > 0 && context.assistantResponse) {
        ragCache.set(context.optimizedQuery, queryVector, context.assistantResponse, { citations: context.citations })
          .catch(() => {});
      }

      context.telemetry.persistenceMs = Date.now() - startPersistence;
      this.log('Persistence', requestId, context.telemetry.persistenceMs, true);
    } catch (err: any) {
      context.telemetry.persistenceMs = Date.now() - startPersistence;
      this.log('Persistence', requestId, context.telemetry.persistenceMs, false, err.message);
      throw err;
    }

    // ==========================================
    // FINALIZE & TELEMETRY
    // ==========================================
    context.telemetry.totalMs = Date.now() - startTotal;
    
    if (queryVector.length > 0 && context.assistantResponse) {
      const promptTokens = llmRes?.usage?.promptTokens || 0;
      const completionTokens = llmRes?.usage?.completionTokens || 0;
      const cost = ((promptTokens * 0.50) + (completionTokens * 0.80)) / 1000000;

      ragDatabase.insertLog({
        session_id: sessionId,
        query_text: queryText,
        query_embedding: queryVector,
        response_text: context.assistantResponse,
        latency_ms: context.telemetry.totalMs,
        llm_model: llmRes?.model || 'unknown',
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        cost: cost,
        metadata: { citations: context.citations, originalQuery: queryText, telemetry: context.telemetry },
        cache_hit: false
      }).catch(() => {});
    }

    this.log('Total', requestId, context.telemetry.totalMs, true);

    return {
      answer: context.assistantResponse,
      citations: context.citations,
      cacheHit: false,
      latencyMs: context.telemetry.totalMs,
      telemetry: context.telemetry
    };
  }
}

export const ragOrchestrator = new RAGOrchestrator();
