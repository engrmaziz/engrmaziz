// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto';
import { ragRetriever } from './retriever';
import { ragDatabase } from './supabase';
import { ragEmbedder } from './embedder';
import { providerFactory } from '../providers';
import { CONVERSATION_REWRITER_PROMPT } from './prompts';
import { ragCache } from './cache';
import { ragMemory } from './memory';
import { promptBuilder } from './prompt-builder';
import { RequestTrace, telemetryLogger } from '../telemetry';
import { systemConfig } from '../system/config';

export interface RequestContext {
  request: {
    query: string;
    optimizedQuery: string;
    sessionId?: string;
    conversationId?: string;
    visitorInfo?: any;
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
  executionContext: {
    requestId: string;
    trace: RequestTrace;
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
    metadata?: any;
  };
}

export class RAGOrchestrator {
  async execute(requestBody: any): Promise<any> {
    const aiClient = providerFactory.getChatProvider();
    const requestId = randomUUID();
    const queryText = requestBody.query || '';
    const sessionId = requestBody.sessionId || '';
    const filters = requestBody.filters || {};
    const visitorInfo = requestBody.visitorInfo;

    if (!queryText.trim()) {
      throw new Error('Query text cannot be empty.');
    }

    const trace = new RequestTrace(requestId);
    trace.startStage('Total');

    const ctx: RequestContext = {
      request: {
        query: queryText,
        optimizedQuery: queryText,
        sessionId,
        conversationId: sessionId || undefined,
        visitorInfo
      },
      memory: { history: [] },
      retrieval: { citations: [] },
      prompt: { messages: [] },
      response: { toolOutputs: [] },
      executionContext: {
        requestId,
        trace,
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
          embeddingModel: systemConfig.EMBEDDING_MODEL,
          rerankerVersion: 'local-rrf-fallback',
          retrieverVersion: '1.0.0'
        },
        errors: []
      }
    };

    // ==========================================
    // STAGE 1: MEMORY
    // ==========================================
    trace.startStage('Memory');
    try {
      if (sessionId) {
        const { conversation, messages } = await ragMemory.loadConversationAndUnsummarized(sessionId);
        let conv = conversation;
        
        if (!conv) {
          conv = await ragMemory.createConversation(sessionId);
        }
        
        ctx.memory.summary = conv?.summary || undefined;
        ctx.memory.history = messages || [];
        
        ctx.executionContext.diagnostics.memoryMessagesLoaded = ctx.memory.history.length;
        ctx.executionContext.diagnostics.summaryUsed = !!ctx.memory.summary;

        if (ctx.memory.history.length > 0) {
          // Heuristic: Check if query is standalone or requires context resolution
          const lowerQuery = queryText.toLowerCase().trim();
          const needsRewrite = /^(what about|explain that|compare it|what did i|what was|tell me more|how does it|why|where|who is he|who is she|and|but)/i.test(lowerQuery);
          
          if (!needsRewrite) {
            // Standalone query: bypass LLM rewrite to save ~2500ms
            telemetryLogger.log('RAG', `Memory stage: Bypassing LLM rewrite for standalone query: "${queryText}"`);
            ctx.request.optimizedQuery = queryText;
          } else {
            telemetryLogger.log('RAG', `Memory stage: Invoking LLM rewrite for query: "${queryText}"`);
            const historyStr = ctx.memory.history
              .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
              .join('\n');
            
            const rewritePrompt = CONVERSATION_REWRITER_PROMPT
              .replace('{history}', historyStr)
              .replace('{query}', queryText);
            
            const rewriteRes = await aiClient.generate({ prompt: rewritePrompt });
            if (rewriteRes && rewriteRes.content) {
              ctx.request.optimizedQuery = rewriteRes.content.trim();
              telemetryLogger.log('RAG', `Memory stage: Rewritten query: "${ctx.request.optimizedQuery}"`);
            }
          }
        }
      }
      trace.endStage('Memory', true);
      telemetryLogger.log('PIPELINE', 'Memory stage completed', { requestId, durationMs: trace.exportTrace().stages['Memory'].durationMs });
    } catch (err: any) {
      trace.endStage('Memory', false, err.message);
      ctx.executionContext.errors.push(`Memory Error: ${err.message}`);
      telemetryLogger.error('PIPELINE', 'Memory stage failed', err, { requestId });
      throw err;
    }

