-- Migration: CEFR Level Auto-Progression
-- Automatically advances user's CEFR level when they complete enough units

-- Function to compute how many units are needed to advance from a given level
CREATE OR REPLACE FUNCTION public.units_required_for_level(level public.cefr_level)
RETURNS INT AS $$
BEGIN
  RETURN CASE level
    WHEN 'A1' THEN 4   -- 4 units to unlock A2
    WHEN 'A2' THEN 6   -- 6 units to unlock B1
    WHEN 'B1' THEN 8   -- 8 units to unlock B2
    WHEN 'B2' THEN 10  -- 10 units to unlock C1
    WHEN 'C1' THEN 999 -- C1 is max, never auto-advance
    ELSE 4
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get the next CEFR level
CREATE OR REPLACE FUNCTION public.next_cefr_level(level public.cefr_level)
RETURNS public.cefr_level AS $$
BEGIN
  RETURN CASE level
    WHEN 'A1' THEN 'A2'::public.cefr_level
    WHEN 'A2' THEN 'B1'::public.cefr_level
    WHEN 'B1' THEN 'B2'::public.cefr_level
    WHEN 'B2' THEN 'C1'::public.cefr_level
    ELSE level -- C1 stays C1
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function: runs after each lesson completion
CREATE OR REPLACE FUNCTION public.check_cefr_progression()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_current_level public.cefr_level;
  v_completed_count INT;
  v_required INT;
  v_next_level public.cefr_level;
BEGIN
  v_user_id := NEW.user_id;

  -- Get current CEFR level
  SELECT current_level INTO v_current_level
  FROM public.user_progress
  WHERE user_id = v_user_id;

  IF v_current_level IS NULL OR v_current_level = 'C1' THEN
    RETURN NEW;
  END IF;

  -- Count completed units for this user
  SELECT COUNT(DISTINCT unit_id) INTO v_completed_count
  FROM public.completed_lessons
  WHERE user_id = v_user_id;

  v_required := public.units_required_for_level(v_current_level);

  IF v_completed_count >= v_required THEN
    v_next_level := public.next_cefr_level(v_current_level);

    -- Update level only if it changed
    UPDATE public.user_progress
    SET current_level = v_next_level
    WHERE user_id = v_user_id
      AND current_level = v_current_level; -- guard against race
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to completed_lessons
DROP TRIGGER IF EXISTS on_lesson_complete_check_cefr ON public.completed_lessons;
CREATE TRIGGER on_lesson_complete_check_cefr
  AFTER INSERT ON public.completed_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.check_cefr_progression();
