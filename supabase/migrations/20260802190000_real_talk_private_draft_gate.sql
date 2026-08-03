-- Real Talk private-draft hardening
-- Generated lessons remain private until a separate human-review flow approves
-- both the source rights and the lesson content.

ALTER TABLE public.real_talk_videos
  ALTER COLUMN is_public SET DEFAULT false;

ALTER TABLE public.real_talk_lessons
  ADD COLUMN IF NOT EXISTS environment JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS communication_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS transfer_task JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS generation_status TEXT NOT NULL DEFAULT 'ai_draft',
  ADD COLUMN IF NOT EXISTS generation_warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.real_talk_lessons
  DROP CONSTRAINT IF EXISTS real_talk_lessons_generation_status_check;

ALTER TABLE public.real_talk_lessons
  ADD CONSTRAINT real_talk_lessons_generation_status_check
  CHECK (generation_status IN ('ai_draft', 'human_reviewed', 'approved'));

UPDATE public.real_talk_videos
SET is_public = false
WHERE created_by IS NOT NULL;

UPDATE public.real_talk_lessons lesson
SET generation_status = 'ai_draft',
    reviewed_at = NULL,
    reviewed_by = NULL
WHERE EXISTS (
  SELECT 1
  FROM public.real_talk_videos video
  WHERE video.id = lesson.video_id
    AND video.created_by IS NOT NULL
);

ALTER TABLE public.real_talk_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_talk_lessons ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  existing_policy RECORD;
BEGIN
  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_talk_videos'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.real_talk_videos',
      existing_policy.policyname
    );
  END LOOP;

  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_talk_lessons'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.real_talk_lessons',
      existing_policy.policyname
    );
  END LOOP;
END
$$;

CREATE POLICY "real_talk_videos_select" ON public.real_talk_videos
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR is_public = true
    OR (
      auth.role() = 'authenticated'
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "real_talk_lessons_select" ON public.real_talk_lessons
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND (
          video.is_public = true
          OR (
            auth.role() = 'authenticated'
            AND video.created_by = auth.uid()
          )
        )
    )
  );

CREATE POLICY "real_talk_videos_insert" ON public.real_talk_videos
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR (
      auth.role() = 'authenticated'
      AND created_by = auth.uid()
      AND is_public = false
    )
  );

CREATE POLICY "real_talk_videos_update_owner" ON public.real_talk_videos
  FOR UPDATE
  USING (auth.role() = 'service_role' OR created_by = auth.uid())
  WITH CHECK (
    auth.role() = 'service_role'
    OR (created_by = auth.uid() AND is_public = false)
  );

CREATE POLICY "real_talk_videos_delete_owner" ON public.real_talk_videos
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR (created_by = auth.uid() AND is_public = false)
  );

CREATE POLICY "real_talk_lessons_insert" ON public.real_talk_lessons
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND reviewed_at IS NULL
      AND reviewed_by IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = auth.uid()
          AND video.is_public = false
      )
    )
  );

CREATE POLICY "real_talk_lessons_update_owner" ON public.real_talk_lessons
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND video.created_by = auth.uid()
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND reviewed_at IS NULL
      AND reviewed_by IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = auth.uid()
          AND video.is_public = false
      )
    )
  );

CREATE POLICY "real_talk_lessons_delete_owner" ON public.real_talk_lessons
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = auth.uid()
          AND video.is_public = false
      )
    )
  );
