/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
export const CONFIG = {
  ai: {
    models: {
      fast: 'openai/gpt-oss-20b',
      chat: 'openai/gpt-oss-20b',
      reasoning: 'openai/gpt-oss-120b'
    },
    embeddings: {
      provider: 'jina-embeddings',
      dimensions: 768
    }
  },
  email: {
    identity: 'ragx@maziz.me',
    support: 'io@maziz.me'
  },
  seo: {
    title: 'Musharraf Aziz | Software Architecture'
  },
  security: {
    rateLimits: {
      contact: { windowMs: 3600000, limit: 5 },
      chat: { windowMs: 60000, limit: 20 },
      search: { windowMs: 60000, limit: 100 },
      service: { windowMs: 3600000, limit: 3 },
      appointment: { windowMs: 86400000, limit: 3 }
    }
  }
};
