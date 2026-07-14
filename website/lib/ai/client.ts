/* eslint-disable */
import { AIProvider, AIChatMessage, AIChatResponse } from './provider';
import { CONFIG } from '@/lib/config/constants';
import { logger } from '@/lib/utils/logger';

// Default mock/stub provider for sandbox/test environments
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

  async generateComplexResponse(messages: AIChatMessage[], context?: any): Promise<AIChatResponse> {
    logger.debug('Using DefaultAIProvider for complex response');
    return {
      model: CONFIG.ai.models.reasoning,
      content: "Simulated complex deterministic response from AI Abstraction Layer.",
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
    };
  }
}

// Production Groq AI Provider utilizing the high-speed Groq LPU inference completions endpoint
export class GroqProvider implements AIProvider {
  name = 'Groq AI Provider';
  private apiKey: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
  }

  async generateSimpleResponse(prompt: string, context?: any): Promise<AIChatResponse> {
    const model = process.env.DEFAULT_FAST_MODEL || CONFIG.ai.models.fast || 'openai/gpt-oss-20b';
    const messages: AIChatMessage[] = [{ role: 'user', content: prompt }];
    return this.callCompletions(model, messages);
  }

  async generateComplexResponse(messages: AIChatMessage[], context?: any): Promise<AIChatResponse> {
    const model = process.env.DEFAULT_REASONING_MODEL || CONFIG.ai.models.reasoning || 'openai/gpt-oss-120b';
    return this.callCompletions(model, messages);
  }

  private async callCompletions(model: string, messages: AIChatMessage[]): Promise<AIChatResponse> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not defined.');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (Status ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      if (!data || !data.choices || !data.choices[0]) {
        throw new Error('Invalid response structure returned by Groq API.');
      }

      const content = data.choices[0].message.content;
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      return {
        model,
        content,
        usage: {
          promptTokens: usage.prompt_tokens || 0,
          completionTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0
        }
      };
    } catch (err: any) {
      console.error(`Groq API completions call failed for model ${model}:`, err.message);
      throw err;
    }
  }
}

export function createAIClient(): AIProvider {
  if (process.env.GROQ_API_KEY) {
    return new GroqProvider();
  }
  return new DefaultAIProvider();
}
