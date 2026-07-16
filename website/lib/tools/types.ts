/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export interface ToolCall {
  tool: string;
  arguments: Record<string, unknown>;
}

export interface ToolError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface ToolResult {
  success: boolean;
  toolExecutionId?: string;
  requestId?: string;
  toolName?: string;
  startTime?: number;
  endTime?: number;
  durationMs?: number;
  output?: any;
  error?: ToolError;
  metadata?: Record<string, any>;
  toolVersion?: string;
}

export interface Tool {
  name: string;
  description: string;
  version: string;
  schema: Record<string, any>;
  riskLevel: 'safe' | 'confirm';
  execute(args: Record<string, unknown>): Promise<any>;
}
