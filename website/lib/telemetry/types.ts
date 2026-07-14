export type LoggerNamespace = 'RAG' | 'MEMORY' | 'SUMMARY' | 'TOOLS' | 'AGENT' | 'LLM' | 'PIPELINE';

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
