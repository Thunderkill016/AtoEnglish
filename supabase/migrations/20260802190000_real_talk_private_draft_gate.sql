-- Real Talk private-draft hardening
-- Generated lessons must remain private until a separate human-review flow
-- explicitly approves publication.

ALTER TABLE public.real_talk_videos
  ALTER COLUMN is_public SET DEFAULT false;

-- Existing user-generated rows were created by the AI generator. The previous
-- implementation marked them public automatically, so return them to draft.
UPDATE public.real_talk_videos
SET is_public = false
WHERE created_by IS NOT NULL;

DROP POLICY IF EXISTS "real_talk_videos_insert" ON public.real_talk_videos;
CREATE POLICY "real_talk_videos_insert" ON public.real_talk_videos
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR (auth.role() = 'authenticated' AND created_by = auth.uid() AND is_public = false)
  );

DROP POLICY IF EXISTS "real_talk_videos_update_owner" ON public.real_talk_videos;
CREATE POLICY "real_talk_videos_update_owner" ON public.real_talk_videos
  FOR UPDATE
  USING (auth.role() = 'service_role' OR created_by = auth.uid())
  WITH CHECK (
    auth.role() = 'service_role'
    OR (created_by = auth.uid() AND is_public = false)
  );

DROP POLICY IF EXISTS "real_talk_videos_delete_owner" ON public.real_talk_videos;
CREATE POLICY "real_talk_videos_delete_owner" ON public.real_talk_videos
  FOR DELETE
  USING (auth.role() = 'service_role' OR created_by = auth.uid());

DROP POLICY IF EXISTS "real_talk_lessons_insert" ON public.real_talk_lessons;
CREATE POLICY "real_talk_lessons_insert" ON public.real_talk_lessons
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND video.created_by = auth.uid()
        AND video.is_public = false
    )
  );

DROP POLICY IF EXISTS "real_talk_lessons_update_owner" ON public.real_talk_lessons;
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
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND video.created_by = auth.uid()
        AND video.is_public = false
    )
  );

DROP POLICY IF EXISTS "real_talk_lessons_delete_owner" ON public.real_talk_lessons;
CREATE POLICY "real_talk_lessons_delete_owner" ON public.real_talk_lessons
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.real_talk_videos video
      WHERE video.id = real_talk_lessons.video_id
        AND video.created_by = auth.uid()
    )
  );