    // ==========================================
    // CACHE CHECK
    // ==========================================
    let queryVector: number[] = [];
    try {
      queryVector = await ragEmbedder.embed(ctx.request.optimizedQuery);
      const cached = await ragCache.get(ctx.request.optimizedQuery, queryVector, 0.98);
      if (cached && !requestBody.flags?.bypassCache) {
        ctx.executionContext.diagnostics.cacheHit = true;
        trace.endStage('Total', true);
        
        telemetryLogger.log('PIPELINE', 'Semantic Cache hit', { requestId });
        
        ragDatabase.logAnalytics({
          sessionId: sessionId || undefined,
          queryText: queryText,
          queryEmbedding: queryVector,
          responseText: cached.responseText,
          latencyMs: trace.exportTrace().stages['Total'].durationMs,
          llmModel: 'Semantic Cache',
          metadata: { 
            cacheHit: true, 
            similarity: cached.similarity, 
            originalQuery: queryText,
            executionContext: ctx.executionContext 
          }
        }).catch(err => telemetryLogger.error('RAG', 'Failed to log cached telemetry', err));

        return { 
          answer: cached.responseText, 
          citations: cached.metadata?.citations || [], 
          cacheHit: true, 
          latencyMs: trace.exportTrace().stages['Total'].durationMs,
          context: ctx 
        };
      }
    } catch (cacheErr) {
      telemetryLogger.error('PIPELINE', 'Cache check failed, continuing search.', cacheErr);
    }

    // ==========================================
    // STAGE 2: RETRIEVAL
    // ==========================================
    trace.startStage('Retrieval');
    try {
      // Reduced threshold from 0.0 to -1.0 to allow broad queries to capture all available services
      const retrievalResult = await ragRetriever.retrieve(ctx.request.optimizedQuery, 40, -1.0, filters, queryVector);
      ctx.retrieval.retrievedContext = retrievalResult.contextText;
      ctx.retrieval.citations = retrievalResult.citations;
      
      ctx.executionContext.diagnostics.finalContextChunks = retrievalResult.chunks.length;
      (ctx.executionContext.diagnostics as any).retrievalStageTimings = (retrievalResult as any).stageTimings;
      
      if (systemConfig.ENABLE_PERFORMANCE_PROFILING) {
        console.log('\n========================================');
        console.log('DOCUMENT RETRIEVAL & PRUNING AUDIT');
        console.log('========================================');
        
        console.log('\n[RETRIEVED DOCUMENTS (Top 30 Candidates to Reranker)]');
        // We can access original diverseCandidates from logs inside retriever if needed, 
        // but let's print the chunks that made it past reranker into Prompt Assembly first.
        retrievalResult.chunks.forEach((chunk: any) => {
          console.log(`- [${chunk.documentId}] ${chunk.metadata.title} (${chunk.metadata.url}) | Score: ${chunk.score?.toFixed(3)}`);
        });

        console.log('\n[PROMPT DOCUMENTS (Actually included in Context)]');
        ctx.retrieval.citations.forEach((cit: any) => {
          console.log(`- [ID: ${cit.id}] ${cit.title} (${cit.url})`);
        });

        console.log('\n[DROPPED DOCUMENTS (Due to Context Budget / Reranking)]');
        // Any chunk that is in retrievalResult.chunks but NOT in ctx.retrieval.citations
        const promptUrls = new Set(ctx.retrieval.citations.map((c: any) => c.url));
        retrievalResult.chunks.forEach((chunk: any) => {
          if (!promptUrls.has(chunk.metadata.url)) {
            console.log(`- [${chunk.documentId}] ${chunk.metadata.title} | Reason: Dropped during token budget construction`);
          }
        });
        console.log('========================================\n');
      }

      trace.endStage('Retrieval', true);
      telemetryLogger.log('PIPELINE', 'Retrieval stage completed', { requestId, durationMs: trace.exportTrace().stages['Retrieval'].durationMs });
    } catch (err: any) {
      trace.endStage('Retrieval', false, err.message);
      ctx.executionContext.errors.push(`Retrieval Error: ${err.message}`);
      telemetryLogger.error('PIPELINE', 'Retrieval stage failed', err, { requestId });
      throw err;
    }

