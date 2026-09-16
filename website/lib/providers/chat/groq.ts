/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatProvider, ChatRequest, ChatResponse } from '../types';
import { ProviderExecutionError, ProviderConfigurationError } from '../errors';
import { systemConfig } from '../../system/config';

const FALLBACK_MODEL = systemConfig.RAG_CHAT_FALLBACK_MODEL || 'openai/gpt-oss-20b';

export class GroqChatProvider implements ChatProvider {
  readonly name = 'GroqChatProvider';
  private apiKey: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  private resolvedModel: string | null = null;

  constructor() {
    this.apiKey = systemConfig.GROQ_API_KEY || '';
  }

  async generate(request: ChatRequest, retries = 2, delayMs = 400): Promise<ChatResponse> {
    if (!this.apiKey || this.apiKey === 'dummy') {
      throw new ProviderConfigurationError('GROQ_API_KEY environment variable is not defined.');
    }

    const preferred = request.model
      || this.resolvedModel
      || systemConfig.RAG_CHAT_MODEL
      || systemConfig.DEFAULT_FAST_MODEL
      || FALLBACK_MODEL;

    const messages = request.messages || [{ role: 'user', content: request.prompt || '' }];
    const timeoutMs = request.timeoutMs ?? 2200;

    try {
      return await this.complete(preferred, messages, request, timeoutMs);
    } catch (err: any) {
      const message = String(err?.message || '');
      if (/401|403|invalid api key/i.test(message)) {
        throw err instanceof ProviderExecutionError ? err : new ProviderExecutionError(message);
      }

      const modelMissing = /model|deprecat|not found|404|400/i.test(message) && preferred !== FALLBACK_MODEL;

      if (modelMissing && request.allowModelFallback !== false) {
        this.resolvedModel = FALLBACK_MODEL;
        return this.complete(FALLBACK_MODEL, messages, request, timeoutMs, true);
      }

      if (/429/.test(message) && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return this.generate(request, retries - 1, delayMs * 2);
      }

      if (err instanceof ProviderExecutionError || err instanceof ProviderConfigurationError) throw err;
      throw new ProviderExecutionError(`Groq API completions call failed: ${err.message}`);
    }
  }

  private async complete(
    model: string,
    messages: Array<{ role: string; content: string }>,
    request: ChatRequest,
    timeoutMs: number,
    fallbackPass = false
  ): Promise<ChatResponse> {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: request.temperature ?? 0.15,
      max_tokens: request.maxTokens ?? 360
    };

    const isQwen = model.includes('qwen');
    const isGptOss = model.includes('gpt-oss');

    if (isQwen) {
      body.reasoning_effort = request.reasoningEffort ?? 'none';
    } else if (isGptOss) {
      body.reasoning_effort = request.reasoningEffort ?? 'low';
      body.include_reasoning = request.includeReasoning ?? false;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (!fallbackPass && (response.status === 400 || response.status === 404) && isQwen) {
          throw new ProviderExecutionError(`Groq API error (Status ${response.status}): ${errorText}`);
        }
        if (!fallbackPass && isGptOss && response.status === 400 && /reasoning/i.test(errorText)) {
          delete body.reasoning_effort;
          delete body.include_reasoning;
          const retry = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(body),
            signal: controller.signal
          });
          if (retry.ok) {
            return this.parse(retry, model);
          }
        }
        throw new ProviderExecutionError(`Groq API error (Status ${response.status}): ${errorText}`);
      }

      const parsed = await this.parse(response, model);
      this.resolvedModel = model;
      return parsed;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new ProviderExecutionError(`Groq API timed out after ${timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  private async parse(response: Response, model: string): Promise<ChatResponse> {
    const data = await response.json();
    if (!data || !data.choices || !data.choices[0]) {
      throw new ProviderExecutionError('Invalid response structure returned by Groq API.');
    }

    const message = data.choices[0].message || {};
    const content = (message.content || '').trim() || String(message.reasoning || '').trim();
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
  }
}
