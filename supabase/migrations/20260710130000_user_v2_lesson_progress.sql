-- =============================================================================
-- user_v2_lesson_progress — v2 LessonSpec complete state (multi-device)
-- TASK-279: RLS own-row; lesson_id = l-a0-01 … l-b1-*; guests stay on localStorage
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_v2_lesson_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id     text NOT NULL,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  quiz_correct  integer NOT NULL DEFAULT 0 CHECK (quiz_correct >= 0),
  quiz_total    integer NOT NULL DEFAULT 0 CHECK (quiz_total >= 0),
  task_done     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_v2_lesson_progress_user_lesson_key UNIQUE (user_id, lesson_id),
  CONSTRAINT user_v2_lesson_progress_lesson_id_check
    CHECK (lesson_id ~ '^l-(a0|a1|a2|b1)-[0-9]{2}$')
);

CREATE INDEX IF NOT EXISTS user_v2_lesson_progress_user_id_idx
  ON public.user_v2_lesson_progress (user_id);

CREATE INDEX IF NOT EXISTS user_v2_lesson_progress_user_completed_idx
  ON public.user_v2_lesson_progress (user_id, completed_at DESC);

ALTER TABLE public.user_v2_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_v2_lesson_progress_select_own" ON public.user_v2_lesson_progress;
CREATE POLICY "user_v2_lesson_progress_select_own"
  ON public.user_v2_lesson_progress FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_v2_lesson_progress_insert_own" ON public.user_v2_lesson_progress;
CREATE POLICY "user_v2_lesson_progress_insert_own"
  ON public.user_v2_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_v2_lesson_progress_update_own" ON public.user_v2_lesson_progress;
CREATE POLICY "user_v2_lesson_progress_update_own"
  ON public.user_v2_lesson_progress FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- No delete policy: progress is append/upsert only (users cannot wipe history via client)

COMMENT ON TABLE public.user_v2_lesson_progress IS
  'v2 LessonSpec completions (l-*). Complements user_lesson_progress (v1 units). Guest progress stays in localStorage until auth sync.';
