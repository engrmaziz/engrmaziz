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
  status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'SKIPPED';
  durationMs: number;
}

export interface RequestContext {
  // 1. Business Context
  request: {
    query: string;
    optimizedQuery: string;
    sessionId?: string;
    conversationId?: string;
  };
  memory: {
    history: any[];
    summary?: string;
  };
  retrieval: {
    retrievedContext?: string;
    citations: any[];
  };
  prompt: {
    messages: any[];
  };
  response: {
    assistantResponse?: string;
    toolOutputs: any[];
  };

  // 2. Execution Context (Operational Metadata)
  executionContext: {
    requestId: string;
    telemetry: {
      total: StageTelemetry;
      memory: StageTelemetry;
      retrieval: StageTelemetry;
      promptAssembly: StageTelemetry;
      llm: StageTelemetry;
      persistence: StageTelemetry;
    };
    flags: Record<string, boolean>;
    diagnostics: {
      denseCandidates: number;
      sparseCandidates: number;
      hybridCandidates: number;
      finalContextChunks: number;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      cacheHit: boolean;
      memoryMessagesLoaded: number;
      summaryUsed: boolean;
    };
    versions: Record<string, string>;
    errors: string[];
  };
}

export class RAGOrchestrator {
  private log(stage: string, reqId: string, duration: number, status: string, msg: string = '') {
    console.log(`[RAG] requestId=${reqId} stage=${stage} duration=${duration}ms status=${status} ${msg}`);
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

    const ctx: RequestContext = {
      request: {
        query: queryText,
        optimizedQuery: queryText,
        sessionId,
        conversationId: sessionId || undefined
      },
      memory: { history: [] },
      retrieval: { citations: [] },
      prompt: { messages: [] },
      response: { toolOutputs: [] },
      executionContext: {
        requestId,
        telemetry: {
          total: { status: 'PENDING', durationMs: 0 },
          memory: { status: 'PENDING', durationMs: 0 },
          retrieval: { status: 'PENDING', durationMs: 0 },
          promptAssembly: { status: 'PENDING', durationMs: 0 },
          llm: { status: 'PENDING', durationMs: 0 },
          persistence: { status: 'PENDING', durationMs: 0 }
        },
        flags: { memory: true, rag: true, reranker: true, hyde: true, crag: true },
        diagnostics: {
          denseCandidates: 0,
          sparseCandidates: 0,
          hybridCandidates: 0,
          finalContextChunks: 0,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          cacheHit: false,
          memoryMessagesLoaded: 0,
          summaryUsed: false
        },
        versions: {
          pipeline: '1.2.0',
          prompt: '1.0.0',
          embeddingModel: process.env.EMBEDDING_MODEL || 'jina-embeddings-v4',
          rerankerVersion: 'local-rrf-fallback',
          retrieverVersion: '1.0.0'
        },
        errors: []
      }
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
        ctx.memory.summary = conversation?.summary || undefined;
        ctx.memory.history = await ragMemory.loadRecentMessages(sessionId, 6);
        ctx.executionContext.diagnostics.memoryMessagesLoaded = ctx.memory.history.length;
        ctx.executionContext.diagnostics.summaryUsed = !!ctx.memory.summary;

        if (ctx.memory.history.length > 0) {
          const historyStr = ctx.memory.history
            .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
            .join('\n');
          
          const rewritePrompt = CONVERSATION_REWRITER_PROMPT
            .replace('{history}', historyStr)
            .replace('{query}', queryText);
          
          const rewriteRes = await aiClient.generateSimpleResponse(rewritePrompt);
          if (rewriteRes && rewriteRes.content) {
            ctx.request.optimizedQuery = rewriteRes.content.trim();
          }
        }
      }
      ctx.executionContext.telemetry.memory.durationMs = Date.now() - startMemory;
      ctx.executionContext.telemetry.memory.status = 'SUCCESS';
      this.log('Memory', requestId, ctx.executionContext.telemetry.memory.durationMs, 'SUCCESS');
    } catch (err: any) {
      ctx.executionContext.telemetry.memory.durationMs = Date.now() - startMemory;
      ctx.executionContext.telemetry.memory.status = 'ERROR';
      ctx.executionContext.errors.push(`Memory Error: ${err.message}`);
      this.log('Memory', requestId, ctx.executionContext.telemetry.memory.durationMs, 'ERROR', err.message);
      throw err;
    }

