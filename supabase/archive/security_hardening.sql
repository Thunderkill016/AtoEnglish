-- =============================================================================
-- AtoEnglish — SQL Security Hardening (Row Level Security)
-- 
-- Chạy script này trong SQL Editor của Supabase Dashboard để siết chặt RLS.
-- Script này đảm bảo:
--   1. RLS được bật trên tất cả các bảng.
--   2. Nghiêm cấm hoàn toàn truy cập nặc danh (anonymous / public / unauthenticated).
--   3. Mỗi user chỉ có quyền truy cập (SELECT, INSERT, UPDATE, DELETE) dữ liệu của chính họ.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Đảm bảo kích hoạt RLS trên tất cả các bảng
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sentences ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Dọn dẹp các Policy cũ để tránh xung đột
-- -----------------------------------------------------------------------------

-- Bảng users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Bảng user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;

-- Bảng user_lesson_progress
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON public.user_lesson_progress;

-- Bảng cards
DROP POLICY IF EXISTS "Users can view own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can update own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete own cards" ON public.cards;

-- Bảng speaking_sessions
DROP POLICY IF EXISTS "Users can view their own speaking sessions" ON public.speaking_sessions;
DROP POLICY IF EXISTS "Users can insert their own speaking sessions" ON public.speaking_sessions;

-- Bảng lesson_history
DROP POLICY IF EXISTS "Users can view own lesson history" ON public.lesson_history;
DROP POLICY IF EXISTS "Users can insert own lesson history" ON public.lesson_history;
DROP POLICY IF EXISTS "Users can update own lesson history" ON public.lesson_history;
DROP POLICY IF EXISTS "Users can delete own lesson history" ON public.lesson_history;

-- Bảng user_sentences
DROP POLICY IF EXISTS "Users can view own sentences" ON public.user_sentences;
DROP POLICY IF EXISTS "Users can insert own sentences" ON public.user_sentences;
DROP POLICY IF EXISTS "Users can update own sentences" ON public.user_sentences;
DROP POLICY IF EXISTS "Users can delete own sentences" ON public.user_sentences;


-- -----------------------------------------------------------------------------
-- 3. Tạo các Policy bảo mật mới (Yêu cầu AUTHENTICATED role & đúng USER_ID)
-- -----------------------------------------------------------------------------

-- --- BẢNG: public.users ---
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- --- BẢNG: public.user_progress ---
CREATE POLICY "user_progress_select_policy" ON public.user_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_policy" ON public.user_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update_policy" ON public.user_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- --- BẢNG: public.user_lesson_progress ---
CREATE POLICY "user_lesson_progress_select_policy" ON public.user_lesson_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_lesson_progress_insert_policy" ON public.user_lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_lesson_progress_update_policy" ON public.user_lesson_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_lesson_progress_delete_policy" ON public.user_lesson_progress
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- --- BẢNG: public.cards ---
CREATE POLICY "cards_select_policy" ON public.cards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "cards_insert_policy" ON public.cards
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_update_policy" ON public.cards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_delete_policy" ON public.cards
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- --- BẢNG: public.speaking_sessions ---
CREATE POLICY "speaking_sessions_select_policy" ON public.speaking_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "speaking_sessions_insert_policy" ON public.speaking_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "speaking_sessions_update_policy" ON public.speaking_sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "speaking_sessions_delete_policy" ON public.speaking_sessions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- --- BẢNG: public.lesson_history ---
CREATE POLICY "lesson_history_select_policy" ON public.lesson_history
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "lesson_history_insert_policy" ON public.lesson_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_history_update_policy" ON public.lesson_history
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_history_delete_policy" ON public.lesson_history
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- --- BẢNG: public.user_sentences ---
CREATE POLICY "user_sentences_select_policy" ON public.user_sentences
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_sentences_insert_policy" ON public.user_sentences
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_sentences_update_policy" ON public.user_sentences
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_sentences_delete_policy" ON public.user_sentences
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
