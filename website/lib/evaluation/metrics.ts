/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RequestTraceData } from '../telemetry';

export function extractRetrievalCount(trace: RequestTraceData): number {
  const diagnostics = trace.metadata['diagnostics'] || {};
  const dense = diagnostics.denseCandidates || 0;
  return dense;
}

export function extractLlmCalls(trace: RequestTraceData): number {
  const agentContext = trace.metadata['agentContext'] || {};
  return agentContext.llmPassesExecuted || 0;
}

export function extractToolCalls(trace: RequestTraceData): number {
  const agentContext = trace.metadata['agentContext'] || {};
  return agentContext.toolCallsExecuted || 0;
}

export function extractToolNames(trace: RequestTraceData): string[] {
  // Try to find the tool outputs in trace
  const toolOutputs = trace.metadata['toolOutputs'] || [];
  if (Array.isArray(toolOutputs)) {
    return toolOutputs.map((t: any) => t.toolName);
  }
  return [];
}

