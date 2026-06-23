-- Idempotent RLS policy sync for card_review_logs.
-- Table created in 20260620000000_add_card_review_logs.sql.
-- Replaces duplicate table DDL from 20260620115300 (now a no-op).

ALTER TABLE public.card_review_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own review logs" ON public.card_review_logs;
DROP POLICY IF EXISTS "Users can insert own review logs" ON public.card_review_logs;
DROP POLICY IF EXISTS "card_review_logs_select_own" ON public.card_review_logs;
DROP POLICY IF EXISTS "card_review_logs_insert_own" ON public.card_review_logs;

CREATE POLICY "card_review_logs_select_own"
  ON public.card_review_logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "card_review_logs_insert_own"
  ON public.card_review_logs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

COMMENT ON TABLE public.card_review_logs IS
  'Append-only FSRS review log per card. Used for per-user parameter optimization.';