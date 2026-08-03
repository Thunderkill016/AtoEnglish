-- Real Talk RLS performance hardening
--
-- Keep the authorization semantics from the private-draft gate while allowing
-- PostgreSQL to evaluate auth claims once per statement rather than once per
-- candidate row. Add the covering index identified by Supabase Advisor.

CREATE INDEX IF NOT EXISTS real_talk_lessons_reviewed_by_idx
  ON public.real_talk_lessons(reviewed_by);

DROP POLICY IF EXISTS "real_talk_videos_select" ON public.real_talk_videos;
DROP POLICY IF EXISTS "real_talk_lessons_select" ON public.real_talk_lessons;
DROP POLICY IF EXISTS "real_talk_videos_insert" ON public.real_talk_videos;
DROP POLICY IF EXISTS "real_talk_videos_update_owner" ON public.real_talk_videos;
DROP POLICY IF EXISTS "real_talk_videos_delete_owner" ON public.real_talk_videos;
DROP POLICY IF EXISTS "real_talk_lessons_insert" ON public.real_talk_lessons;
DROP POLICY IF EXISTS "real_talk_lessons_update_owner" ON public.real_talk_lessons;
DROP POLICY IF EXISTS "real_talk_lessons_delete_owner" ON public.real_talk_lessons;

CREATE POLICY "real_talk_videos_select" ON public.real_talk_videos
  FOR SELECT
  USING (
    (SELECT auth.role()) = 'service_role'
    OR is_public = true
    OR (
      (SELECT auth.role()) = 'authenticated'
      AND created_by = (SELECT auth.uid())
    )
  );

CREATE POLICY "real_talk_lessons_select" ON public.real_talk_lessons
  FOR SELECT
  USING (
    (SELECT auth.role()) = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND (
          video.is_public = true
          OR (
            (SELECT auth.role()) = 'authenticated'
            AND video.created_by = (SELECT auth.uid())
          )
        )
    )
  );

CREATE POLICY "real_talk_videos_insert" ON public.real_talk_videos
  FOR INSERT
  WITH CHECK (
    (SELECT auth.role()) = 'service_role'
    OR (
      (SELECT auth.role()) = 'authenticated'
      AND created_by = (SELECT auth.uid())
      AND is_public = false
    )
  );

CREATE POLICY "real_talk_videos_update_owner" ON public.real_talk_videos
  FOR UPDATE
  USING (
    (SELECT auth.role()) = 'service_role'
    OR created_by = (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT auth.role()) = 'service_role'
    OR (created_by = (SELECT auth.uid()) AND is_public = false)
  );

CREATE POLICY "real_talk_videos_delete_owner" ON public.real_talk_videos
  FOR DELETE
  USING (
    (SELECT auth.role()) = 'service_role'
    OR (created_by = (SELECT auth.uid()) AND is_public = false)
  );

CREATE POLICY "real_talk_lessons_insert" ON public.real_talk_lessons
  FOR INSERT
  WITH CHECK (
    (SELECT auth.role()) = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND reviewed_at IS NULL
      AND reviewed_by IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = (SELECT auth.uid())
          AND video.is_public = false
      )
    )
  );

CREATE POLICY "real_talk_lessons_update_owner" ON public.real_talk_lessons
  FOR UPDATE
  USING (
    (SELECT auth.role()) = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND video.created_by = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    (SELECT auth.role()) = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND reviewed_at IS NULL
      AND reviewed_by IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = (SELECT auth.uid())
          AND video.is_public = false
      )
    )
  );

CREATE POLICY "real_talk_lessons_delete_owner" ON public.real_talk_lessons
  FOR DELETE
  USING (
    (SELECT auth.role()) = 'service_role'
    OR (
      generation_status = 'ai_draft'
      AND EXISTS (
        SELECT 1
        FROM public.real_talk_videos video
        WHERE video.id = real_talk_lessons.video_id
          AND video.created_by = (SELECT auth.uid())
          AND video.is_public = false
      )
    )
  );
