-- Migration: Add video_slug + learning_seconds to real_talk_progress
-- Allows progress tracking for static catalog videos that don't have a DB UUID.

-- 1. Add video_slug for progress lookup without requiring video UUID
ALTER TABLE public.real_talk_progress
  ADD COLUMN IF NOT EXISTS video_slug TEXT;

-- 2. Add learning_seconds for completion evidence
ALTER TABLE public.real_talk_progress
  ADD COLUMN IF NOT EXISTS learning_seconds INT DEFAULT 0;

-- 3. Make video_id nullable (static catalog videos may not have a DB row)
ALTER TABLE public.real_talk_progress
  ALTER COLUMN video_id DROP NOT NULL;

-- 4. Add unique constraint on (user_id, video_slug) for idempotent upsert
-- Drop old constraint first if it conflicts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'real_talk_progress_user_id_video_slug_key'
  ) THEN
    NULL; -- already exists
  ELSE
    ALTER TABLE public.real_talk_progress
      ADD CONSTRAINT real_talk_progress_user_id_video_slug_key
      UNIQUE (user_id, video_slug);
  END IF;
END $$;

-- 5. Add qa_status column to real_talk_videos (referenced in real-talk.ts persist)
ALTER TABLE public.real_talk_videos
  ADD COLUMN IF NOT EXISTS qa_status VARCHAR(20) DEFAULT 'draft';

-- 6. Index for slug-based progress lookup
CREATE INDEX IF NOT EXISTS idx_real_talk_progress_user_slug
  ON public.real_talk_progress(user_id, video_slug);
