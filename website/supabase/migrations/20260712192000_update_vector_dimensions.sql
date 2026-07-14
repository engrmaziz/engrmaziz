-- Migration: Upgrade Embeddings to 1024 Dimensions, Add Semantic Cache and Analytics Logger

-- 1. Drop existing helper functions that depend on the old vector type
drop function if exists public.match_chunks(vector, float, int, jsonb);
drop function if exists public.hybrid_search_chunks(vector, text, int, float, jsonb, float, float);

-- 2. Re-create embeddings table with vector(1024) dimensions (Jina Embeddings v4 MRL)
drop table if exists public.embeddings cascade;

create table public.embeddings (
  id uuid primary key default uuid_generate_v4(),
  embedding_model text not null,
  document_id uuid references public.documents(id) on delete cascade not null,
  chunk_id uuid references public.document_chunks(id) on delete cascade not null,
  vector vector(1024) not null,
  version text,
  created_at timestamptz default now()
);

-- Enable RLS and public select policy on embeddings
alter table public.embeddings enable row level security;

create policy "Allow public read access to embeddings" on public.embeddings
  for select using (true);

-- 3. Re-create match_chunks with vector(1024) input parameter
create or replace function public.match_chunks (
  query_embedding vector(1024),
  match_threshold float,
  match_count int,
  filter_metadata jsonb default '{}'::jsonb
)
returns table (
  chunk_id uuid,
  document_id uuid,
  chunk_text text,
  chunk_number int,
  metadata jsonb,
  similarity float
)
language plpgsql
security definer
as $$
begin
  return query
  select
    dc.id as chunk_id,
    dc.parent_document as document_id,
    dc.chunk_text,
    dc.chunk_number,
    dc.metadata,
    1 - (e.vector <=> query_embedding) as similarity
  from public.embeddings e
  join public.document_chunks dc on dc.id = e.chunk_id
  where 1 - (e.vector <=> query_embedding) > match_threshold
    and (
      filter_metadata = '{}'::jsonb
      or dc.metadata @> filter_metadata
    )
  order by e.vector <=> query_embedding asc
  limit match_count;
end;
$$;

-- 4. Re-create hybrid_search_chunks with vector(1024) input parameter
create or replace function public.hybrid_search_chunks (
  query_embedding vector(1024),
  query_text text,
  match_count int,
  match_threshold float default 0.3,
  filter_metadata jsonb default '{}'::jsonb,
  semantic_weight float default 0.7,
  lexical_weight float default 0.3
)
returns table (
  chunk_id uuid,
  document_id uuid,
  chunk_text text,
  chunk_number int,
  metadata jsonb,
  semantic_score float,
  lexical_score float,
  combined_score float
)
language plpgsql
security definer
as $$
begin
  return query
  with semantic_matches as (
    select
      dc.id as id,
      1 - (e.vector <=> query_embedding) as score
    from public.embeddings e
    join public.document_chunks dc on dc.id = e.chunk_id
    where 1 - (e.vector <=> query_embedding) > match_threshold
  ),
  lexical_matches as (
    select
      dc.id as id,
      ts_rank_cd(to_tsvector('english', dc.chunk_text), plainto_tsquery('english', query_text)) as score
    from public.document_chunks dc
    where to_tsvector('english', dc.chunk_text) @@ plainto_tsquery('english', query_text)
  )
  select
    dc.id as chunk_id,
    dc.parent_document as document_id,
    dc.chunk_text,
    dc.chunk_number,
    dc.metadata,
    coalesce(s.score, 0.0)::float as semantic_score,
    coalesce(l.score, 0.0)::float as lexical_score,
    (coalesce(s.score, 0.0) * semantic_weight + coalesce(l.score, 0.0) * lexical_weight)::float as combined_score
  from public.document_chunks dc
  left join semantic_matches s on s.id = dc.id
  left join lexical_matches l on l.id = dc.id
  where (s.id is not null or l.id is not null)
    and (
      filter_metadata = '{}'::jsonb
      or dc.metadata @> filter_metadata
    )
  order by combined_score desc
  limit match_count;
end;
$$;

-- 5. Create high-performance vector HNSW indexes for rapid cosine distance queries
create index if not exists idx_embeddings_vector_hnsw 
  on public.embeddings using hnsw (vector vector_cosine_ops);

-- 6. Create public.rag_cache for semantic query responses caching
create table if not exists public.rag_cache (
  id uuid primary key default uuid_generate_v4(),
  query_hash text unique not null,
  query_text text not null,
  query_embedding vector(1024) not null,
  response_text text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.rag_cache enable row level security;

create policy "Allow public read access to cache" on public.rag_cache
  for select using (true);

create policy "Allow insert access to cache" on public.rag_cache
  for insert with check (true);

create index if not exists idx_rag_cache_hash on public.rag_cache (query_hash);
create index if not exists idx_rag_cache_vector_hnsw 
  on public.rag_cache using hnsw (query_embedding vector_cosine_ops);

-- 7. Create public.rag_logs for recording execution telemetry analytics
create table if not exists public.rag_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id text,
  query_text text not null,
  query_embedding vector(1024),
  response_text text,
  latency_ms integer not null,
  llm_model text,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  cost numeric(10, 6) default 0.000000,
  metadata jsonb default '{}'::jsonb,
  feedback text,
  clicked_citation text,
  created_at timestamptz default now()
);

alter table public.rag_logs enable row level security;

create policy "Allow insert access to logs" on public.rag_logs
  for insert with check (true);

create policy "Allow public read access to logs" on public.rag_logs
  for select using (true);
