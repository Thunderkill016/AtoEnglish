-- Harden the learning-evidence write boundary.
-- New learning tables are readable by their owner, but clients cannot write them directly.
-- A public SECURITY INVOKER wrapper delegates to a private SECURITY DEFINER core that
-- derives user_id from auth.uid() and enforces the product evidence invariants again.

CREATE SCHEMA IF NOT EXISTS private;

-- Supabase no longer guarantees automatic Data API grants for newly-created tables.
-- Make the intended API surface explicit and least-privileged.
REVOKE ALL ON TABLE public.learning_attempts FROM anon, authenticated;
REVOKE ALL ON TABLE public.learning_evidence_events FROM anon, authenticated;
REVOKE ALL ON TABLE public.learner_skill_states FROM anon, authenticated;

GRANT SELECT ON TABLE public.learning_attempts TO authenticated;
GRANT SELECT ON TABLE public.learning_evidence_events TO authenticated;
GRANT SELECT ON TABLE public.learner_skill_states TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.learning_attempts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.learning_evidence_events TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.learner_skill_states TO service_role;

-- Direct writes are intentionally unsupported. The RPC is the only product write path.
DROP POLICY IF EXISTS "learning_attempts_insert_own" ON public.learning_attempts;
DROP POLICY IF EXISTS "learning_evidence_insert_own" ON public.learning_evidence_events;
DROP POLICY IF EXISTS "learner_skill_states_insert_own" ON public.learner_skill_states;
DROP POLICY IF EXISTS "learner_skill_states_update_own" ON public.learner_skill_states;

