/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export interface ChatRequest {
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  context?: any;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'default';
  includeReasoning?: boolean;
  allowModelFallback?: boolean;
}

export interface ChatResponse {
  model: string;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatProvider {
  readonly name: string;
  generate(request: ChatRequest): Promise<ChatResponse>;
}

export interface EmbeddingProvider {
  readonly name: string;
  embed(text: string, task?: string): Promise<number[]>;
}

export interface Document {
  text: string;
  metadata?: any;
  [key: string]: any;
}

export interface RerankerProvider {
  readonly name: string;
  rerank(query: string, documents: Document[]): Promise<Document[]>;
}
