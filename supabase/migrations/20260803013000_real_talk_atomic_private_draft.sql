-- Atomically upsert one owner-private Real Talk video and lesson draft.
--
-- SECURITY INVOKER is intentional: the function runs with the authenticated
-- caller's privileges and remains subject to the canonical Real Talk RLS
-- policies. Any failure aborts the function statement and rolls back both writes.

CREATE OR REPLACE FUNCTION public.upsert_real_talk_private_draft(
  p_video JSONB,
  p_lesson JSONB
)
RETURNS TABLE(video_id UUID, lesson_id UUID)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_owner_id UUID := (SELECT auth.uid());
  v_video_id UUID;
  v_lesson_id UUID;
  v_slug TEXT := NULLIF(BTRIM(p_video ->> 'slug'), '');
  v_youtube_id TEXT := NULLIF(BTRIM(p_video ->> 'youtube_id'), '');
BEGIN
  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'authentication required for private draft persistence'
      USING ERRCODE = '42501';
  END IF;

  IF v_slug IS NULL OR v_youtube_id IS NULL THEN
    RAISE EXCEPTION 'private draft slug and source id are required'
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE((p_video ->> 'is_public')::BOOLEAN, FALSE) THEN
    RAISE EXCEPTION 'private draft RPC cannot publish a video'
      USING ERRCODE = '42501';
  END IF;

  IF COALESCE(p_lesson ->> 'generation_status', 'ai_draft') <> 'ai_draft' THEN
    RAISE EXCEPTION 'private draft RPC cannot elevate review state'
      USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.real_talk_videos (
    slug,
    youtube_id,
    title,
    title_vi,
    channel_name,
    channel_url,
    thumbnail_url,
    duration_seconds,
    segment_start,
    segment_end,
    level,
    topics,
    speaker_count,
    speakers,
    created_by,
    is_public,
    transcript_acquisition_mode,
    transcript_review_status,
    transcript_source_metadata,
    transcript_cue_digest
  )
  VALUES (
    v_slug,
    v_youtube_id,
    COALESCE(p_video ->> 'title', ''),
    COALESCE(p_video ->> 'title_vi', ''),
    NULLIF(p_video ->> 'channel_name', ''),
    NULLIF(p_video ->> 'channel_url', ''),
    NULLIF(p_video ->> 'thumbnail_url', ''),
    COALESCE((p_video ->> 'duration_seconds')::INTEGER, 0),
    COALESCE((p_video ->> 'segment_start')::NUMERIC, 0),
    COALESCE((p_video ->> 'segment_end')::NUMERIC, 0),
    COALESCE(p_video ->> 'level', 'A1'),
    ARRAY(
      SELECT jsonb_array_elements_text(
        COALESCE(p_video -> 'topics', '[]'::JSONB)
      )
    ),
    COALESCE((p_video ->> 'speaker_count')::INTEGER, 0),
    COALESCE(p_video -> 'speakers', '[]'::JSONB),
    v_owner_id,
    FALSE,
    COALESCE(
      p_video ->> 'transcript_acquisition_mode',
      'experimental_unofficial'
    ),
    COALESCE(p_video ->> 'transcript_review_status', 'unreviewed'),
    COALESCE(p_video -> 'transcript_source_metadata', '{}'::JSONB),
    NULLIF(p_video ->> 'transcript_cue_digest', '')
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    youtube_id = EXCLUDED.youtube_id,
    title = EXCLUDED.title,
    title_vi = EXCLUDED.title_vi,
    channel_name = EXCLUDED.channel_name,
    channel_url = EXCLUDED.channel_url,
    thumbnail_url = EXCLUDED.thumbnail_url,
    duration_seconds = EXCLUDED.duration_seconds,
    segment_start = EXCLUDED.segment_start,
    segment_end = EXCLUDED.segment_end,
    level = EXCLUDED.level,
    topics = EXCLUDED.topics,
    speaker_count = EXCLUDED.speaker_count,
    speakers = EXCLUDED.speakers,
    is_public = FALSE,
    transcript_acquisition_mode = EXCLUDED.transcript_acquisition_mode,
    transcript_review_status = EXCLUDED.transcript_review_status,
    transcript_source_metadata = EXCLUDED.transcript_source_metadata,
    transcript_cue_digest = EXCLUDED.transcript_cue_digest
  WHERE
    public.real_talk_videos.created_by = v_owner_id
    AND public.real_talk_videos.is_public = FALSE
  RETURNING public.real_talk_videos.id INTO v_video_id;

  IF v_video_id IS NULL THEN
    RAISE EXCEPTION 'private draft identity belongs to another owner or is public'
      USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.real_talk_lessons (
    video_id,
    title,
    title_vi,
    level,
    estimated_minutes,
    can_do_statement,
    can_do_statement_vi,
    transcript,
    pre_watch,
    while_watch,
    post_watch,
    environment,
    communication_events,
    transfer_task,
    generation_model,
    generation_status,
    generation_warnings,
    reviewed_at,
    reviewed_by
  )
  VALUES (
    v_video_id,
    COALESCE(p_lesson ->> 'title', ''),
    COALESCE(p_lesson ->> 'title_vi', ''),
    COALESCE(p_lesson ->> 'level', 'A1'),
    COALESCE((p_lesson ->> 'estimated_minutes')::INTEGER, 15),
    NULLIF(p_lesson ->> 'can_do_statement', ''),
    NULLIF(p_lesson ->> 'can_do_statement_vi', ''),
    COALESCE(p_lesson -> 'transcript', '[]'::JSONB),
    COALESCE(p_lesson -> 'pre_watch', '{}'::JSONB),
    COALESCE(p_lesson -> 'while_watch', '{}'::JSONB),
    COALESCE(p_lesson -> 'post_watch', '{}'::JSONB),
    COALESCE(p_lesson -> 'environment', '{}'::JSONB),
    COALESCE(p_lesson -> 'communication_events', '[]'::JSONB),
    COALESCE(p_lesson -> 'transfer_task', '{}'::JSONB),
    NULLIF(p_lesson ->> 'generation_model', ''),
    'ai_draft',
    COALESCE(p_lesson -> 'generation_warnings', '[]'::JSONB),
    NULL,
    NULL
  )
  ON CONFLICT (video_id) DO UPDATE
  SET
    title = EXCLUDED.title,
    title_vi = EXCLUDED.title_vi,
    level = EXCLUDED.level,
    estimated_minutes = EXCLUDED.estimated_minutes,
    can_do_statement = EXCLUDED.can_do_statement,
    can_do_statement_vi = EXCLUDED.can_do_statement_vi,
    transcript = EXCLUDED.transcript,
    pre_watch = EXCLUDED.pre_watch,
    while_watch = EXCLUDED.while_watch,
    post_watch = EXCLUDED.post_watch,
    environment = EXCLUDED.environment,
    communication_events = EXCLUDED.communication_events,
    transfer_task = EXCLUDED.transfer_task,
    generation_model = EXCLUDED.generation_model,
    generation_status = 'ai_draft',
    generation_warnings = EXCLUDED.generation_warnings,
    reviewed_at = NULL,
    reviewed_by = NULL
  RETURNING public.real_talk_lessons.id INTO v_lesson_id;

  IF v_lesson_id IS NULL THEN
    RAISE EXCEPTION 'lesson draft was not persisted'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY SELECT v_video_id, v_lesson_id;
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_real_talk_private_draft(JSONB, JSONB)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.upsert_real_talk_private_draft(JSONB, JSONB)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.upsert_real_talk_private_draft(JSONB, JSONB)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_real_talk_private_draft(JSONB, JSONB)
  TO service_role;
