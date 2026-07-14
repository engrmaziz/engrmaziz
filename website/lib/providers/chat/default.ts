import { ChatProvider, ChatRequest, ChatResponse } from '../types';

export class DefaultChatProvider implements ChatProvider {
  readonly name = 'DefaultChatProvider';

  async generate(request: ChatRequest): Promise<ChatResponse> {
    if (request.messages) {
      return {
        model: 'default-reasoning-model',
        content: "Simulated complex deterministic response from AI Abstraction Layer.",
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
      };
    }
    
    return {
      model: 'default-fast-model',
      content: "Simulated simple response from AI Abstraction Layer.",
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    };
  }
}
