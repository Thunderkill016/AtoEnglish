-- Owner-derived read boundary for restoring one Real Talk lesson attempt.

CREATE OR REPLACE FUNCTION public.get_real_talk_attempt(
  p_lesson_slug TEXT
)
RETURNS TABLE(
  attempt_id UUID,
  attempt_status TEXT,
  attempt_checkpoint TEXT,
  first_listen_completed BOOLEAN,
  comprehension_correct INTEGER,
  comprehension_total INTEGER,
  max_support_level INTEGER,
  retrieval_attempted BOOLEAN,
  speak_confirmed BOOLEAN,
  transfer_attempted BOOLEAN,
  attempt_completed_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    attempt.id,
    attempt.status,
    attempt.checkpoint,
    attempt.first_listen_completed,
    attempt.comprehension_correct,
    attempt.comprehension_total,
    attempt.max_support_level,
    attempt.retrieval_attempted,
    attempt.speak_confirmed,
    attempt.transfer_attempted,
    attempt.completed_at
  FROM public.real_talk_attempts attempt
  JOIN public.real_talk_lessons lesson ON lesson.id = attempt.lesson_id
  JOIN public.real_talk_videos video ON video.id = lesson.video_id
  WHERE attempt.user_id = auth.uid()
    AND video.slug = BTRIM(p_lesson_slug)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_real_talk_attempt(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_real_talk_attempt(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_real_talk_attempt(TEXT)
  TO authenticated, service_role;
