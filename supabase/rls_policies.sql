-- ============================================================
-- AtoEnglish — RLS Security Policies for User Data Tables
-- Run this in: Supabase Dashboard → SQL Editor
-- Tables verified from source code: cards, user_lesson_progress,
-- speaking_sessions, user_progress, users
-- ============================================================

-- ── 1. user_progress ──────────────────────────────────────
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users cannot delete own progress" ON user_progress;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Không cho user tự xóa progress (chống cheat/reset)
CREATE POLICY "Users cannot delete own progress"
  ON user_progress FOR DELETE
  USING (false);

-- ── 2. user_lesson_progress ───────────────────────────────
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users cannot delete lesson progress" ON user_lesson_progress;

CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot delete lesson progress"
  ON user_lesson_progress FOR DELETE
  USING (false);

-- ── 3. cards (SRS flashcards) ─────────────────────────────
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users cannot delete cards" ON cards;

CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- FSRS cần update scheduling sau mỗi lần ôn tập
CREATE POLICY "Users can update own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot delete cards"
  ON cards FOR DELETE
  USING (false);

-- ── 4. speaking_sessions ──────────────────────────────────
ALTER TABLE speaking_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own speaking sessions" ON speaking_sessions;
DROP POLICY IF EXISTS "Users can insert own speaking sessions" ON speaking_sessions;
DROP POLICY IF EXISTS "Users cannot delete speaking sessions" ON speaking_sessions;

CREATE POLICY "Users can view own speaking sessions"
  ON speaking_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own speaking sessions"
  ON speaking_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot delete speaking sessions"
  ON speaking_sessions FOR DELETE
  USING (false);

-- ── 5. Verify RLS is active on all tables ──────────────────
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_progress',
    'user_lesson_progress',
    'cards',
    'speaking_sessions'
  )
ORDER BY tablename;
