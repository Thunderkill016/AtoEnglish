-- Correct legacy FSRS history using the append-only review log.
-- In ts-fsrs v5.4.1, Card.elapsed_days represents the interval between the two
-- most recent reviews (ReviewLog.last_elapsed_days on the next review), not now-last_review.

WITH latest_review AS (
  SELECT DISTINCT ON (card_id)
    card_id,
    elapsed_days
  FROM public.card_review_logs
  ORDER BY card_id, review DESC, created_at DESC
)
UPDATE public.cards AS c
SET elapsed_days = GREATEST(COALESCE(latest_review.elapsed_days, 0), 0)
FROM latest_review
WHERE c.id = latest_review.card_id;

-- A lapse is an Again rating while the card was in Review state.
WITH lapse_counts AS (
  SELECT
    card_id,
    COUNT(*) FILTER (WHERE rating = 1 AND state = 2)::integer AS lapses
  FROM public.card_review_logs
  GROUP BY card_id
)
UPDATE public.cards AS c
SET lapses = GREATEST(COALESCE(lapse_counts.lapses, 0), 0)
FROM lapse_counts
WHERE c.id = lapse_counts.card_id;

COMMENT ON COLUMN public.cards.elapsed_days IS
  'Legacy ts-fsrs v5 field: days between the two most recent reviews; current elapsed time is recalculated from last_review.';
COMMENT ON COLUMN public.cards.scheduled_days IS
  'Days scheduled by FSRS at the previous review.';
COMMENT ON COLUMN public.cards.lapses IS
  'Count of Again ratings from Review state.';
COMMENT ON COLUMN public.cards.learning_steps IS
  'Current short-term (re)learning step index used by ts-fsrs.';