    // ==========================================
    // CACHE CHECK
    // ==========================================
    let queryVector: number[] = [];
    try {
      queryVector = await ragEmbedder.embed(ctx.request.optimizedQuery);
      const cached = await ragCache.get(ctx.request.optimizedQuery, queryVector, 0.98);
      if (cached) {
        ctx.executionContext.diagnostics.cacheHit = true;
        ctx.executionContext.telemetry.total.durationMs = Date.now() - startTotal;
        ctx.executionContext.telemetry.total.status = 'SUCCESS';
        
        ctx.executionContext.telemetry.retrieval.status = 'SKIPPED';
        ctx.executionContext.telemetry.promptAssembly.status = 'SKIPPED';
        ctx.executionContext.telemetry.llm.status = 'SKIPPED';
        ctx.executionContext.telemetry.persistence.status = 'SKIPPED';

        this.log('Cache', requestId, ctx.executionContext.telemetry.total.durationMs, 'SUCCESS', 'Cache Hit');
        
        ragDatabase.logAnalytics({
          sessionId: sessionId || undefined,
          queryText: queryText,
          queryEmbedding: queryVector,
          responseText: cached.responseText,
          latencyMs: ctx.executionContext.telemetry.total.durationMs,
          llmModel: 'Semantic Cache',
          metadata: { 
            cacheHit: true, 
            similarity: cached.similarity, 
            originalQuery: queryText,
            executionContext: ctx.executionContext 
          }
        }).catch(err => console.error('[RAG] Failed to log cached telemetry:', err));

        return { 
          answer: cached.responseText, 
          citations: cached.metadata?.citations || [], 
          cacheHit: true, 
          latencyMs: ctx.executionContext.telemetry.total.durationMs,
          context: ctx 
        };
      }
    } catch (cacheErr) {
      console.warn('[RAG] Cache check failed, continuing search.', cacheErr);
    }

    // ==========================================
    // STAGE 2: RETRIEVAL
    // ==========================================
    const startRetrieval = Date.now();
    try {
      const retrievalResult = await ragRetriever.retrieve(ctx.request.optimizedQuery, 5, 0.3, filters);
      ctx.retrieval.retrievedContext = retrievalResult.contextText;
      ctx.retrieval.citations = retrievalResult.citations;
      
      ctx.executionContext.diagnostics.finalContextChunks = retrievalResult.chunks.length;
      
      ctx.executionContext.telemetry.retrieval.durationMs = Date.now() - startRetrieval;
      ctx.executionContext.telemetry.retrieval.status = 'SUCCESS';
      this.log('Retrieval', requestId, ctx.executionContext.telemetry.retrieval.durationMs, 'SUCCESS');
    } catch (err: any) {
      ctx.executionContext.telemetry.retrieval.durationMs = Date.now() - startRetrieval;
      ctx.executionContext.telemetry.retrieval.status = 'ERROR';
      ctx.executionContext.errors.push(`Retrieval Error: ${err.message}`);
      this.log('Retrieval', requestId, ctx.executionContext.telemetry.retrieval.durationMs, 'ERROR', err.message);
      throw err;
    }

    // ==========================================
    // STAGE 3: PROMPT ASSEMBLY
    // ==========================================
    const startPrompt = Date.now();
    try {
      ctx.prompt.messages = promptBuilder.buildPrompt(
        ctx.memory.summary || null,
        ctx.memory.history,
        ctx.retrieval.retrievedContext || '',
        queryText
      );
      ctx.executionContext.telemetry.promptAssembly.durationMs = Date.now() - startPrompt;
      ctx.executionContext.telemetry.promptAssembly.status = 'SUCCESS';
      this.log('PromptAssembly', requestId, ctx.executionContext.telemetry.promptAssembly.durationMs, 'SUCCESS');
    } catch (err: any) {
      ctx.executionContext.telemetry.promptAssembly.durationMs = Date.now() - startPrompt;
      ctx.executionContext.telemetry.promptAssembly.status = 'ERROR';
      ctx.executionContext.errors.push(`PromptAssembly Error: ${err.message}`);
      this.log('PromptAssembly', requestId, ctx.executionContext.telemetry.promptAssembly.durationMs, 'ERROR', err.message);
      throw err;
    }

