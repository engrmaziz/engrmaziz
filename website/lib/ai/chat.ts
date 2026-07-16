/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { providerFactory } from '../providers';
import { AIChatMessage, AIChatResponse } from './provider';

class AIChatService {
  private _client: any = null;

  private get client() {
    if (!this._client) {
      this._client = providerFactory.getChatProvider();
    }
    return this._client;
  }

  async chatSimple(prompt: string, context?: Record<string, unknown>): Promise<any> {
    return this.client.generate({ prompt, context });
  }

  async chatComplex(messages: AIChatMessage[], context?: Record<string, unknown>): Promise<any> {
    return this.client.generate({ messages, context });
  }
}

export const aiChat = new AIChatService();
