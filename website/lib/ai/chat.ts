/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { providerFactory } from '../providers';
import { AIChatMessage, AIChatResponse } from './provider';

class AIChatService {
  private client = providerFactory.getChatProvider();

  async chatSimple(prompt: string, context?: Record<string, unknown>): Promise<any> {
    return this.client.generate({ prompt, context });
  }

  async chatComplex(messages: AIChatMessage[], context?: Record<string, unknown>): Promise<any> {
    return this.client.generate({ messages, context });
  }
}

export const aiChat = new AIChatService();
