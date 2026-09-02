-- Recover the FSRS history that can be reconstructed from legacy append-only logs.
-- Do not trust legacy card_review_logs.elapsed_days: before this migration it was derived
-- from next_review-last_review (scheduled interval), not the actual time between reviews.

-- Card.elapsed_days in ts-fsrs v5.4.1 is the interval between the two most recent
-- completed reviews. Reconstruct it from review timestamps, which were recorded accurately.
WITH ordered_reviews AS (
  SELECT
    card_id,
    review,
    LAG(review) OVER (PARTITION BY card_id ORDER BY review, created_at) AS previous_review,
    ROW_NUMBER() OVER (PARTITION BY card_id ORDER BY review DESC, created_at DESC) AS newest_rank
  FROM public.card_review_logs
), latest_intervals AS (
  SELECT
    card_id,
    CASE
      WHEN previous_review IS NULL THEN 0
      ELSE GREATEST(
        FLOOR(EXTRACT(EPOCH FROM (review - previous_review)) / 86400)::integer,
        0
      )
    END AS elapsed_days
  FROM ordered_reviews
  WHERE newest_rank = 1
)
UPDATE public.cards AS c
SET elapsed_days = latest_intervals.elapsed_days
FROM latest_intervals
WHERE c.id = latest_intervals.card_id;

-- Legacy logs stored the *post-review* card state. Therefore the state before a review
-- is recoverable from the previous log's post-review state. Count recoverable lapses as
-- Again reviews whose immediately preceding logged state was Review.
WITH review_sequence AS (
  SELECT
    card_id,
    rating,
    LAG(state) OVER (PARTITION BY card_id ORDER BY review, created_at) AS previous_state
  FROM public.card_review_logs
), lapse_counts AS (
  SELECT
    card_id,
    COUNT(*) FILTER (WHERE rating = 1 AND previous_state = 2)::integer AS lapses
  FROM review_sequence
  GROUP BY card_id
)
UPDATE public.cards AS c
SET lapses = GREATEST(COALESCE(lapse_counts.lapses, 0), 0)
FROM lapse_counts
WHERE c.id = lapse_counts.card_id;

-- learning_steps cannot be reconstructed safely because legacy logs did not persist it.
-- Existing Learning/Relearning cards restart from step 0 once; all future steps are durable.

COMMENT ON COLUMN public.cards.elapsed_days IS
  'ts-fsrs v5 field: days between the two most recent reviews; current elapsed time is recalculated from last_review.';
COMMENT ON COLUMN public.cards.scheduled_days IS
  'Days scheduled by FSRS at the previous review.';
COMMENT ON COLUMN public.cards.lapses IS
  'Count of recoverable Again reviews from Review state; fully durable after the 2026-09-02 learning-core migration.';
COMMENT ON COLUMN public.cards.learning_steps IS
  'Current short-term (re)learning step index used by ts-fsrs; fully durable after the 2026-09-02 learning-core migration.';
