-- Migration: Enterprise RAG V2 Enhancements
-- Adds support for embedding versioning, partial chunk invalidation, and telemetry.

-- 1. Enhance document_chunks table to support incremental invalidation
ALTER TABLE public.document_chunks ADD COLUMN IF NOT EXISTS chunk_hash text;
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_hash ON public.document_chunks (chunk_hash);

-- 2. Enhance embeddings table to support model migrations and detailed versioning
ALTER TABLE public.embeddings ADD COLUMN IF NOT EXISTS embedding_version text;
ALTER TABLE public.embeddings ADD COLUMN IF NOT EXISTS chunk_hash text;
ALTER TABLE public.embeddings ADD COLUMN IF NOT EXISTS document_hash text;
ALTER TABLE public.embeddings ADD COLUMN IF NOT EXISTS knowledge_version text;
ALTER TABLE public.embeddings ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Enhance rag_logs for better observability
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS retrieval_time_ms integer;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS rerank_time_ms integer;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS llm_time_ms integer;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS cache_hit boolean DEFAULT false;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS retrieved_chunks_count integer;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS reranked_chunks_count integer;
ALTER TABLE public.rag_logs ADD COLUMN IF NOT EXISTS confidence_score float;

-- 4. Set up an updated_at trigger for embeddings
CREATE OR REPLACE FUNCTION update_embeddings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_embeddings_updated_at ON public.embeddings;
CREATE TRIGGER trg_embeddings_updated_at
    BEFORE UPDATE ON public.embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_embeddings_updated_at();

-- Note: VACUUM and ANALYZE operations can be run periodically outside of migrations.
