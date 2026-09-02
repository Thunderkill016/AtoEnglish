-- Complete the append-only FSRS review log for ts-fsrs v5.4.1.
-- ReviewLog includes last_elapsed_days and learning_steps; both are needed to reconstruct/rollback history.

ALTER TABLE public.card_review_logs
  ADD COLUMN IF NOT EXISTS last_elapsed_days integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS learning_steps integer NOT NULL DEFAULT 0;

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
  v_previous_elapsed_days integer;
  v_previous_learning_steps integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated';
  END IF;

  -- Capture the native pre-review fields before updating the card. These correspond to
  -- ReviewLog.last_elapsed_days and ReviewLog.learning_steps in ts-fsrs v5.4.1.
  SELECT elapsed_days, learning_steps
  INTO v_previous_elapsed_days, v_previous_learning_steps
  FROM public.cards
  WHERE id = p_card_id AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found or not owned by current user';
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

  INSERT INTO public.card_review_logs (
    user_id,
    card_id,
    rating,
    state,
    due,
    stability,
    difficulty,
    elapsed_days,
    last_elapsed_days,
    scheduled_days,
    learning_steps,
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
    GREATEST(COALESCE(v_previous_elapsed_days, 0), 0),
    GREATEST(p_log_scheduled_days, 0),
    GREATEST(COALESCE(v_previous_learning_steps, 0), 0),
    p_log_review
  );
END;
$$;
