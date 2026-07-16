// @ts-nocheck
import { AgentContext, AgentResponse } from '../agents/types';
import { RequestContext } from '../rag/types';
import { RequestTrace } from '../telemetry/request-trace';

export type WorkflowState = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface WorkflowContext {
  readonly request: RequestContext;
  readonly agentCtx: AgentContext;
  readonly trace: RequestTrace;
}

export interface WorkflowResult {
  response: AgentResponse;
}

export interface WorkflowStep {
  name: string;
  execute(context: WorkflowContext): Promise<WorkflowResult | void>;
}

export interface Workflow {
  name: string;
  execute(context: WorkflowContext): Promise<WorkflowResult>;
}