CREATE OR REPLACE FUNCTION private.record_learning_attempt_core(
  p_knowledge_item_id text,
  p_capability_id text,
  p_session_id uuid,
  p_exercise_type text,
  p_response_modality text,
  p_prompt_id text,
  p_context_id text,
  p_response_text text,
  p_correct boolean,
  p_latency_ms integer,
  p_hint_count integer,
  p_reveal_used boolean,
  p_support_level integer,
  p_metadata jsonb,
  p_evidence_type text,
  p_evidence_target_id text,
  p_evidence_success boolean,
  p_evidence_confidence double precision,
  p_evidence_context_id text,
  p_evaluator text,
  p_evidence_metadata jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_attempt_id uuid;
  v_confidence double precision;
  v_support_penalty double precision;
  v_observation double precision;
  v_alpha double precision;
  v_initial_value double precision;
  v_effective_context text;
  v_previous_context text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated';
  END IF;

  IF p_knowledge_item_id IS NULL AND p_capability_id IS NULL THEN
    RAISE EXCEPTION 'Attempt requires knowledge_item_id or capability_id';
  END IF;

  IF p_response_modality NOT IN ('choice', 'text', 'speech', 'gesture', 'none') THEN
    RAISE EXCEPTION 'Unsupported response modality';
  END IF;

  IF p_evidence_type IS NOT NULL THEN
    IF p_evidence_type NOT IN ('recognition', 'retrieval', 'listening', 'production', 'repair', 'transfer', 'retention') THEN
      RAISE EXCEPTION 'Unsupported evidence type';
    END IF;

    IF p_evidence_target_id IS NULL OR p_evidence_success IS NULL THEN
      RAISE EXCEPTION 'Evidence target and success are required when evidence_type is present';
    END IF;

    IF p_evidence_target_id IS DISTINCT FROM p_knowledge_item_id
       AND p_evidence_target_id IS DISTINCT FROM p_capability_id THEN
      RAISE EXCEPTION 'Evidence target does not belong to this attempt';
    END IF;

    IF COALESCE(p_reveal_used, false)
       AND p_evidence_type IN ('retrieval', 'production', 'repair', 'transfer') THEN
      RAISE EXCEPTION 'Revealed attempts cannot create independent evidence';
    END IF;

    IF p_evidence_type IN ('production', 'repair', 'transfer')
       AND p_response_modality <> 'speech' THEN
      RAISE EXCEPTION 'Oral evidence requires an observed speech modality';
    END IF;

    IF p_evidence_type = 'retrieval' AND p_response_modality = 'none' THEN
      RAISE EXCEPTION 'Retrieval evidence requires an observable response';
    END IF;

    IF COALESCE(p_evidence_success, false)
       AND p_evidence_type IN ('production', 'repair', 'transfer')
       AND NULLIF(BTRIM(COALESCE(p_response_text, '')), '') IS NULL THEN
      RAISE EXCEPTION 'Successful oral evidence requires a captured transcript/response';
    END IF;

    v_effective_context := COALESCE(p_evidence_context_id, p_context_id);

    IF p_evidence_type = 'transfer' THEN
      IF v_effective_context IS NULL THEN
        RAISE EXCEPTION 'Transfer evidence requires a context';
      END IF;

      -- Transfer is measured against the latest successful independent oral performance
      -- already stored for this target. The caller cannot supply the previous context.
      SELECT e.context_id
      INTO v_previous_context
      FROM public.learning_evidence_events AS e
      WHERE e.user_id = v_user_id
        AND e.target_id = p_evidence_target_id
        AND e.success = true
        AND e.evidence_type IN ('production', 'repair', 'transfer')
        AND e.context_id IS NOT NULL
      ORDER BY e.created_at DESC
      LIMIT 1;

      IF v_previous_context IS NULL OR v_previous_context = v_effective_context THEN
        RAISE EXCEPTION 'Transfer requires a changed context relative to prior successful production';
      END IF;
    END IF;
  END IF;

  INSERT INTO public.learning_attempts (
    user_id,
    knowledge_item_id,
    capability_id,
    session_id,
    exercise_type,
    response_modality,
    prompt_id,
    context_id,
    response_text,
    correct,
    latency_ms,
    hint_count,
    reveal_used,
    support_level,
    metadata
  ) VALUES (
    v_user_id,
    p_knowledge_item_id,
    p_capability_id,
    p_session_id,
    p_exercise_type,
    p_response_modality,
    p_prompt_id,
    p_context_id,
    p_response_text,
    p_correct,
    p_latency_ms,
    GREATEST(COALESCE(p_hint_count, 0), 0),
    COALESCE(p_reveal_used, false),
    GREATEST(COALESCE(p_support_level, 0), 0),
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_attempt_id;

  -- An attempt can be valid while producing no mastery evidence.
  IF p_evidence_type IS NULL THEN
    RETURN v_attempt_id;
  END IF;

  v_confidence := LEAST(GREATEST(COALESCE(p_evidence_confidence, 1.0), 0.0), 1.0);
  v_support_penalty := LEAST(GREATEST(COALESCE(p_support_level, 0), 0) * 0.1, 0.5);
  v_observation := CASE
    WHEN p_evidence_success THEN v_confidence * (1.0 - v_support_penalty)
    ELSE 0.0
  END;
  v_alpha := CASE WHEN p_evidence_success THEN 0.35 ELSE 0.5 END;
  v_initial_value := v_observation * v_alpha;

  INSERT INTO public.learning_evidence_events (
    user_id,
    attempt_id,
    evidence_type,
    target_id,
    success,
    confidence,
    support_level,
    context_id,
    evaluator,
    metadata
  ) VALUES (
    v_user_id,
    v_attempt_id,
    p_evidence_type,
    p_evidence_target_id,
    p_evidence_success,
    v_confidence,
    GREATEST(COALESCE(p_support_level, 0), 0),
    v_effective_context,
    COALESCE(NULLIF(BTRIM(p_evaluator), ''), 'deterministic'),
    COALESCE(p_evidence_metadata, '{}'::jsonb)
  );

  INSERT INTO public.learner_skill_states (
    user_id,
    target_id,
    recognition,
    retrieval,
    listening,
    production,
    repair,
    transfer,
    retention,
    evidence_count,
    last_evidence_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_evidence_target_id,
    CASE WHEN p_evidence_type = 'recognition' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'retrieval' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'listening' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'production' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'repair' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'transfer' THEN v_initial_value ELSE 0 END,
    CASE WHEN p_evidence_type = 'retention' THEN v_initial_value ELSE 0 END,
    1,
    now(),
    now()
  )
  ON CONFLICT (user_id, target_id) DO UPDATE SET
    recognition = CASE
      WHEN p_evidence_type = 'recognition'
        THEN LEAST(GREATEST(public.learner_skill_states.recognition * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.recognition
    END,
    retrieval = CASE
      WHEN p_evidence_type = 'retrieval'
        THEN LEAST(GREATEST(public.learner_skill_states.retrieval * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.retrieval
    END,
    listening = CASE
      WHEN p_evidence_type = 'listening'
        THEN LEAST(GREATEST(public.learner_skill_states.listening * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.listening
    END,
    production = CASE
      WHEN p_evidence_type = 'production'
        THEN LEAST(GREATEST(public.learner_skill_states.production * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.production
    END,
    repair = CASE
      WHEN p_evidence_type = 'repair'
        THEN LEAST(GREATEST(public.learner_skill_states.repair * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.repair
    END,
    transfer = CASE
      WHEN p_evidence_type = 'transfer'
        THEN LEAST(GREATEST(public.learner_skill_states.transfer * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.transfer
    END,
    retention = CASE
      WHEN p_evidence_type = 'retention'
        THEN LEAST(GREATEST(public.learner_skill_states.retention * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE public.learner_skill_states.retention
    END,
    evidence_count = public.learner_skill_states.evidence_count + 1,
    last_evidence_at = now(),
    updated_at = now();

  RETURN v_attempt_id;
END;
$$;

REVOKE ALL ON FUNCTION private.record_learning_attempt_core(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.record_learning_attempt_core(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) TO authenticated;

-- Keep the public RPC name stable for supabase-js, but leave privileged writes in private.
CREATE OR REPLACE FUNCTION public.record_learning_attempt(
  p_knowledge_item_id text,
  p_capability_id text,
  p_session_id uuid,
  p_exercise_type text,
  p_response_modality text,
  p_prompt_id text,
  p_context_id text,
  p_response_text text,
  p_correct boolean,
  p_latency_ms integer,
  p_hint_count integer,
  p_reveal_used boolean,
  p_support_level integer,
  p_metadata jsonb,
  p_evidence_type text,
  p_evidence_target_id text,
  p_evidence_success boolean,
  p_evidence_confidence double precision,
  p_evidence_context_id text,
  p_evaluator text,
  p_evidence_metadata jsonb
) RETURNS uuid
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private, pg_temp
AS $$
  SELECT private.record_learning_attempt_core(
    p_knowledge_item_id,
    p_capability_id,
    p_session_id,
    p_exercise_type,
    p_response_modality,
    p_prompt_id,
    p_context_id,
    p_response_text,
    p_correct,
    p_latency_ms,
    p_hint_count,
    p_reveal_used,
    p_support_level,
    p_metadata,
    p_evidence_type,
    p_evidence_target_id,
    p_evidence_success,
    p_evidence_confidence,
    p_evidence_context_id,
    p_evaluator,
    p_evidence_metadata
  );
$$;

REVOKE ALL ON FUNCTION public.record_learning_attempt(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_learning_attempt(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) TO authenticated;
