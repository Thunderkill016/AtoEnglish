-- Migration: daily_xp_goal on user_progress
-- Persists the user's daily XP target across devices (replaces localStorage-only storage).

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS daily_xp_goal INTEGER NOT NULL DEFAULT 50
  CHECK (daily_xp_goal >= 5 AND daily_xp_goal <= 200);

COMMENT ON COLUMN public.user_progress.daily_xp_goal IS
  'Daily XP target for streak/goal progress. Set during onboarding or via settings.';