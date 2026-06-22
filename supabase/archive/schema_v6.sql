-- ============================================================================
-- SQL Schema v6 - Speaking Practice Module
-- Hãy copy toàn bộ script này và chạy trong SQL Editor trên Supabase Dashboard.
-- ============================================================================

-- 1. Tạo bảng speaking_sessions để lưu lịch sử luyện nói
CREATE TABLE IF NOT EXISTS public.speaking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL, -- 'shadowing' | 'roleplay' | 'journal'
    duration INTEGER NOT NULL, -- thời gian nói tính bằng giây
    transcript TEXT, -- đoạn text nhận diện được
    accuracy_score INTEGER, -- điểm chính xác (Shadowing)
    scenario_id TEXT, -- ID của kịch bản/bài nói
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Bật Row Level Security (RLS)
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Tạo các RLS Policies cho bảng speaking_sessions
CREATE POLICY "Users can view their own speaking sessions" 
    ON public.speaking_sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own speaking sessions" 
    ON public.speaking_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
