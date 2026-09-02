-- Defense-in-depth constraints for evidence rows.
-- The RPC performs these checks for clearer errors, while this trigger protects the table
-- from future write paths that accidentally bypass application/domain validation.

CREATE OR REPLACE FUNCTION private.enforce_learning_evidence_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_attempt_user_id uuid;
  v_knowledge_item_id text;
  v_capability_id text;
  v_attempt_context text;
  v_response_modality text;
  v_reveal_used boolean;
  v_response_text text;
  v_previous_context text;
BEGIN
  SELECT
    user_id,
    knowledge_item_id,
    capability_id,
    context_id,
    response_modality,
    reveal_used,
    response_text
  INTO
    v_attempt_user_id,
    v_knowledge_item_id,
    v_capability_id,
    v_attempt_context,
    v_response_modality,
    v_reveal_used,
    v_response_text
  FROM public.learning_attempts
  WHERE id = NEW.attempt_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Evidence attempt does not exist';
  END IF;

  IF NEW.user_id IS DISTINCT FROM v_attempt_user_id THEN
    RAISE EXCEPTION 'Evidence user must match attempt user';
  END IF;

  IF NEW.target_id IS DISTINCT FROM v_knowledge_item_id
     AND NEW.target_id IS DISTINCT FROM v_capability_id THEN
    RAISE EXCEPTION 'Evidence target does not belong to attempt';
  END IF;

  IF COALESCE(v_reveal_used, false)
     AND NEW.evidence_type IN ('retrieval', 'production', 'repair', 'transfer') THEN
    RAISE EXCEPTION 'Revealed attempts cannot create independent evidence';
  END IF;

  IF NEW.evidence_type IN ('production', 'repair', 'transfer')
     AND v_response_modality <> 'speech' THEN
    RAISE EXCEPTION 'Oral evidence requires speech modality';
  END IF;

  IF NEW.evidence_type = 'retrieval' AND v_response_modality = 'none' THEN
    RAISE EXCEPTION 'Retrieval evidence requires an observable response';
  END IF;

  IF NEW.success
     AND NEW.evidence_type IN ('production', 'repair', 'transfer')
     AND NULLIF(BTRIM(COALESCE(v_response_text, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Successful oral evidence requires a captured response';
  END IF;

  -- The attempted task owns context identity. An evaluator cannot substitute another context.
  IF NEW.context_id IS NOT NULL
     AND v_attempt_context IS NOT NULL
     AND NEW.context_id <> v_attempt_context THEN
    RAISE EXCEPTION 'Evidence context must match attempted context';
  END IF;

  IF NEW.evidence_type = 'transfer' THEN
    IF v_attempt_context IS NULL OR NEW.context_id IS DISTINCT FROM v_attempt_context THEN
      RAISE EXCEPTION 'Transfer evidence requires the attempted context';
    END IF;

    -- Serialize transfer decisions per learner+target so concurrent requests cannot both
    -- claim the same changed context relative to the same previous successful production.
    PERFORM pg_advisory_xact_lock(
      hashtextextended(NEW.user_id::text || ':' || NEW.target_id, 0)
    );

    SELECT e.context_id
    INTO v_previous_context
    FROM public.learning_evidence_events AS e
    WHERE e.user_id = NEW.user_id
      AND e.target_id = NEW.target_id
      AND e.success = true
      AND e.evidence_type IN ('production', 'repair', 'transfer')
      AND e.context_id IS NOT NULL
    ORDER BY e.created_at DESC
    LIMIT 1;

    IF v_previous_context IS NULL OR v_previous_context = NEW.context_id THEN
      RAISE EXCEPTION 'Transfer requires a changed context relative to prior successful production';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.enforce_learning_evidence_event() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_learning_evidence_event
  ON public.learning_evidence_events;
CREATE TRIGGER enforce_learning_evidence_event
BEFORE INSERT ON public.learning_evidence_events
FOR EACH ROW
EXECUTE FUNCTION private.enforce_learning_evidence_event();
