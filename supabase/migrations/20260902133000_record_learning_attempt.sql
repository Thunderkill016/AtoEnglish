-- Atomic Attempt -> Evidence -> LearnerSkillState persistence.
-- Evidence policy is decided in the application domain layer; this RPC only commits the
-- already-authorized event and updates the rebuildable planner snapshot.

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
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_attempt_id uuid;
  v_confidence double precision;
  v_support_penalty double precision;
  v_observation double precision;
  v_alpha double precision;
  v_initial_value double precision;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated';
  END IF;

  IF p_knowledge_item_id IS NULL AND p_capability_id IS NULL THEN
    RAISE EXCEPTION 'Attempt requires knowledge_item_id or capability_id';
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

  -- A valid attempt may produce no evidence. That is expected for reveal/debug/fallback paths.
  IF p_evidence_type IS NULL THEN
    RETURN v_attempt_id;
  END IF;

  IF p_evidence_target_id IS NULL OR p_evidence_success IS NULL THEN
    RAISE EXCEPTION 'Evidence target and success are required when evidence_type is present';
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
    COALESCE(p_evidence_context_id, p_context_id),
    COALESCE(p_evaluator, 'deterministic'),
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
        THEN LEAST(GREATEST(learner_skill_states.recognition * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.recognition
    END,
    retrieval = CASE
      WHEN p_evidence_type = 'retrieval'
        THEN LEAST(GREATEST(learner_skill_states.retrieval * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.retrieval
    END,
    listening = CASE
      WHEN p_evidence_type = 'listening'
        THEN LEAST(GREATEST(learner_skill_states.listening * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.listening
    END,
    production = CASE
      WHEN p_evidence_type = 'production'
        THEN LEAST(GREATEST(learner_skill_states.production * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.production
    END,
    repair = CASE
      WHEN p_evidence_type = 'repair'
        THEN LEAST(GREATEST(learner_skill_states.repair * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.repair
    END,
    transfer = CASE
      WHEN p_evidence_type = 'transfer'
        THEN LEAST(GREATEST(learner_skill_states.transfer * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.transfer
    END,
    retention = CASE
      WHEN p_evidence_type = 'retention'
        THEN LEAST(GREATEST(learner_skill_states.retention * (1 - v_alpha) + v_observation * v_alpha, 0), 1)
      ELSE learner_skill_states.retention
    END,
    evidence_count = learner_skill_states.evidence_count + 1,
    last_evidence_at = now(),
    updated_at = now();

  RETURN v_attempt_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_learning_attempt(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_learning_attempt(
  text, text, uuid, text, text, text, text, text, boolean, integer, integer, boolean,
  integer, jsonb, text, text, boolean, double precision, text, text, jsonb
) TO authenticated;
