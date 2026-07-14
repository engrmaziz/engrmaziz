// Matches existing internal abstractions
export interface ChatRequest {
  messages?: any[];
  prompt?: string;
  context?: any;
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
  embed(text: string): Promise<number[]>;
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
