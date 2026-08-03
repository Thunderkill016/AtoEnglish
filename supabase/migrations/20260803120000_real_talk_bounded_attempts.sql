-- Bounded learner attempt state for owner-private Real Talk lessons.
-- No raw audio, speech transcript, or free-text learner response is stored.

CREATE TABLE IF NOT EXISTS public.real_talk_attempts (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.real_talk_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'started'
    CHECK (status IN ('started', 'in_progress', 'completed')),
  checkpoint TEXT NOT NULL DEFAULT 'environment'
    CHECK (
      checkpoint IN (
        'environment',
        'first_listen',
        'support',
        'retrieval',
        'speaking',
        'transfer',
        'completed'
      )
    ),
  first_listen_completed BOOLEAN NOT NULL DEFAULT false,
  comprehension_correct INTEGER NOT NULL DEFAULT 0
    CHECK (comprehension_correct >= 0),
  comprehension_total INTEGER NOT NULL DEFAULT 0
    CHECK (
      comprehension_total >= 0
      AND comprehension_correct <= comprehension_total
    ),
  max_support_level INTEGER NOT NULL DEFAULT 0
    CHECK (max_support_level BETWEEN 0 AND 3),
  retrieval_attempted BOOLEAN NOT NULL DEFAULT false,
  speak_confirmed BOOLEAN NOT NULL DEFAULT false,
  transfer_attempted BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT real_talk_attempts_user_lesson_key UNIQUE (user_id, lesson_id),
  CONSTRAINT real_talk_attempts_completion_evidence_check CHECK (
    status <> 'completed'
    OR (
      first_listen_completed
      AND retrieval_attempted
      AND speak_confirmed
      AND transfer_attempted
      AND checkpoint = 'completed'
      AND completed_at IS NOT NULL
    )
  )
);

CREATE INDEX IF NOT EXISTS real_talk_attempts_user_updated_idx
  ON public.real_talk_attempts(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS real_talk_attempts_lesson_idx
  ON public.real_talk_attempts(lesson_id);

ALTER TABLE public.real_talk_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "real_talk_attempts_owner_select"
  ON public.real_talk_attempts;
CREATE POLICY "real_talk_attempts_owner_select"
  ON public.real_talk_attempts
  FOR SELECT
  USING (auth.role() = 'service_role' OR user_id = auth.uid());

DROP POLICY IF EXISTS "real_talk_attempts_owner_insert"
  ON public.real_talk_attempts;
CREATE POLICY "real_talk_attempts_owner_insert"
  ON public.real_talk_attempts
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR user_id = auth.uid());

DROP POLICY IF EXISTS "real_talk_attempts_owner_update"
  ON public.real_talk_attempts;
CREATE POLICY "real_talk_attempts_owner_update"
  ON public.real_talk_attempts
  FOR UPDATE
  USING (auth.role() = 'service_role' OR user_id = auth.uid())
  WITH CHECK (auth.role() = 'service_role' OR user_id = auth.uid());

DROP POLICY IF EXISTS "real_talk_attempts_owner_delete"
  ON public.real_talk_attempts;
CREATE POLICY "real_talk_attempts_owner_delete"
  ON public.real_talk_attempts
  FOR DELETE
  USING (auth.role() = 'service_role' OR user_id = auth.uid());

GRANT SELECT ON public.real_talk_attempts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.real_talk_attempts TO authenticated;
GRANT ALL ON public.real_talk_attempts TO service_role;

