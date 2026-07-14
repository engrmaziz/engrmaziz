import { RequestContext } from '../rag/orchestrator';
import { ToolResult } from '../tools/types';
import { AgentState } from './agent-state';

export interface AgentContext {
  executionId: string;
  requestContext: RequestContext;
  currentState: AgentState;
  
  startedAt: number;
  finishedAt?: number;
  terminationReason?: 'completed' | 'max_tools' | 'timeout' | 'error' | 'max_llm_passes';

  maxToolCalls: number;
  maxExecutionTimeMs: number;
  maxLlmPasses: number;

  toolCallsExecuted: number;
  llmPassesExecuted: number;
  
  toolHistory: ToolResult[];
  stateTransitions: Array<{
    state: AgentState;
    nextState: AgentState;
    timestamp: number;
    durationMs: number;
    toolCount: number;
    llmPass: number;
    terminationReason?: string;
  }>;
}
