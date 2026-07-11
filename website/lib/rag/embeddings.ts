import { env } from '@/lib/config/env';
import { CONFIG } from '@/lib/config/constants';

// Architecture stub for Jina Embeddings integration
export class EmbeddingsService {
  private apiKey: string;
  private dimensions = CONFIG.ai.embeddings.dimensions;

  constructor() {
    this.apiKey = env.NEXT_PUBLIC_APP_NAME || '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateEmbedding(_text: string): Promise<number[]> {
    return Array(this.dimensions).fill(0.1);
  }

  async chunkDocument(markdown: string): Promise<string[]> {
    // Semantic chunking logic here
    return [markdown];
  }
}

export const embeddings = new EmbeddingsService();