    // ==========================================
    // STAGE 4: LLM INVOCATION
    // ==========================================
    const startLlm = Date.now();
    let llmRes: any;
    try {
      llmRes = await aiClient.generateComplexResponse(ctx.prompt.messages);
      ctx.response.assistantResponse = llmRes.content;
      
      ctx.executionContext.diagnostics.promptTokens = llmRes?.usage?.promptTokens || 0;
      ctx.executionContext.diagnostics.completionTokens = llmRes?.usage?.completionTokens || 0;
      ctx.executionContext.diagnostics.totalTokens = (llmRes?.usage?.promptTokens || 0) + (llmRes?.usage?.completionTokens || 0);

      ctx.executionContext.telemetry.llm.durationMs = Date.now() - startLlm;
      ctx.executionContext.telemetry.llm.status = 'SUCCESS';
      this.log('LLM', requestId, ctx.executionContext.telemetry.llm.durationMs, 'SUCCESS');
    } catch (err: any) {
      ctx.executionContext.telemetry.llm.durationMs = Date.now() - startLlm;
      ctx.executionContext.telemetry.llm.status = 'ERROR';
      ctx.executionContext.errors.push(`LLM Error: ${err.message}`);
      this.log('LLM', requestId, ctx.executionContext.telemetry.llm.durationMs, 'ERROR', err.message);
      throw err;
    }

    // ==========================================
    // STAGE 5: PERSISTENCE
    // ==========================================
    const startPersistence = Date.now();
    try {
      if (sessionId && ctx.response.assistantResponse) {
        await ragMemory.saveUserMessage(sessionId, queryText);
        await ragMemory.saveAssistantMessage(sessionId, ctx.response.assistantResponse, ctx.retrieval.citations, llmRes.model, ctx.executionContext.telemetry.llm.durationMs);
      }
      
      if (queryVector.length > 0 && ctx.response.assistantResponse) {
        ragCache.set(ctx.request.optimizedQuery, queryVector, ctx.response.assistantResponse, { citations: ctx.retrieval.citations })
          .catch(() => {});
      }

      ctx.executionContext.telemetry.persistence.durationMs = Date.now() - startPersistence;
      ctx.executionContext.telemetry.persistence.status = 'SUCCESS';
      this.log('Persistence', requestId, ctx.executionContext.telemetry.persistence.durationMs, 'SUCCESS');
    } catch (err: any) {
      ctx.executionContext.telemetry.persistence.durationMs = Date.now() - startPersistence;
      ctx.executionContext.telemetry.persistence.status = 'ERROR';
      ctx.executionContext.errors.push(`Persistence Error: ${err.message}`);
      this.log('Persistence', requestId, ctx.executionContext.telemetry.persistence.durationMs, 'ERROR', err.message);
      throw err;
    }

    // ==========================================
    // FINALIZE & TELEMETRY
    // ==========================================
    ctx.executionContext.telemetry.total.durationMs = Date.now() - startTotal;
    ctx.executionContext.telemetry.total.status = 'SUCCESS';
    
    if (queryVector.length > 0 && ctx.response.assistantResponse) {
      const promptTokens = ctx.executionContext.diagnostics.promptTokens;
      const completionTokens = ctx.executionContext.diagnostics.completionTokens;
      const cost = ((promptTokens * 0.50) + (completionTokens * 0.80)) / 1000000;

      ragDatabase.logAnalytics({
        sessionId: sessionId || undefined,
        queryText: queryText,
        queryEmbedding: queryVector,
        responseText: ctx.response.assistantResponse,
        latencyMs: ctx.executionContext.telemetry.total.durationMs,
        llmModel: llmRes?.model || 'unknown',
        promptTokens: promptTokens,
        completionTokens: completionTokens,
        totalTokens: promptTokens + completionTokens,
        cost: cost,
        metadata: { 
          citations: ctx.retrieval.citations, 
          originalQuery: queryText, 
          executionContext: ctx.executionContext 
        }
      }).catch((err) => console.error('[RAG] Failed to log final telemetry:', err));
    }

    this.log('Total', requestId, ctx.executionContext.telemetry.total.durationMs, 'SUCCESS');

    return {
      answer: ctx.response.assistantResponse,
      citations: ctx.retrieval.citations,
      cacheHit: false,
      latencyMs: ctx.executionContext.telemetry.total.durationMs,
      context: ctx
    };
  }
}

export const ragOrchestrator = new RAGOrchestrator();
