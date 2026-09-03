-- Migration: CEFR Level Auto-Progression
--
-- Historical note: `user_lesson_progress` was introduced later by
-- 20260621160000_schema_consolidation.sql. Hosted environments that already had the table could
-- attach this trigger immediately, while a clean migration replay could not. Keep the functions
-- available here and attach the trigger only when the dependency already exists; the consolidation
-- migration also installs the trigger after it creates the missing table.

-- Function: units required before advancing from a given level
CREATE OR REPLACE FUNCTION public.units_required_for_level(level text)
RETURNS INT AS $$
BEGIN
  RETURN CASE level
    WHEN 'A1' THEN 4
    WHEN 'A2' THEN 6
    WHEN 'B1' THEN 8
    WHEN 'B2' THEN 10
    ELSE 999
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: next CEFR level
CREATE OR REPLACE FUNCTION public.next_cefr_level(level text)
RETURNS text AS $$
BEGIN
  RETURN CASE level
    WHEN 'A1' THEN 'A2'
    WHEN 'A2' THEN 'B1'
    WHEN 'B1' THEN 'B2'
    WHEN 'B2' THEN 'C1'
    ELSE level
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function: run after each unit completion.
-- PL/pgSQL resolves the table reference when the function executes, so defining the function is
-- safe before the table exists.
CREATE OR REPLACE FUNCTION public.check_cefr_progression()
RETURNS TRIGGER AS $$
DECLARE
  v_current_level text;
  v_completed_count int;
  v_required int;
  v_next_level text;
BEGIN
  SELECT current_level INTO v_current_level
  FROM public.user_progress
  WHERE user_id = NEW.user_id;

  IF v_current_level IS NULL OR v_current_level = 'C1' THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(DISTINCT unit_id) INTO v_completed_count
  FROM public.user_lesson_progress
  WHERE user_id = NEW.user_id;

  v_required := public.units_required_for_level(v_current_level);

  IF v_completed_count >= v_required THEN
    v_next_level := public.next_cefr_level(v_current_level);
    UPDATE public.user_progress
    SET current_level = v_next_level
    WHERE user_id = NEW.user_id
      AND current_level = v_current_level;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Some historical/hosted databases already had user_lesson_progress before this migration. Attach
-- there, but do not make fresh migration replay depend on a table that is created later.
DO $$
BEGIN
  IF to_regclass('public.user_lesson_progress') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS on_unit_complete_check_cefr ON public.user_lesson_progress';
    EXECUTE 'CREATE TRIGGER on_unit_complete_check_cefr AFTER INSERT ON public.user_lesson_progress FOR EACH ROW EXECUTE FUNCTION public.check_cefr_progression()';
  END IF;
END;
$$;