    // ==========================================
    // STAGE 3: PROMPT ASSEMBLY
    // ==========================================
    trace.startStage('PromptAssembly');
    try {
      ctx.prompt.messages = promptBuilder.buildPrompt(
        ctx.memory.summary || null,
        ctx.memory.history,
        ctx.retrieval.retrievedContext || '',
        queryText,
        ctx.response.toolOutputs,
        ctx.request.visitorInfo
      );
      trace.endStage('PromptAssembly', true);
      telemetryLogger.log('PIPELINE', 'PromptAssembly stage completed', { requestId, durationMs: trace.exportTrace().stages['PromptAssembly'].durationMs });
    } catch (err: any) {
      trace.endStage('PromptAssembly', false, err.message);
      ctx.executionContext.errors.push(`PromptAssembly Error: ${err.message}`);
      telemetryLogger.error('PIPELINE', 'PromptAssembly stage failed', err, { requestId });
      throw err;
    }

    // ==========================================
    // STAGE 4: WORKFLOW ORCHESTRATION & AGENT EXECUTION
    // ==========================================
    trace.startStage('Generation');
    try {
      const { workflowRouter, createWorkflowContext } = await import('../workflows');
      
      const agentContext = {
        requestContext: ctx,
        conversationHistory: ctx.memory.history,
        conversationSummary: ctx.memory.summary,
        retrievalResults: {
          contextText: ctx.retrieval.retrievedContext,
          citations: ctx.retrieval.citations
        },
        toolResults: ctx.response.toolOutputs,
        trace: ctx.executionContext.trace
      };
      
      const workflowCtx = createWorkflowContext(ctx, agentContext, trace);
      const workflow = workflowRouter.route(workflowCtx);
      const workflowResult = await workflow.execute(workflowCtx);
      
      const response = workflowResult.response;
      
      // Apply deterministic application-layer citation formatting
      const { CitationFormatter } = await import('./citation-formatter');
      ctx.response.assistantResponse = CitationFormatter.format(response.content, ctx.retrieval.citations);
      
      ctx.executionContext.metadata = ctx.executionContext.metadata || {};
      ctx.executionContext.metadata.agentContext = {
         agentId: 'workflow-managed',
         lastLlmModel: response.model || 'unknown'
      };
      trace.endStage('Generation', true);
    } catch (agentErr: any) {
      trace.endStage('Generation', false, agentErr.message);
      ctx.executionContext.errors.push(`Agent Fatal Error: ${agentErr.message}`);
      telemetryLogger.error('AGENT', 'Fatal execution error', agentErr, { requestId });
    }

