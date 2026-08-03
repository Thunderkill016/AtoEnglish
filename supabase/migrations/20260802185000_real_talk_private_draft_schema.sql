-- Real Talk private-draft baseline schema
--
-- This migration creates only the persistence boundary required by spec 001.
-- Publication workflow, learner attempts, delayed review, and public catalog
-- authoring belong to later specs.

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

SET search_path = public, extensions;

CREATE TABLE IF NOT EXISTS public.real_talk_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  channel_name TEXT,
  channel_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0
    CHECK (duration_seconds >= 0),
  segment_start DOUBLE PRECISION NOT NULL DEFAULT 0
    CHECK (segment_start >= 0),
  segment_end DOUBLE PRECISION NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'A1',
  topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  speaker_count INTEGER
    CHECK (speaker_count IS NULL OR speaker_count >= 0),
  speakers JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT real_talk_videos_youtube_id_check
    CHECK (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  CONSTRAINT real_talk_videos_segment_range_check
    CHECK (segment_end >= segment_start)
);

CREATE INDEX IF NOT EXISTS real_talk_videos_created_by_idx
  ON public.real_talk_videos(created_by);
CREATE INDEX IF NOT EXISTS real_talk_videos_public_created_at_idx
  ON public.real_talk_videos(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS real_talk_videos_source_level_idx
  ON public.real_talk_videos(youtube_id, level);

CREATE TABLE IF NOT EXISTS public.real_talk_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL UNIQUE
    REFERENCES public.real_talk_videos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'A1',
  estimated_minutes INTEGER NOT NULL DEFAULT 10
    CHECK (estimated_minutes > 0),
  can_do_statement TEXT,
  can_do_statement_vi TEXT,
  transcript JSONB NOT NULL DEFAULT '[]'::JSONB,
  pre_watch JSONB NOT NULL DEFAULT '{}'::JSONB,
  while_watch JSONB NOT NULL DEFAULT '{}'::JSONB,
  post_watch JSONB NOT NULL DEFAULT '{}'::JSONB,
  environment JSONB NOT NULL DEFAULT '{}'::JSONB,
  communication_events JSONB NOT NULL DEFAULT '[]'::JSONB,
  transfer_task JSONB NOT NULL DEFAULT '{}'::JSONB,
  generation_model TEXT,
  generation_status TEXT NOT NULL DEFAULT 'ai_draft',
  generation_warnings JSONB NOT NULL DEFAULT '[]'::JSONB,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT real_talk_lessons_generation_status_check
    CHECK (generation_status IN ('ai_draft', 'human_reviewed', 'approved'))
);

CREATE INDEX IF NOT EXISTS real_talk_lessons_status_created_at_idx
  ON public.real_talk_lessons(generation_status, created_at DESC);

GRANT SELECT ON public.real_talk_videos, public.real_talk_lessons
  TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.real_talk_videos, public.real_talk_lessons
  TO authenticated;
GRANT ALL ON public.real_talk_videos, public.real_talk_lessons
  TO service_role;
