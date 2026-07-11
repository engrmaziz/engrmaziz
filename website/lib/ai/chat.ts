/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { createAIClient } from './client';
import { AIChatMessage, AIChatResponse } from './provider';

class AIChatService {
  private client = createAIClient();

  async chatSimple(prompt: string, context?: Record<string, unknown>): Promise<AIChatResponse> {
    return this.client.generateSimpleResponse(prompt, context);
  }

  async chatComplex(messages: AIChatMessage[], context?: Record<string, unknown>): Promise<AIChatResponse> {
    return this.client.generateComplexResponse(messages, context);
  }
}

export const aiChat = new AIChatService();
