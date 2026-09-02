-- Legacy cards without review history cannot safely reconstruct Card.elapsed_days.
-- ts-fsrs v5.4.1 treats this as the interval between the two most recent reviews,
-- not the time from last_review to migration time. Keep unknown history neutral.
UPDATE public.cards AS c
SET elapsed_days = 0
WHERE NOT EXISTS (
  SELECT 1
  FROM public.card_review_logs AS l
  WHERE l.card_id = c.id
);
