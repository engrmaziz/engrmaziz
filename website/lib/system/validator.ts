import { z } from 'zod';
import { SystemConstants } from './constants';

export const systemConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default('dummy'),
  SUPABASE_DB_PASSWORD: z.string().default('Ptcl@2728229'), // Default local fallback

  // APIs
  GROQ_API_KEY: z.string().optional().default('dummy'),
  JINA_API_KEY: z.string().optional().default('dummy'),
  RESEND_API_KEY: z.string().optional().default('dummy'),
  SANITY_API_READ_TOKEN: z.string().optional().default('dummy'),
  
  // App Config
  RESEND_FROM_EMAIL: z.string().email().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_API_TOKEN: z.string().optional().default('dummy-admin-token'),
  GIT_COMMIT: z.string().optional().default('unknown'),
  BUILD_TIMESTAMP: z.string().optional().default(new Date().toISOString()),

  // RAG Limits
  RAG_CHUNK_SIZE: z.coerce.number().default(SystemConstants.DEFAULT_CHUNK_SIZE),
  RAG_CHUNK_OVERLAP: z.coerce.number().default(SystemConstants.DEFAULT_CHUNK_OVERLAP),
  RAG_MAX_CONTEXT_TOKENS: z.coerce.number().default(SystemConstants.DEFAULT_MAX_CONTEXT_TOKENS),

  // Features
  RERANKING_ENABLED: z.preprocess(
    (val) => (val === 'true' || val === true ? true : false),
    z.boolean().default(SystemConstants.DEFAULT_RERANKING_ENABLED)
  ),

  // Models
  JINA_EMBEDDING_MODEL: z.string().default(SystemConstants.DEFAULT_JINA_EMBEDDING_MODEL),
  EMBEDDING_MODEL: z.string().default(SystemConstants.DEFAULT_EMBEDDING_MODEL),
  DEFAULT_REASONING_MODEL: z.string().default(SystemConstants.DEFAULT_REASONING_MODEL),
  DEFAULT_FAST_MODEL: z.string().default(SystemConstants.DEFAULT_FAST_MODEL),

  // Providers
  CHAT_PROVIDER: z.string().default(SystemConstants.DEFAULT_CHAT_PROVIDER),
  EMBEDDING_PROVIDER: z.string().default(SystemConstants.DEFAULT_EMBEDDING_PROVIDER),
  RERANKER_PROVIDER: z.string().default(SystemConstants.DEFAULT_RERANKER_PROVIDER),
});

export type SystemConfigType = z.infer<typeof systemConfigSchema>;
