-- ============================================================
-- Migration: unit_content (JSONB storage for lesson data)
-- Stores the full UnitData object as JSONB per unit.
-- This allows content updates without code deployments.
-- Timestamp: 20260620112800
-- ============================================================

CREATE TABLE IF NOT EXISTS public.unit_content (
  unit_id    TEXT        PRIMARY KEY,   -- 'unit-1', 'unit-2', etc.
  content    JSONB       NOT NULL,      -- Full UnitData object
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for active units lookup
CREATE INDEX IF NOT EXISTS idx_unit_content_active ON public.unit_content(is_active);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_unit_content_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS unit_content_updated_at ON public.unit_content;
CREATE TRIGGER unit_content_updated_at
  BEFORE UPDATE ON public.unit_content
  FOR EACH ROW EXECUTE FUNCTION public.update_unit_content_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.unit_content ENABLE ROW LEVEL SECURITY;

-- Public READ — any authenticated user can read lesson content
CREATE POLICY "unit_content_select_authenticated"
  ON public.unit_content
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- No INSERT/UPDATE/DELETE via client — admin only via service role
-- (Content updates go through SQL Editor or a future admin panel)

-- ── Comment ──────────────────────────────────────────────────
COMMENT ON TABLE public.unit_content IS
  'Stores lesson content as JSONB. Each row = one unit. '
  'Content is seeded from TypeScript data files and can be updated '
  'without code deployments via the Supabase SQL Editor.';
