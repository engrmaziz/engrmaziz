import { randomUUID } from 'crypto';
import { AgentState } from './agent-state';
import { AgentContext } from './types';
import { RequestContext } from '../rag/orchestrator';
import { createAIClient } from '../ai/client';
import { toolPlanner } from '../tools/planner';
import { toolExecutor } from '../tools/executor';
import { promptBuilder } from '../rag/prompt-builder';

export class AgentRuntime {
  private log(ctx: AgentContext, nextState: AgentState, duration: number) {
    console.log(`[AgentRuntime] executionId=${ctx.executionId} transition=${ctx.currentState}->${nextState} duration=${duration}ms tools=${ctx.toolCallsExecuted} llmPasses=${ctx.llmPassesExecuted} termReason=${ctx.terminationReason || 'none'}`);
  }

  private transition(ctx: AgentContext, nextState: AgentState) {
    const now = Date.now();
    const lastTransition = ctx.stateTransitions.length > 0 ? ctx.stateTransitions[ctx.stateTransitions.length - 1].timestamp : ctx.startedAt;
    const duration = now - lastTransition;

    ctx.stateTransitions.push({
      state: ctx.currentState,
      nextState: nextState,
      timestamp: now,
      durationMs: duration,
      toolCount: ctx.toolCallsExecuted,
      llmPass: ctx.llmPassesExecuted,
      terminationReason: ctx.terminationReason
    });

    this.log(ctx, nextState, duration);
    ctx.currentState = nextState;
  }

  async execute(requestContext: RequestContext): Promise<void> {
    const ctx: AgentContext = {
      executionId: randomUUID(),
      requestContext,
      currentState: AgentState.START,
      startedAt: Date.now(),
      
      maxToolCalls: 3,
      maxExecutionTimeMs: 30000,
      maxLlmPasses: 3, // Safely allows two LLM passes after a tool, etc.

      toolCallsExecuted: 0,
      llmPassesExecuted: 0,
      toolHistory: [],
      stateTransitions: []
    };

    // Ensure backwards compatibility with older orchestrator telemetry structures
    requestContext.executionContext.telemetry.llm = { status: 'PENDING', durationMs: 0 };
    requestContext.executionContext.telemetry.toolPlanning = { status: 'SKIPPED', durationMs: 0 };
    requestContext.executionContext.telemetry.toolExecution = { status: 'SKIPPED', durationMs: 0 };

    try {
      this.transition(ctx, AgentState.LLM);

      const aiClient = createAIClient();

      while (ctx.currentState !== AgentState.COMPLETE && ctx.currentState !== AgentState.ERROR) {
        // 1. Timeout protection loop guard
        if (Date.now() - ctx.startedAt > ctx.maxExecutionTimeMs) {
          ctx.terminationReason = 'timeout';
          this.transition(ctx, AgentState.ERROR);
          break;
        }

        switch (ctx.currentState) {
          case AgentState.LLM:
            // 2. Max LLM limit guard
            if (ctx.llmPassesExecuted >= ctx.maxLlmPasses) {
              ctx.terminationReason = 'max_llm_passes';
              this.transition(ctx, AgentState.FINAL_RESPONSE);
              break;
            }

            ctx.llmPassesExecuted++;
            const startLlm = Date.now();

            requestContext.prompt.messages = promptBuilder.buildPrompt(
              requestContext.memory.summary || null,
              requestContext.memory.history,
              requestContext.retrieval.retrievedContext || '',
              requestContext.request.query,
              ctx.toolHistory
            );

            // Execute actual LLM Generation
            const llmRes = await aiClient.generateComplexResponse(requestContext.prompt.messages);
            requestContext.response.assistantResponse = llmRes.content;
            (requestContext as any)._lastLlmModel = llmRes.model || 'unknown';
            
            requestContext.executionContext.diagnostics.promptTokens += (llmRes?.usage?.promptTokens || 0);
            requestContext.executionContext.diagnostics.completionTokens += (llmRes?.usage?.completionTokens || 0);
            requestContext.executionContext.diagnostics.totalTokens = requestContext.executionContext.diagnostics.promptTokens + requestContext.executionContext.diagnostics.completionTokens;
            
            requestContext.executionContext.telemetry.llm!.durationMs += (Date.now() - startLlm);
            requestContext.executionContext.telemetry.llm!.status = 'SUCCESS';

            // Planner detection directly owns the transition to TOOLS
            const startPlan = Date.now();
            const pendingToolCall = await toolPlanner.plan(requestContext.request.query, llmRes.content, requestContext.response.toolOutputs);
            requestContext.executionContext.telemetry.toolPlanning!.durationMs += (Date.now() - startPlan);
            
            if (pendingToolCall) {
              requestContext.executionContext.telemetry.toolPlanning!.status = 'SUCCESS';
              this.transition(ctx, AgentState.TOOLS);
            } else {
              this.transition(ctx, AgentState.FINAL_RESPONSE);
            }
            break;

          case AgentState.TOOLS:
            // 3. Max Tool limit guard
            if (ctx.toolCallsExecuted >= ctx.maxToolCalls) {
              ctx.terminationReason = 'max_tools';
              this.transition(ctx, AgentState.FINAL_RESPONSE);
              break;
            }

            // Double check safety
            const activeToolCall = await toolPlanner.plan(requestContext.request.query, requestContext.response.assistantResponse, requestContext.response.toolOutputs);
            if (!activeToolCall) {
              this.transition(ctx, AgentState.LLM);
              break;
            }

            ctx.toolCallsExecuted++;
            const startExec = Date.now();
            
            // Execute the tool (never throws, returns struct success:false)
            const toolResult = await toolExecutor.execute(activeToolCall, ctx.executionId);
            ctx.toolHistory.push(toolResult);
            requestContext.response.toolOutputs.push(toolResult);
            
            requestContext.executionContext.telemetry.toolExecution!.durationMs += (Date.now() - startExec);
            requestContext.executionContext.telemetry.toolExecution!.status = toolResult.success ? 'SUCCESS' : 'ERROR';

            // IMPORTANT: If tool fails, runtime does not crash. It transitions safely back to LLM.
            this.transition(ctx, AgentState.LLM);
            break;

          case AgentState.FINAL_RESPONSE:
            if (!ctx.terminationReason) {
              ctx.terminationReason = 'completed';
            }
            this.transition(ctx, AgentState.COMPLETE);
            break;

          default:
            ctx.terminationReason = 'error';
            this.transition(ctx, AgentState.ERROR);
            break;
        }
      }
      
      ctx.finishedAt = Date.now();
      
      // Inject Agent state telemetry back into the main RequestContext for the final log Analytics DB payload
      (requestContext.executionContext as any).metadata = requestContext.executionContext.metadata || {};
      (requestContext.executionContext as any).metadata.agentContext = {
        executionId: ctx.executionId,
        startedAt: ctx.startedAt,
        finishedAt: ctx.finishedAt,
        terminationReason: ctx.terminationReason,
        toolCallsExecuted: ctx.toolCallsExecuted,
        llmPassesExecuted: ctx.llmPassesExecuted,
        stateTransitions: ctx.stateTransitions,
        lastLlmModel: (requestContext as any)._lastLlmModel
      };

    } catch (err: any) {
      ctx.terminationReason = 'error';
      ctx.finishedAt = Date.now();
      requestContext.executionContext.errors.push(`AgentRuntime Exception: ${err.message}`);
      this.transition(ctx, AgentState.ERROR);
    }
  }
}

export const agentRuntime = new AgentRuntime();
