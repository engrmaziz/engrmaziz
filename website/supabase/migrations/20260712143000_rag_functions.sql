-- Migration: RAG Helper Functions and Indexes

-- 1. Create matching function for vector similarity search
create or replace function public.match_chunks (
  query_embedding vector(768),
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

-- 2. Create hybrid search function combining semantic (vector) and lexical (tsvector) search
create or replace function public.hybrid_search_chunks (
  query_embedding vector(768),
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

-- 3. Create a GIN index on metadata column for fast JSONB querying
create index if not exists idx_document_chunks_metadata_gin 
  on public.document_chunks using gin (metadata);

-- 4. Enable full text search indexes
create index if not exists idx_document_chunks_fts 
  on public.document_chunks using gin (to_tsvector('english', chunk_text));

-- 5. Set RLS Policies to allow public read access via security definer RPC functions,
-- while retaining strict write limits. Enable public reads of public elements.
create policy "Allow public read access to documents" on public.documents
  for select using (true);

create policy "Allow public read access to document_chunks" on public.document_chunks
  for select using (true);

create policy "Allow public read access to embeddings" on public.embeddings
  for select using (true);