    // ==========================================
    // STAGE 5: PERSISTENCE
    // ==========================================
    trace.startStage('Persistence');
    try {
      const llmModel = (ctx.executionContext as any).metadata?.agentContext?.lastLlmModel || 'unknown';
      if (sessionId && ctx.response.assistantResponse) {
        await ragMemory.saveUserMessage(sessionId, queryText);
        await ragMemory.saveAssistantMessage(sessionId, ctx.response.assistantResponse, ctx.retrieval.citations, llmModel, trace.exportTrace().stages['Total']?.durationMs || 0);
        
        // Fire-and-forget memory pruning evaluation (0 ms synchronous penalty)
        const { ragSummary } = await import('./memory');
        ragSummary.triggerAsyncSummarization(sessionId).catch((err) => telemetryLogger.error('SUMMARY', 'triggerAsyncSummarization failed', err));
      }
      
      if (queryVector.length > 0 && ctx.response.assistantResponse) {
        ragCache.set(ctx.request.optimizedQuery, queryVector, ctx.response.assistantResponse, { citations: ctx.retrieval.citations })
          .catch(() => {});
      }

      trace.endStage('Persistence', true);
      telemetryLogger.log('PIPELINE', 'Persistence stage completed', { requestId, durationMs: trace.exportTrace().stages['Persistence'].durationMs });
    } catch (err: any) {
      trace.endStage('Persistence', false, err.message);
      ctx.executionContext.errors.push(`Persistence Error: ${err.message}`);
      telemetryLogger.error('PIPELINE', 'Persistence stage failed', err, { requestId });
      throw err;
    }

    // ==========================================
    // FINALIZE & TELEMETRY
    // ==========================================
    trace.endStage('Total', true);
    
    // Attach metadata
    trace.attachMetadata('diagnostics', ctx.executionContext.diagnostics);
    trace.attachMetadata('versions', ctx.executionContext.versions);
    if (ctx.executionContext.metadata?.agentContext) {
      trace.attachMetadata('agentContext', ctx.executionContext.metadata.agentContext);
    }

    if (queryVector.length > 0 && ctx.response.assistantResponse) {
      const promptTokens = ctx.executionContext.diagnostics.promptTokens;
      const completionTokens = ctx.executionContext.diagnostics.completionTokens;
      const cost = ((promptTokens * 0.50) + (completionTokens * 0.80)) / 1000000;

      const llmModel = (ctx.executionContext as any).metadata?.agentContext?.lastLlmModel || 'unknown';
      ragDatabase.logAnalytics({
        sessionId: sessionId || undefined,
        queryText: queryText,
        queryEmbedding: queryVector,
        responseText: ctx.response.assistantResponse,
        latencyMs: trace.exportTrace().stages['Total'].durationMs,
        llmModel: llmModel,
        promptTokens: promptTokens,
        completionTokens: completionTokens,
        totalTokens: promptTokens + completionTokens,
        cost: cost,
        metadata: { 
          citations: ctx.retrieval.citations, 
          originalQuery: queryText, 
          trace: trace.exportTrace()
        }
      }).catch((err) => telemetryLogger.error('PIPELINE', 'Failed to log final telemetry', err));
    }

    telemetryLogger.log('PIPELINE', 'Total request completed', { requestId, durationMs: trace.exportTrace().stages['Total'].durationMs });

    if (systemConfig.ENABLE_PERFORMANCE_PROFILING) {
      const t = trace.exportTrace().stages;
      console.log('\n========================================');
      console.log('PERFORMANCE PROFILE');
      console.log('========================================');
      console.log(`Memory ............ ${t['Memory']?.durationMs || 0} ms`);
      console.log(`Retrieval ......... ${t['Retrieval']?.durationMs || 0} ms`);
      console.log(`Prompt Assembly ... ${t['PromptAssembly']?.durationMs || 0} ms`);
      console.log(`Generation ........ ${t['Generation']?.durationMs || 0} ms`);
      console.log(`Persistence ....... ${t['Persistence']?.durationMs || 0} ms`);
      console.log(`TOTAL ............. ${t['Total']?.durationMs || 0} ms`);
      console.log('========================================\n');
    }

    return {
      answer: ctx.response.assistantResponse,
      citations: ctx.retrieval.citations,
      cacheHit: false,
      latencyMs: trace.exportTrace().stages['Total'].durationMs,
      context: ctx
    };
  }
}

export const ragOrchestrator = new RAGOrchestrator();
