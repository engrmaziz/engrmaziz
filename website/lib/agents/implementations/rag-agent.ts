import { BaseAgent } from '../base-agent';
import { AgentContext } from '../context';
import { AgentResponse } from '../types';
import { agentRuntime } from '../../agent/agent-runtime';

export class RAGAgent extends BaseAgent {
  readonly id = 'rag-agent';
  readonly description = 'Standard RAG production agent execution';

  protected async doExecute(context: Readonly<AgentContext>): Promise<AgentResponse> {
    // Relocate the execution into the Agent abstraction.
    // The underlying agentRuntime manages the LLM loop and state transitions.
    await agentRuntime.execute(context.requestContext);

    return {
      content: context.requestContext.response.assistantResponse || '',
      model: (context.requestContext as any)._lastLlmModel || 'unknown'
    };
  }
}
