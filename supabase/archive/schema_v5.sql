-- ============================================================================
-- SQL Schema v5 - Hoàn thiện vòng lặp học tập (Learn -> Complete Unit -> XP)
-- Hãy copy toàn bộ script này và chạy trong SQL Editor trên Supabase Dashboard.
-- ============================================================================

-- 1. Xóa bảng user_lesson_progress cũ nếu có để tạo lại theo cấu trúc mới
DROP TABLE IF EXISTS public.user_lesson_progress CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;

-- 2. Tạo bảng user_progress (lưu thông tin streak, XP tổng của người học)
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_level TEXT NOT NULL DEFAULT 'B1',
    streak INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tạo bảng user_lesson_progress (lưu thông tin các Unit đã học xong)
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Đảm bảo mỗi user chỉ được đánh dấu hoàn thành một unit một lần duy nhất
    CONSTRAINT user_lesson_progress_user_id_unit_id_key UNIQUE (user_id, unit_id)
);

-- 4. Bật Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- 5. Tạo các RLS Policies cho bảng user_progress
CREATE POLICY "Users can view their own progress" 
    ON public.user_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
    ON public.user_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
    ON public.user_progress FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Tạo các RLS Policies cho bảng user_lesson_progress
CREATE POLICY "Users can view their own lesson progress" 
    ON public.user_lesson_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" 
    ON public.user_lesson_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
    ON public.user_lesson_progress FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
