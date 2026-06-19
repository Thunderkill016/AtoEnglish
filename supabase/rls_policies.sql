-- ============================================================
-- AtoEnglish — RLS Security Policies for User Data Tables
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. user_progress ──────────────────────────────────────
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users cannot delete own progress" ON user_progress;

-- Chỉ đọc data của chính mình
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Chỉ tạo row cho chính mình
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chỉ cập nhật data của chính mình
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- KHÔNG cho phép user xóa progress của mình (ngăn reset thủ công)
-- Chỉ service role (admin) mới xóa được
CREATE POLICY "Users cannot delete own progress"
  ON user_progress FOR DELETE
  USING (false);

-- ── 2. completed_lessons ──────────────────────────────────
ALTER TABLE completed_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own completed lessons" ON completed_lessons;
DROP POLICY IF EXISTS "Users can insert own completed lessons" ON completed_lessons;
DROP POLICY IF EXISTS "Users cannot update completed lessons" ON completed_lessons;
DROP POLICY IF EXISTS "Users cannot delete completed lessons" ON completed_lessons;

CREATE POLICY "Users can view own completed lessons"
  ON completed_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed lessons"
  ON completed_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Không cho sửa (bài đã hoàn thành thì không thể "un-complete")
CREATE POLICY "Users cannot update completed lessons"
  ON completed_lessons FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete completed lessons"
  ON completed_lessons FOR DELETE
  USING (false);

-- ── 3. card_reviews (SRS flashcards) ──────────────────────
ALTER TABLE card_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own card reviews" ON card_reviews;
DROP POLICY IF EXISTS "Users can insert own card reviews" ON card_reviews;
DROP POLICY IF EXISTS "Users can update own card reviews" ON card_reviews;
DROP POLICY IF EXISTS "Users cannot delete card reviews" ON card_reviews;

CREATE POLICY "Users can view own card reviews"
  ON card_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card reviews"
  ON card_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Cho phép update (FSRS cập nhật scheduling sau mỗi lần ôn)
CREATE POLICY "Users can update own card reviews"
  ON card_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot delete card reviews"
  ON card_reviews FOR DELETE
  USING (false);

-- ── 4. units, lessons, lesson_items (CONTENT — read-only) ─
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can read units" ON units;
DROP POLICY IF EXISTS "Anyone authenticated can read lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone authenticated can read lesson_items" ON lesson_items;

-- Nội dung học: đọc được nếu đã đăng nhập, không ai được ghi từ client
CREATE POLICY "Anyone authenticated can read units"
  ON units FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone authenticated can read lessons"
  ON lessons FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone authenticated can read lesson_items"
  ON lesson_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- ── 5. Verify all RLS is active ────────────────────────────
SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_progress', 
    'completed_lessons', 
    'card_reviews',
    'units', 
    'lessons', 
    'lesson_items'
  )
ORDER BY tablename;
