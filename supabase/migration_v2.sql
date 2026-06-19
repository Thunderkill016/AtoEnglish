-- ============================================================
-- AtoEnglish — Full Database Migration
-- Run in: Supabase Dashboard → SQL Editor
-- Run each PHASE separately and verify before proceeding
-- ============================================================

-- ── PHASE 1: Cards table cleanup ──────────────────────────

-- Drop SM-2 fields no longer used (app now uses FSRS only)
ALTER TABLE cards DROP COLUMN IF EXISTS ease_factor;
ALTER TABLE cards DROP COLUMN IF EXISTS last_reviewed;

-- Fix default level: B1 → A1
ALTER TABLE cards ALTER COLUMN level SET DEFAULT 'A1';

-- Fix NOT NULL + defaults for FSRS fields
ALTER TABLE cards ALTER COLUMN state SET DEFAULT 0;
ALTER TABLE cards ALTER COLUMN difficulty SET DEFAULT 0.0;
ALTER TABLE cards ALTER COLUMN stability SET DEFAULT 0.0;
ALTER TABLE cards ALTER COLUMN interval SET DEFAULT 0;
ALTER TABLE cards ALTER COLUMN repetitions SET DEFAULT 0;
ALTER TABLE cards ALTER COLUMN due_date SET DEFAULT now();
ALTER TABLE cards ALTER COLUMN next_review SET DEFAULT now();

-- Add CHECK constraints
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_level_check;
ALTER TABLE cards ADD CONSTRAINT cards_level_check
  CHECK (level IN ('A1','A2','B1','B2','C1'));

ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_state_check;
ALTER TABLE cards ADD CONSTRAINT cards_state_check
  CHECK (state BETWEEN 0 AND 3);

-- Add UNIQUE constraint: 1 user → 1 word only
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_user_word_unique;
ALTER TABLE cards ADD CONSTRAINT cards_user_word_unique
  UNIQUE (user_id, word);

-- Verify Phase 1
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'cards' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ── PHASE 2: user_lesson_progress cleanup ─────────────────

-- Add UNIQUE constraint to prevent duplicate completions
ALTER TABLE user_lesson_progress DROP CONSTRAINT IF EXISTS unit_completion_unique;
ALTER TABLE user_lesson_progress ADD CONSTRAINT unit_completion_unique
  UNIQUE (user_id, unit_id);

-- Verify Phase 2
SELECT COUNT(*) as total_rows FROM user_lesson_progress;

-- ── PHASE 3: user_progress constraints ────────────────────

-- Fix default level: B1 → A1
ALTER TABLE user_progress ALTER COLUMN current_level SET DEFAULT 'A1';

-- Fix existing rows that have B1 as default (user hasn't chosen level)
-- (Only updates rows where total_xp = 0, meaning they haven't actually learned anything)
-- COMMENT THIS OUT if you want to keep existing user levels:
-- UPDATE user_progress SET current_level = 'A1' WHERE current_level = 'B1' AND total_xp = 0;

-- Add CHECK constraints
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_level_check;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_level_check
  CHECK (current_level IN ('A1','A2','B1','B2','C1'));

ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_xp_check;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_xp_check
  CHECK (total_xp >= 0);

ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_streak_check;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_streak_check
  CHECK (streak >= 0);

-- Verify Phase 3
SELECT user_id, current_level, total_xp, streak FROM user_progress LIMIT 10;

-- ── PHASE 4: Performance Indexes ──────────────────────────

-- cards: most common query is getDueCards (user_id + due_date)
CREATE INDEX IF NOT EXISTS idx_cards_user_due
  ON cards (user_id, due_date ASC);

-- cards: getCardsByTopic
CREATE INDEX IF NOT EXISTS idx_cards_user_topic
  ON cards (user_id, topic);

-- user_lesson_progress: check completion + count
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user
  ON user_lesson_progress (user_id);

-- speaking_sessions: recent history
CREATE INDEX IF NOT EXISTS idx_speaking_user_date
  ON speaking_sessions (user_id, created_at DESC);

-- Verify Phase 4
SELECT indexname, tablename FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('cards','user_lesson_progress','speaking_sessions')
ORDER BY tablename, indexname;

-- ── PHASE 5: RLS Policies ─────────────────────────────────

-- user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users cannot delete own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cannot delete own progress" ON user_progress FOR DELETE USING (false);

-- user_lesson_progress
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users cannot update lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users cannot delete lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cannot update lesson progress" ON user_lesson_progress FOR UPDATE USING (false);
CREATE POLICY "Users cannot delete lesson progress" ON user_lesson_progress FOR DELETE USING (false);

-- cards
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users cannot delete cards" ON cards;
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cannot delete cards" ON cards FOR DELETE USING (false);

-- speaking_sessions
ALTER TABLE speaking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own speaking sessions" ON speaking_sessions;
DROP POLICY IF EXISTS "Users can insert own speaking sessions" ON speaking_sessions;
DROP POLICY IF EXISTS "Users cannot delete speaking sessions" ON speaking_sessions;
CREATE POLICY "Users can view own speaking sessions" ON speaking_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own speaking sessions" ON speaking_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cannot delete speaking sessions" ON speaking_sessions FOR DELETE USING (false);

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ── FINAL: Verify everything ──────────────────────────────
SELECT
  t.tablename,
  t.rowsecurity AS rls_enabled,
  COUNT(p.policyname) AS policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
  AND t.tablename IN ('user_progress','user_lesson_progress','cards','speaking_sessions','users')
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;
