import { EvaluationMetrics } from './types';
import { RequestTraceData } from '../telemetry';

export function extractMetrics(traceData: RequestTraceData): EvaluationMetrics {
  const diagnostics = traceData.metadata['diagnostics'] || {};
  const agentContext = traceData.metadata['agentContext'] || {};
  const toolOutputs = traceData.metadata['toolOutputs'] || []; // Wait, tool outputs might not be in traceData... I will need to pass the result to this.
  
  return {
    retrieval: {
      denseCandidates: diagnostics.denseCandidates || 0,
      sparseCandidates: diagnostics.sparseCandidates || 0,
      retrievalLatency: traceData.stages['Retrieval']?.durationMs || 0
    },
    memory: {
      historyLoaded: diagnostics.memoryMessagesLoaded || 0,
      summaryUsed: diagnostics.summaryUsed || false
    },
    tools: {
      toolExecuted: agentContext.stateTransitions
        ?.filter((t: any) => t.state === 'TOOLS')
        ?.map(() => 'unknownTool') || [], // To accurately get toolExecuted, we will look at the final orchestrator response.
      toolSuccess: [],
      toolLatency: []
    },
    runtime: {
      llmPasses: agentContext.llmPassesExecuted || 0,
      toolCalls: agentContext.toolCallsExecuted || 0,
      totalExecutionTime: traceData.stages['Total']?.durationMs || 0
    }
  };
}

export function populateToolMetricsFromResponse(metrics: EvaluationMetrics, toolOutputs: any[]) {
  metrics.tools.toolExecuted = toolOutputs.map(t => t.toolName);
  metrics.tools.toolSuccess = toolOutputs.map(t => t.success);
  metrics.tools.toolLatency = toolOutputs.map(t => t.executionMs || 0);
}
