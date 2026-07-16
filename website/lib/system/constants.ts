export const SystemConstants = {
  // Rag/Embedding constants
  DEFAULT_CHUNK_SIZE: 800,
  DEFAULT_CHUNK_OVERLAP: 120,
  DEFAULT_MAX_CONTEXT_TOKENS: 6000,
  
  // Feature defaults
  DEFAULT_RERANKING_ENABLED: false,

  // Default models
  DEFAULT_JINA_EMBEDDING_MODEL: 'jina-embeddings-v4',
  DEFAULT_EMBEDDING_MODEL: 'jina-embeddings-v4',
  DEFAULT_REASONING_MODEL: 'openai/gpt-oss-120b',
  DEFAULT_FAST_MODEL: 'openai/gpt-oss-20b',

  // Providers
  DEFAULT_CHAT_PROVIDER: 'groq',
  DEFAULT_EMBEDDING_PROVIDER: 'jina_embedding',
  DEFAULT_RERANKER_PROVIDER: 'jina_reranker'
} as const;
