/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { AIProvider, AIChatMessage, AIChatResponse } from './provider';
import { env } from '@/lib/config/env';
import { CONFIG } from '@/lib/config/constants';
import { logger } from '@/lib/utils/logger';

// Default mock/stub provider until a real implementation is injected
export class DefaultAIProvider implements AIProvider {
  name = 'Default Mock Provider';

  async generateSimpleResponse(prompt: string, context?: any): Promise<AIChatResponse> {
    logger.debug('Using DefaultAIProvider for simple response');
    return {
      model: CONFIG.ai.models.fast,
      content: "Simulated simple response from AI Abstraction Layer.",
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    };
  }

  async generateComplexResponse(messages: any[], context?: any): Promise<AIChatResponse> {
    logger.debug('Using DefaultAIProvider for complex response');
    return {
      model: CONFIG.ai.models.reasoning,
      content: "Simulated complex deterministic response from AI Abstraction Layer.",
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
    };
  }
}

// In a real application, you could dynamically switch providers based on env
// e.g. return env.AI_PROVIDER === 'groq' ? new GroqProvider() : new DefaultAIProvider();
export function createAIClient(): AIProvider {
  return new DefaultAIProvider();
}
