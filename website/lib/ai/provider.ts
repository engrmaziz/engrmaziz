/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export interface AIModelConfig {
  fast: string;
  reasoning: string;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatResponse {
  model: string;
  content: string;
  usage: AIUsage;
}

export interface AIProvider {
  name: string;
  generateSimpleResponse(prompt: string, context?: any): Promise<AIChatResponse>;
  generateComplexResponse(messages: AIChatMessage[], context?: any): Promise<AIChatResponse>;
}
