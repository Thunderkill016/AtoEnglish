-- 1. Index for FSRS Card Selection (Composite)
CREATE INDEX IF NOT EXISTS idx_cards_user_due 
ON public.cards (user_id, due_date ASC);

-- 2. Index for FSRS Review Logs (Composite)
CREATE INDEX IF NOT EXISTS idx_card_review_logs_user_card
ON public.card_review_logs (user_id, card_id);

-- 3. Index for Lesson Completion Checks
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_unit
ON public.user_lesson_progress (user_id, unit_id);

-- 4. Index for Unique constraints to handle upsert (SeedVocab)
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_word 
ON public.cards (user_id, word);
