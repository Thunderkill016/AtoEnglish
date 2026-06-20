-- Migration: CEFR Level Auto-Progression (fixed)
-- Uses user_lesson_progress table (actual table name in this DB)
-- current_level is text (not an enum type)

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

-- Trigger: run after each unit completion
CREATE OR REPLACE FUNCTION public.check_cefr_progression()
RETURNS TRIGGER AS $$
DECLARE
  v_current_level text;
  v_completed_count int;
  v_required int;
  v_next_level text;
BEGIN
  -- Get user's current CEFR level
  SELECT current_level INTO v_current_level
  FROM public.user_progress
  WHERE user_id = NEW.user_id;

  IF v_current_level IS NULL OR v_current_level = 'C1' THEN
    RETURN NEW;
  END IF;

  -- Count distinct completed units
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

-- Attach trigger to user_lesson_progress
DROP TRIGGER IF EXISTS on_unit_complete_check_cefr ON public.user_lesson_progress;
CREATE TRIGGER on_unit_complete_check_cefr
  AFTER INSERT ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.check_cefr_progression();
