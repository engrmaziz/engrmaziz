import { RequestTraceData } from './types';

export interface TraceSummary {
  totalDurationMs: number;
  retrievalDurationMs: number;
  memoryDurationMs: number;
  promptAssemblyDurationMs: number;
  agentRuntimeDurationMs: number;
  persistenceDurationMs: number;
  llmPasses: number;
  toolCalls: number;
  toolFailures: number;
  retrievalCandidates: number;
  memoryMessagesLoaded: number;
  terminationReason: string;
  requestStatus: 'success' | 'failure';
}

export function generateTraceSummary(trace: RequestTraceData): TraceSummary {
  const stages = trace.stages || {};
  const meta = trace.metadata || {};
  const diag = meta.diagnostics || {};

  // Calculate total duration using stages
  let minStart = Number.MAX_SAFE_INTEGER;
  let maxEnd = 0;
  for (const stage of Object.values(stages)) {
    if (stage.startTime < minStart) minStart = stage.startTime;
    if (stage.endTime > maxEnd) maxEnd = stage.endTime;
  }
  
  const totalDurationMs = maxEnd >= minStart && minStart !== Number.MAX_SAFE_INTEGER 
    ? maxEnd - minStart 
    : 0;

  return {
    totalDurationMs,
    retrievalDurationMs: stages['Retrieval']?.durationMs || 0,
    memoryDurationMs: stages['Memory']?.durationMs || 0,
    promptAssemblyDurationMs: stages['PromptAssembly']?.durationMs || 0,
    agentRuntimeDurationMs: stages['AgentExecution']?.durationMs || 0,
    persistenceDurationMs: stages['Persistence']?.durationMs || 0,
    llmPasses: diag.agentLlmPasses || 0,
    toolCalls: diag.agentToolCalls || 0,
    toolFailures: diag.agentToolFailures || 0,
    retrievalCandidates: diag.retrievedCandidateCount || 0,
    memoryMessagesLoaded: diag.memoryMessagesLoaded || 0,
    terminationReason: diag.agentTerminationReason || 'unknown',
    requestStatus: Object.values(stages).some(s => s.success === false) ? 'failure' : 'success'
  };
}
