-- ============================================================================
-- SQL Schema v7 - Upgraded Spaced Repetition to FSRS
-- Hãy copy toàn bộ script này và chạy trong SQL Editor trên Supabase Dashboard.
-- Script này tự động thêm các cột mới và migrate an toàn dữ liệu SM-2 cũ sang FSRS.
-- ============================================================================

-- 1. Thêm cột mới phục vụ FSRS vào bảng cards
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS state INTEGER NOT NULL DEFAULT 0 CHECK (state >= 0 AND state <= 3),
ADD COLUMN IF NOT EXISTS difficulty DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS stability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS last_review TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_review TIMESTAMPTZ;

-- 2. Migrate dữ liệu cũ sang FSRS để đảm bảo tương thích ngược
-- Đối với thẻ đã ôn tập (repetitions > 0), xấp xỉ stability bằng interval cũ
UPDATE public.cards
SET 
  state = 2, -- 2 tương ứng với Review state trong FSRS
  stability = COALESCE(interval, 1.0), 
  difficulty = 5.0, -- độ khó mặc định ban đầu
  last_review = COALESCE(last_reviewed, created_at),
  next_review = COALESCE(due_date, now())
WHERE repetitions > 0 AND next_review IS NULL;

-- Đối với thẻ mới chưa ôn tập (repetitions = 0)
UPDATE public.cards
SET 
  state = 0, -- 0 tương ứng với New state trong FSRS
  stability = 0.0,
  difficulty = 0.0,
  last_review = last_reviewed,
  next_review = COALESCE(due_date, now())
WHERE repetitions = 0 AND next_review IS NULL;
