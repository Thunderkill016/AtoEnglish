-- Learning core foundation: make FSRS card state reconstructible and add durable learning evidence.
-- 2026-09-02

-- ---------------------------------------------------------------------------
-- 1. Persist the complete ts-fsrs card state that cannot be safely inferred.
-- ---------------------------------------------------------------------------
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS elapsed_days integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS scheduled_days integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lapses integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS learning_steps integer NOT NULL DEFAULT 0;

-- Backfill the best available values from legacy compatibility fields.
UPDATE public.cards
SET
  scheduled_days = CASE
    WHEN scheduled_days = 0 THEN GREATEST(COALESCE(interval, 0), 0)
    ELSE scheduled_days
  END,
  elapsed_days = CASE
    WHEN elapsed_days = 0
      AND last_review IS NOT NULL
      THEN GREATEST(
        FLOOR(EXTRACT(EPOCH FROM (now() - last_review)) / 86400)::integer,
        0
      )
    ELSE elapsed_days
  END;

-- Card state + review event must commit together. The client computes FSRS, while
-- PostgreSQL guarantees we never persist one half of the learning event.
CREATE OR REPLACE FUNCTION public.apply_fsrs_card_review(
  p_card_id uuid,
  p_state integer,
  p_difficulty double precision,
  p_stability double precision,
  p_elapsed_days integer,
  p_scheduled_days integer,
  p_lapses integer,
  p_learning_steps integer,
  p_last_review timestamptz,
  p_next_review timestamptz,
  p_repetitions integer,
  p_log_rating smallint,
  p_log_state smallint,
  p_log_due timestamptz,
  p_log_stability double precision,
  p_log_difficulty double precision,
  p_log_elapsed_days integer,
  p_log_scheduled_days integer,
  p_log_review timestamptz
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated';
  END IF;

  UPDATE public.cards
  SET
    state = p_state,
    difficulty = p_difficulty,
    stability = p_stability,
    elapsed_days = GREATEST(p_elapsed_days, 0),
    scheduled_days = GREATEST(p_scheduled_days, 0),
    lapses = GREATEST(p_lapses, 0),
    learning_steps = GREATEST(p_learning_steps, 0),
    last_review = p_last_review,
    next_review = p_next_review,
    interval = GREATEST(p_scheduled_days, 0),
    repetitions = GREATEST(p_repetitions, 0),
    due_date = p_next_review,
    updated_at = now()
  WHERE id = p_card_id AND user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found or not owned by current user';
  END IF;

  INSERT INTO public.card_review_logs (
    user_id,
    card_id,
    rating,
    state,
    due,
    stability,
    difficulty,
    elapsed_days,
    scheduled_days,
    review
  ) VALUES (
    v_user_id,
    p_card_id,
    p_log_rating,
    p_log_state,
    p_log_due,
    p_log_stability,
    p_log_difficulty,
    GREATEST(p_log_elapsed_days, 0),
    GREATEST(p_log_scheduled_days, 0),
    p_log_review
  );
END;
$$;

REVOKE ALL ON FUNCTION public.apply_fsrs_card_review(
  uuid, integer, double precision, double precision, integer, integer, integer, integer,
  timestamptz, timestamptz, integer, smallint, smallint, timestamptz, double precision,
  double precision, integer, integer, timestamptz
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_fsrs_card_review(
  uuid, integer, double precision, double precision, integer, integer, integer, integer,
  timestamptz, timestamptz, integer, smallint, smallint, timestamptz, double precision,
  double precision, integer, integer, timestamptz
) TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. Attempts: immutable facts about what a learner actually did.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_attempts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  knowledge_item_id   text,
  capability_id       text,
  session_id           uuid,
  exercise_type        text NOT NULL,
  response_modality    text NOT NULL CHECK (response_modality IN ('choice', 'text', 'speech', 'gesture', 'none')),
  prompt_id             text,
  context_id            text,
  response_text         text,
  correct               boolean,
  latency_ms            integer CHECK (latency_ms IS NULL OR latency_ms >= 0),
  hint_count            integer NOT NULL DEFAULT 0 CHECK (hint_count >= 0),
  reveal_used           boolean NOT NULL DEFAULT false,
  support_level         integer NOT NULL DEFAULT 0 CHECK (support_level >= 0),
  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_attempts_target_check CHECK (
    knowledge_item_id IS NOT NULL OR capability_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS learning_attempts_user_created_idx
  ON public.learning_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS learning_attempts_user_knowledge_idx
  ON public.learning_attempts(user_id, knowledge_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS learning_attempts_user_capability_idx
  ON public.learning_attempts(user_id, capability_id, created_at DESC);

ALTER TABLE public.learning_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learning_attempts_select_own" ON public.learning_attempts;
CREATE POLICY "learning_attempts_select_own"
  ON public.learning_attempts FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "learning_attempts_insert_own" ON public.learning_attempts;
CREATE POLICY "learning_attempts_insert_own"
  ON public.learning_attempts FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Attempts are immutable facts. Corrections are represented by later attempts/events.

-- ---------------------------------------------------------------------------
-- 3. Evidence events: what an attempt is allowed to prove.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_evidence_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_id      uuid NOT NULL REFERENCES public.learning_attempts(id) ON DELETE CASCADE,
  evidence_type   text NOT NULL CHECK (
    evidence_type IN ('recognition', 'retrieval', 'listening', 'production', 'repair', 'transfer', 'retention')
  ),
  target_id        text NOT NULL,
  success          boolean NOT NULL,
  confidence       double precision NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  support_level    integer NOT NULL DEFAULT 0 CHECK (support_level >= 0),
  context_id       text,
  evaluator        text NOT NULL DEFAULT 'deterministic',
  metadata         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS learning_evidence_user_target_idx
  ON public.learning_evidence_events(user_id, target_id, evidence_type, created_at DESC);
CREATE INDEX IF NOT EXISTS learning_evidence_attempt_idx
  ON public.learning_evidence_events(attempt_id);

ALTER TABLE public.learning_evidence_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learning_evidence_select_own" ON public.learning_evidence_events;
CREATE POLICY "learning_evidence_select_own"
  ON public.learning_evidence_events FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "learning_evidence_insert_own" ON public.learning_evidence_events;
CREATE POLICY "learning_evidence_insert_own"
  ON public.learning_evidence_events FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- 4. Learner skill state: derived snapshot, never a replacement for evidence.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learner_skill_states (
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id           text NOT NULL,
  recognition         double precision NOT NULL DEFAULT 0 CHECK (recognition >= 0 AND recognition <= 1),
  retrieval           double precision NOT NULL DEFAULT 0 CHECK (retrieval >= 0 AND retrieval <= 1),
  listening           double precision NOT NULL DEFAULT 0 CHECK (listening >= 0 AND listening <= 1),
  production          double precision NOT NULL DEFAULT 0 CHECK (production >= 0 AND production <= 1),
  repair              double precision NOT NULL DEFAULT 0 CHECK (repair >= 0 AND repair <= 1),
  transfer            double precision NOT NULL DEFAULT 0 CHECK (transfer >= 0 AND transfer <= 1),
  retention           double precision NOT NULL DEFAULT 0 CHECK (retention >= 0 AND retention <= 1),
  evidence_count      integer NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
  last_evidence_at    timestamptz,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, target_id)
);

ALTER TABLE public.learner_skill_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learner_skill_states_select_own" ON public.learner_skill_states;
CREATE POLICY "learner_skill_states_select_own"
  ON public.learner_skill_states FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "learner_skill_states_insert_own" ON public.learner_skill_states;
CREATE POLICY "learner_skill_states_insert_own"
  ON public.learner_skill_states FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "learner_skill_states_update_own" ON public.learner_skill_states;
CREATE POLICY "learner_skill_states_update_own"
  ON public.learner_skill_states FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

COMMENT ON TABLE public.learning_attempts IS
  'Immutable learner responses. Completion is not stored as mastery evidence.';
COMMENT ON TABLE public.learning_evidence_events IS
  'Evidence awarded from attempts. Modality and support constraints determine what an attempt may prove.';
COMMENT ON TABLE public.learner_skill_states IS
  'Derived per-target learner state across independent evidence channels.';
