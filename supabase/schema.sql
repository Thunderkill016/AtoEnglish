-- ============================================================================
-- SQL Schema Script for AtoEnglish
-- Hãy copy toàn bộ script này và paste vào phần SQL Editor trên Supabase Dashboard.
-- ============================================================================

-- 1. Tạo extension uuid-ossp (nếu chưa có) để sinh UUID tự động
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng cards (lưu các thẻ từ vựng phục vụ Spaced Repetition SRS)
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    phonetic TEXT,
    meaning_vn TEXT NOT NULL,
    example_en TEXT,
    topic TEXT,
    level TEXT NOT NULL DEFAULT 'B1',
    interval INTEGER NOT NULL DEFAULT 1,
    ease_factor NUMERIC NOT NULL DEFAULT 2.5,
    due_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    repetitions INTEGER NOT NULL DEFAULT 0,
    last_reviewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Đảm bảo mỗi user chỉ lưu một từ vựng một lần duy nhất
    CONSTRAINT cards_user_id_word_key UNIQUE (user_id, word)
);

-- 3. Tạo bảng user_lesson_progress (lưu tiến độ học tập các Unit của người dùng)
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    progress_percent INTEGER NOT NULL DEFAULT 0,
    last_studied TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Đảm bảo mỗi user chỉ có một dòng tiến trình cho một bài học
    CONSTRAINT user_lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id)
);

-- 4. Bật Row Level Security (RLS) cho cả hai bảng để bảo mật dữ liệu người dùng
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- 5. Thiết lập các RLS Policies cho bảng public.cards
-- SELECT: Người dùng chỉ được xem các thẻ do chính mình tạo
CREATE POLICY "Users can view their own cards" 
    ON public.cards FOR SELECT 
    USING (auth.uid() = user_id);

-- INSERT: Người dùng chỉ được chèn thẻ gán với user_id của chính mình
CREATE POLICY "Users can insert their own cards" 
    ON public.cards FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Người dùng chỉ được cập nhật thẻ của chính mình
CREATE POLICY "Users can update their own cards" 
    ON public.cards FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Người dùng chỉ được xóa thẻ của chính mình
CREATE POLICY "Users can delete their own cards" 
    ON public.cards FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Thiết lập các RLS Policies cho bảng public.user_lesson_progress
-- SELECT: Xem tiến độ học tập của bản thân
CREATE POLICY "Users can view their own lesson progress" 
    ON public.user_lesson_progress FOR SELECT 
    USING (auth.uid() = user_id);

-- INSERT: Ghi nhận tiến độ học tập mới của bản thân
CREATE POLICY "Users can insert their own lesson progress" 
    ON public.user_lesson_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Cập nhật tiến độ học tập của bản thân
CREATE POLICY "Users can update their own lesson progress" 
    ON public.user_lesson_progress FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Xóa tiến độ học tập của bản thân
CREATE POLICY "Users can delete their own lesson progress" 
    ON public.user_lesson_progress FOR DELETE 
    USING (auth.uid() = user_id);
