-- Fix: last_active_date is DATE; RPC was assigning TEXT (p_today) directly.
CREATE OR REPLACE FUNCTION public.complete_unit_transaction(
  p_user_id UUID,
  p_unit_id TEXT,
  p_xp_earned INTEGER,
  p_stars INTEGER,
  p_today TEXT
) RETURNS JSONB AS $$
DECLARE
  v_already_completed BOOLEAN;
  v_new_xp INTEGER;
  v_new_streak INTEGER;
  v_current_level TEXT;
  v_new_level TEXT;
  v_streak_last_active DATE;
  v_today DATE := p_today::DATE;
  v_yesterday DATE;
  v_completed_count INTEGER;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.user_lesson_progress
    WHERE user_id = p_user_id AND unit_id = p_unit_id
  ) INTO v_already_completed;

  IF v_already_completed THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true);
  END IF;

  INSERT INTO public.user_lesson_progress (user_id, unit_id, xp_earned, completed_at)
  VALUES (p_user_id, p_unit_id, p_xp_earned, NOW());

  SELECT COUNT(DISTINCT unit_id)
  FROM public.user_lesson_progress
  WHERE user_id = p_user_id
  INTO v_completed_count;

  IF v_completed_count >= 40 THEN
    v_new_level := 'B2';
  ELSIF v_completed_count >= 26 THEN
    v_new_level := 'B1';
  ELSIF v_completed_count >= 20 THEN
    v_new_level := 'A2';
  ELSIF v_completed_count >= 8 THEN
    v_new_level := 'A1';
  ELSE
    v_new_level := 'A0';
  END IF;

  SELECT streak, total_xp, last_active_date, current_level
  FROM public.user_progress
  WHERE user_id = p_user_id
  INTO v_new_streak, v_new_xp, v_streak_last_active, v_current_level;

  IF v_new_xp IS NULL THEN
    INSERT INTO public.user_progress (user_id, current_level, streak, total_xp, last_active_date)
    VALUES (p_user_id, v_new_level, 1, p_xp_earned, v_today);

    v_new_streak := 1;
    v_new_xp := p_xp_earned;
    v_current_level := v_new_level;
  ELSE
    v_yesterday := v_today - INTERVAL '1 day';

    IF v_streak_last_active = v_today THEN
      v_new_streak := v_new_streak;
    ELSIF v_streak_last_active = v_yesterday THEN
      v_new_streak := v_new_streak + 1;
    ELSE
      v_new_streak := 1;
    END IF;

    IF (
      CASE v_new_level
        WHEN 'C1' THEN 6 WHEN 'B2' THEN 5 WHEN 'B1' THEN 4
        WHEN 'A2' THEN 3 WHEN 'A1' THEN 2 WHEN 'A0' THEN 1 ELSE 0
      END
    ) <= (
      CASE COALESCE(v_current_level, 'A0')
        WHEN 'C1' THEN 6 WHEN 'B2' THEN 5 WHEN 'B1' THEN 4
        WHEN 'A2' THEN 3 WHEN 'A1' THEN 2 WHEN 'A0' THEN 1 ELSE 0
      END
    ) THEN
      v_new_level := COALESCE(v_current_level, 'A0');
    END IF;

    UPDATE public.user_progress
    SET total_xp = total_xp + p_xp_earned,
        streak = v_new_streak,
        last_active_date = v_today,
        current_level = v_new_level,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    v_new_xp := v_new_xp + p_xp_earned;
  END IF;

  RETURN jsonb_build_object(
    'success',         true,
    'xp_earned',       p_xp_earned,
    'new_streak',      v_new_streak,
    'new_total_xp',    v_new_xp,
    'current_level',   v_new_level,
    'completed_count', v_completed_count,
    'leveled_up',      (v_new_level IS DISTINCT FROM COALESCE(v_current_level, 'A0'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;