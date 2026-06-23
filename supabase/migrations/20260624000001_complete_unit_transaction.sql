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
  v_streak_last_active TEXT;
  v_yesterday TEXT;
BEGIN
  -- 1. Check if already completed
  SELECT EXISTS(
    SELECT 1 FROM public.user_lesson_progress 
    WHERE user_id = p_user_id AND unit_id = p_unit_id
  ) INTO v_already_completed;

  IF v_already_completed THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true);
  END IF;

  -- 2. Insert lesson progress record
  INSERT INTO public.user_lesson_progress (user_id, unit_id, xp_earned, completed_at)
  VALUES (p_user_id, p_unit_id, p_xp_earned, NOW());

  -- 3. Calculate streak and update user progress
  SELECT streak, total_xp, last_active_date, current_level 
  FROM public.user_progress
  WHERE user_id = p_user_id
  INTO v_new_streak, v_new_xp, v_streak_last_active, v_current_level;

  IF v_new_xp IS NULL THEN
    -- If user progress row is missing, insert baseline
    INSERT INTO public.user_progress (user_id, current_level, streak, total_xp, last_active_date)
    VALUES (p_user_id, 'A0', 1, p_xp_earned, p_today);
    
    v_new_streak := 1;
    v_new_xp := p_xp_earned;
  ELSE
    -- Calculate Streak Incrementation
    v_yesterday := TO_CHAR((p_today::DATE - INTERVAL '1 day'), 'YYYY-MM-DD');
    
    IF v_streak_last_active = p_today THEN
      v_new_streak := v_new_streak; -- Keep same streak
    ELSIF v_streak_last_active = v_yesterday THEN
      v_new_streak := v_new_streak + 1; -- Increment streak
    ELSE
      v_new_streak := 1; -- Reset streak
    END IF;

    -- Update existing record
    UPDATE public.user_progress
    SET total_xp = total_xp + p_xp_earned,
        streak = v_new_streak,
        last_active_date = p_today,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    v_new_xp := v_new_xp + p_xp_earned;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', p_xp_earned,
    'new_streak', v_new_streak,
    'new_total_xp', v_new_xp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
