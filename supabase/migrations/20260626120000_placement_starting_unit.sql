-- Placement test: remember where the learner should start in the curriculum
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS starting_unit_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS placement_completed_at timestamptz;

COMMENT ON COLUMN public.user_progress.starting_unit_index IS
  'Index into UNITS[] where learner enters after placement/onboarding (0 = unit-a0-1).';

COMMENT ON COLUMN public.user_progress.placement_completed_at IS
  'When the user completed placement test or self-selected their level.';