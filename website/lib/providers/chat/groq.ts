import { ChatProvider, ChatRequest, ChatResponse, ChatMessage } from '../types';
import { ProviderExecutionError, ProviderConfigurationError } from '../errors';
import { systemConfig } from '../../system/config';

export class GroqChatProvider implements ChatProvider {
  readonly name = 'GroqChatProvider';
  private apiKey: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = systemConfig.GROQ_API_KEY || '';
  }

  async generate(request: ChatRequest): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new ProviderConfigurationError('GROQ_API_KEY environment variable is not defined.');
    }

    const model = request.messages 
      ? systemConfig.DEFAULT_REASONING_MODEL
      : systemConfig.DEFAULT_FAST_MODEL;

    const messages = request.messages || [{ role: 'user', content: request.prompt }];

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
        throw new ProviderExecutionError(`Groq API error (Status ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      if (!data || !data.choices || !data.choices[0]) {
        throw new ProviderExecutionError('Invalid response structure returned by Groq API.');
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
      if (err instanceof ProviderExecutionError) throw err;
      throw new ProviderExecutionError(`Groq API completions call failed: ${err.message}`);
    }
  }
}
