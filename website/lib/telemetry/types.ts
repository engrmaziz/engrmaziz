/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export type LoggerNamespace = 'RAG' | 'MEMORY' | 'SUMMARY' | 'TOOLS' | 'AGENT' | 'LLM' | 'PIPELINE' | 'SYSTEM' | 'WORKFLOW';

export interface StageTelemetry {
  stageName: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface RequestTraceData {
  requestId: string;
  metadata: Record<string, any>;
  stages: Record<string, StageTelemetry>;
}
