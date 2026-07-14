import { Agent } from './types';
import { agentRegistry } from './registry';
import { RequestContext } from '../rag/orchestrator';

export class AgentRouter {
  route(ctx: RequestContext): Agent {
    return agentRegistry.get('rag-agent');
  }
}

export const agentRouter = new AgentRouter();
