-- Migration: Project Memories with pgvector (Antigravity 2.0 Memory System)
-- Uses Supabase built-in AI (gte-small, 384 dims) — no external API key needed
-- Applied: 2026-06-20

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Memory table
CREATE TABLE IF NOT EXISTS public.project_memories (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content    TEXT NOT NULL,
  embedding  vector(384),                   -- gte-small = 384 dims
  category   TEXT CHECK (category IN ('decision','architecture','context','bug','feature','rule','task')),
  metadata   JSONB DEFAULT '{}',
  project    TEXT DEFAULT 'atoenglish',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast approximate nearest-neighbor search
CREATE INDEX IF NOT EXISTS project_memories_embedding_idx
  ON public.project_memories USING hnsw (embedding vector_cosine_ops);

-- Index for project/category filtering
CREATE INDEX IF NOT EXISTS project_memories_project_idx
  ON public.project_memories (project, category);

-- Semantic search function (cosine similarity)
CREATE OR REPLACE FUNCTION public.match_memories(
  query_embedding vector(384),
  match_threshold FLOAT DEFAULT 0.70,
  match_count     INT   DEFAULT 8,
  filter_project  TEXT  DEFAULT NULL,
  filter_category TEXT  DEFAULT NULL
)
RETURNS TABLE (
  id         BIGINT,
  content    TEXT,
  category   TEXT,
  metadata   JSONB,
  project    TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    pm.id, pm.content, pm.category, pm.metadata, pm.project, pm.created_at,
    1 - (pm.embedding <=> query_embedding) AS similarity
  FROM public.project_memories pm
  WHERE
    1 - (pm.embedding <=> query_embedding) > match_threshold
    AND (filter_project  IS NULL OR pm.project  = filter_project)
    AND (filter_category IS NULL OR pm.category = filter_category)
  ORDER BY pm.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RLS: service_role can read/write (for Edge Functions)
ALTER TABLE public.project_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mem_open_policy ON public.project_memories;
CREATE POLICY mem_open_policy ON public.project_memories
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
