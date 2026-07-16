/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RequestContext } from '../rag/orchestrator';
import { RequestTrace } from '../telemetry';

export interface AgentContext {
  requestContext: RequestContext;
  conversationHistory: any[];
  conversationSummary?: string;
  retrievalResults: {
    contextText?: string;
    citations: any[];
  };
  toolResults: any[];
  trace: RequestTrace;
}
