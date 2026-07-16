// @ts-nocheck
import { AgentContext } from '../agents/types';
import { RequestContext } from '../rag/types';
import { RequestTrace } from '../telemetry/request-trace';
import { WorkflowContext } from './types';

export function createWorkflowContext(
  request: RequestContext,
  agentCtx: AgentContext,
  trace: RequestTrace
): WorkflowContext {
  // Returns an immutable wrapper enforcing no local state additions.
  return Object.freeze({
    request,
    agentCtx,
    trace
  });
}