CREATE OR REPLACE FUNCTION public.save_real_talk_attempt(
  p_lesson_slug TEXT,
  p_evidence JSONB
)
RETURNS TABLE(
  attempt_id UUID,
  attempt_status TEXT,
  attempt_checkpoint TEXT,
  attempt_completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := (SELECT auth.uid());
  v_lesson_id UUID;
  v_first_listen BOOLEAN := COALESCE((p_evidence ->> 'firstListenCompleted')::BOOLEAN, FALSE);
  v_retrieval BOOLEAN := COALESCE((p_evidence ->> 'retrievalAttempted')::BOOLEAN, FALSE);
  v_speaking BOOLEAN := COALESCE((p_evidence ->> 'speakConfirmed')::BOOLEAN, FALSE);
  v_transfer BOOLEAN := COALESCE((p_evidence ->> 'transferAttempted')::BOOLEAN, FALSE);
  v_correct INTEGER := GREATEST(COALESCE((p_evidence ->> 'comprehensionCorrect')::INTEGER, 0), 0);
  v_total INTEGER := GREATEST(COALESCE((p_evidence ->> 'comprehensionTotal')::INTEGER, 0), 0);
  v_support INTEGER := LEAST(GREATEST(COALESCE((p_evidence ->> 'maxSupportLevel')::INTEGER, 0), 0), 3);
  v_completed BOOLEAN;
  v_checkpoint TEXT;
  v_status TEXT;
  v_completed_at TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication required for attempt persistence'
      USING ERRCODE = '42501';
  END IF;

  IF p_lesson_slug IS NULL OR BTRIM(p_lesson_slug) = '' THEN
    RAISE EXCEPTION 'lesson slug is required'
      USING ERRCODE = '22023';
  END IF;

  SELECT lesson.id
  INTO v_lesson_id
  FROM public.real_talk_lessons lesson
  JOIN public.real_talk_videos video ON video.id = lesson.video_id
  WHERE video.slug = BTRIM(p_lesson_slug)
    AND (
      video.is_public = TRUE
      OR video.created_by = v_user_id
    )
  LIMIT 1;

  IF v_lesson_id IS NULL THEN
    RAISE EXCEPTION 'lesson not found or not accessible'
      USING ERRCODE = '42501';
  END IF;

  v_total := GREATEST(v_total, v_correct);
  v_completed := v_first_listen AND v_retrieval AND v_speaking AND v_transfer;
  v_status := CASE
    WHEN v_completed THEN 'completed'
    WHEN v_first_listen OR v_retrieval OR v_speaking OR v_transfer OR v_support > 0
      THEN 'in_progress'
    ELSE 'started'
  END;
  v_checkpoint := CASE
    WHEN v_completed THEN 'completed'
    WHEN v_transfer THEN 'transfer'
    WHEN v_speaking THEN 'speaking'
    WHEN v_retrieval THEN 'retrieval'
    WHEN v_support > 0 THEN 'support'
    WHEN v_first_listen THEN 'first_listen'
    ELSE 'environment'
  END;
  v_completed_at := CASE WHEN v_completed THEN now() ELSE NULL END;

  RETURN QUERY
  INSERT INTO public.real_talk_attempts (
    user_id,
    lesson_id,
    status,
    checkpoint,
    first_listen_completed,
    comprehension_correct,
    comprehension_total,
    max_support_level,
    retrieval_attempted,
    speak_confirmed,
    transfer_attempted,
    updated_at,
    completed_at
  )
  VALUES (
    v_user_id,
    v_lesson_id,
    v_status,
    v_checkpoint,
    v_first_listen,
    v_correct,
    v_total,
    v_support,
    v_retrieval,
    v_speaking,
    v_transfer,
    now(),
    v_completed_at
  )
  ON CONFLICT ON CONSTRAINT real_talk_attempts_user_lesson_key DO UPDATE
  SET
    status = EXCLUDED.status,
    checkpoint = EXCLUDED.checkpoint,
    first_listen_completed = EXCLUDED.first_listen_completed,
    comprehension_correct = EXCLUDED.comprehension_correct,
    comprehension_total = EXCLUDED.comprehension_total,
    max_support_level = GREATEST(
      public.real_talk_attempts.max_support_level,
      EXCLUDED.max_support_level
    ),
    retrieval_attempted = EXCLUDED.retrieval_attempted,
    speak_confirmed = EXCLUDED.speak_confirmed,
    transfer_attempted = EXCLUDED.transfer_attempted,
    updated_at = now(),
    completed_at = EXCLUDED.completed_at
  RETURNING
    public.real_talk_attempts.id,
    public.real_talk_attempts.status,
    public.real_talk_attempts.checkpoint,
    public.real_talk_attempts.completed_at;
END;
$$;

REVOKE ALL ON FUNCTION public.save_real_talk_attempt(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_real_talk_attempt(TEXT, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.save_real_talk_attempt(TEXT, JSONB)
  TO authenticated, service_role;
