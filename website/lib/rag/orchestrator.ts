/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto';
import { ragRetriever } from './retriever';
import { ragDatabase } from './supabase';
import { ragCache } from './cache';
import { ragMemory } from './memory';
import { promptBuilder } from './prompt-builder';
import { RequestTrace, telemetryLogger } from '../telemetry';
import { systemConfig } from '../system/config';
import { expandFollowUpQuery, isFollowUpQuery, isToolHarnessQuery } from './identity';
import { withTimeout } from './timing';
import { CitationFormatter } from './citation-formatter';
import { buildExtractiveAnswer, buildGroundedFallback } from './extractive';
import { providerFactory } from '../providers/factory';
import { recordTtft, getLastTtft } from './metrics';

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
    chunks?: any[];
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
    const requestId = randomUUID();
    const queryText = requestBody.query || '';
    const sessionId = requestBody.sessionId || '';
    const filters = requestBody.filters || {};
    const visitorInfo = requestBody.visitorInfo;
    const isVoice = requestBody.channel === 'voice';

    if (!queryText.trim()) {
      throw new Error('Query text cannot be empty.');
    }

    if (!requestBody.flags?.bypassCache) {
      const cached = await ragCache.getExact(queryText);
      if (cached) {
        const trace = new RequestTrace(requestId);
        trace.startStage('Total');
        trace.endStage('Total', true);
        const ttftMs = trace.exportTrace().stages['Total']?.durationMs || 0;
        recordTtft(ttftMs);
        return {
          answer: cached.responseText,
          citations: cached.metadata?.citations || [],
          cacheHit: true,
          latencyMs: ttftMs,
          ttftMs,
          context: {
            request: { query: queryText, optimizedQuery: queryText, sessionId, visitorInfo },
            executionContext: { diagnostics: { cacheHit: true } }
          }
        };
      }
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
        flags: { memory: true, rag: true, reranker: false, hyde: false, crag: false },
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
          pipeline: '2.0.0',
          prompt: '2.0.0',
          embeddingModel: systemConfig.EMBEDDING_MODEL,
          rerankerVersion: 'local-rrf',
          retrieverVersion: '2.0.0'
        },
        errors: []
      }
    };

    trace.startStage('Memory');
    trace.startStage('Retrieval');
    try {
      const needsHistory = Boolean(sessionId && isFollowUpQuery(queryText));
      const historyPromise = needsHistory
        ? withTimeout(ragMemory.loadRecentMessages(sessionId, 6), 120, [])
        : Promise.resolve([]);

      const retrievalPromise = ragRetriever.retrieve(queryText, 6, 0.22, filters);

      const [history, firstRetrieval] = await Promise.all([historyPromise, retrievalPromise]);
      ctx.memory.history = Array.isArray(history) ? history : [];
      ctx.executionContext.diagnostics.memoryMessagesLoaded = ctx.memory.history.length;
      ctx.request.optimizedQuery = expandFollowUpQuery(queryText, ctx.memory.history);
      trace.endStage('Memory', true);

      let retrievalResult = firstRetrieval;
      if (ctx.request.optimizedQuery !== queryText) {
        retrievalResult = await ragRetriever.retrieve(ctx.request.optimizedQuery, 6, 0.22, filters);
      }

      ctx.retrieval.retrievedContext = retrievalResult.contextText;
      ctx.retrieval.citations = retrievalResult.citations;
      ctx.retrieval.chunks = retrievalResult.chunks;
      ctx.executionContext.diagnostics.finalContextChunks = retrievalResult.chunks.length;
      (ctx.executionContext.diagnostics as any).retrievalStageTimings = (retrievalResult as any).stageTimings;
      trace.endStage('Retrieval', true);
    } catch (err: any) {
      trace.endStage('Memory', false, err.message);
      trace.endStage('Retrieval', false, err.message);
      ctx.executionContext.errors.push(`Memory/Retrieval Error: ${err.message}`);
    }

    trace.startStage('PromptAssembly');
    ctx.prompt.messages = promptBuilder.buildPrompt(
      ctx.memory.summary || null,
      ctx.memory.history,
      ctx.retrieval.retrievedContext || '',
      queryText,
      ctx.response.toolOutputs,
      ctx.request.visitorInfo,
      { channel: isVoice ? 'voice' : 'text' }
    );
    trace.endStage('PromptAssembly', true);

    trace.startStage('Generation');
    try {
      if (isToolHarnessQuery(queryText)) {
        const { agentRuntime } = await import('../agent/agent-runtime');
        await agentRuntime.execute(ctx);
      } else {
        try {
          const aiClient = providerFactory.getChatProvider();
          const generated = await withTimeout(
            aiClient.generate({
              messages: ctx.prompt.messages,
              temperature: isVoice ? 0.28 : 0.15,
              maxTokens: isVoice ? 180 : 800,
              timeoutMs: isVoice ? 2200 : 3500,
            }),
            isVoice ? 2400 : 3800,
            null
          );
          const text = (generated?.content || '').trim();
          const weak = isVoice
            ? text.length < 24
            : text.length < 80 || /json-ld|hero section|related services|^\s*source code:/i.test(text);
          if (!weak) {
            ctx.response.assistantResponse = text;
            (ctx as any)._lastLlmModel = generated?.model || 'groq';
          } else {
            ctx.response.assistantResponse = buildGroundedFallback(ctx.retrieval.chunks || [], queryText);
            (ctx as any)._lastLlmModel = 'grounded-fallback';
          }
        } catch (genErr: any) {
          telemetryLogger.error('AGENT', 'Generation failed, using grounded fallback', genErr);
          ctx.response.assistantResponse = buildGroundedFallback(ctx.retrieval.chunks || [], queryText);
          (ctx as any)._lastLlmModel = 'grounded-fallback';
        }
      }

      if (!ctx.response.assistantResponse || ctx.response.assistantResponse.length < 20) {
        ctx.response.assistantResponse = buildExtractiveAnswer(queryText, ctx.retrieval.chunks || []);
        (ctx as any)._lastLlmModel = (ctx as any)._lastLlmModel || 'extractive-fallback';
      }

      if (isVoice) {
        ctx.response.assistantResponse = ctx.response.assistantResponse || '';
      } else {
        ctx.response.assistantResponse = CitationFormatter.format(
          ctx.response.assistantResponse || '',
          ctx.retrieval.citations
        );
      }

      ctx.executionContext.metadata = ctx.executionContext.metadata || {};
      ctx.executionContext.metadata.agentContext = {
        agentId: 'fast-rag',
        lastLlmModel: (ctx as any)._lastLlmModel || 'unknown'
      };
      trace.endStage('Generation', true);
      recordTtft(Date.now() - (trace.exportTrace().stages['Total']?.startTime || Date.now()));
    } catch (agentErr: any) {
      trace.endStage('Generation', false, agentErr.message);
      ctx.executionContext.errors.push(`Generation Error: ${agentErr.message}`);
      telemetryLogger.error('AGENT', 'Fatal execution error', agentErr, { requestId });
      ctx.response.assistantResponse = isVoice
        ? (buildExtractiveAnswer(queryText, ctx.retrieval.chunks || []) || '')
        : CitationFormatter.format(
            buildExtractiveAnswer(queryText, ctx.retrieval.chunks || []),
            ctx.retrieval.citations
          );
      (ctx as any)._lastLlmModel = 'extractive-fallback';
      ctx.executionContext.metadata = ctx.executionContext.metadata || {};
      ctx.executionContext.metadata.agentContext = {
        agentId: 'fast-rag',
        lastLlmModel: 'extractive-fallback'
      };
      recordTtft(Date.now() - (trace.exportTrace().stages['Total']?.startTime || Date.now()));
    }

    trace.startStage('Persistence');
    const llmModel = ctx.executionContext.metadata?.agentContext?.lastLlmModel || 'unknown';
    const persistWork = async () => {
      if (sessionId && ctx.response.assistantResponse) {
        const existing = await ragDatabase.getConversation(sessionId).catch(() => null);
        if (!existing) {
          await ragMemory.createConversation(sessionId).catch(() => {});
        }
        await ragMemory.saveUserMessage(sessionId, queryText).catch(() => {});
        await ragMemory.saveAssistantMessage(
          sessionId,
          ctx.response.assistantResponse,
          ctx.retrieval.citations,
          llmModel,
          trace.exportTrace().stages['Total']?.durationMs || 0
        ).catch(() => {});
        const { ragSummary } = await import('./memory');
        ragSummary.triggerAsyncSummarization(sessionId).catch((err) => telemetryLogger.error('SUMMARY', 'triggerAsyncSummarization failed', err));
      }

      ragCache.set(
        ctx.request.optimizedQuery,
        [],
        ctx.response.assistantResponse || '',
        { citations: ctx.retrieval.citations }
      ).catch(() => {});

      ragDatabase.logAnalytics({
        sessionId: sessionId || undefined,
        queryText,
        responseText: ctx.response.assistantResponse || '',
        latencyMs: trace.exportTrace().stages['Total']?.durationMs || 0,
        llmModel,
        promptTokens: ctx.executionContext.diagnostics.promptTokens,
        completionTokens: ctx.executionContext.diagnostics.completionTokens,
        totalTokens: ctx.executionContext.diagnostics.totalTokens,
        metadata: { citations: ctx.retrieval.citations, originalQuery: queryText, trace: trace.exportTrace() }
      }).catch((err) => telemetryLogger.error('PIPELINE', 'Failed to log final telemetry', err));
    };
    void persistWork();
    trace.endStage('Persistence', true);

    trace.endStage('Total', true);
    trace.attachMetadata('diagnostics', ctx.executionContext.diagnostics);
    trace.attachMetadata('versions', ctx.executionContext.versions);
    if (ctx.executionContext.metadata?.agentContext) {
      trace.attachMetadata('agentContext', ctx.executionContext.metadata.agentContext);
    }

    telemetryLogger.log('PIPELINE', 'Total request completed', {
      requestId,
      durationMs: trace.exportTrace().stages['Total']?.durationMs
    });

    if (systemConfig.ENABLE_PERFORMANCE_PROFILING) {
      const t = trace.exportTrace().stages;
      console.log('\n[RAG PROFILE]', {
        memory: t['Memory']?.durationMs,
        retrieval: t['Retrieval']?.durationMs,
        generation: t['Generation']?.durationMs,
        total: t['Total']?.durationMs
      });
    }

    return {
      answer: ctx.response.assistantResponse,
      citations: ctx.retrieval.citations,
      cacheHit: false,
      latencyMs: trace.exportTrace().stages['Total']?.durationMs,
      ttftMs: getLastTtft() ?? trace.exportTrace().stages['Total']?.durationMs,
      context: ctx
    };
  }
}

export const ragOrchestrator = new RAGOrchestrator();
