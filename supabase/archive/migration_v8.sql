-- ============================================================================
-- SQL Schema v8 - Daily XP Goal System
-- Chạy script này trong Supabase SQL Editor để thêm cột daily_xp_goal vào bảng user_progress.
-- ============================================================================

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS daily_xp_goal INTEGER NOT NULL DEFAULT 50 CHECK (daily_xp_goal IN (30, 50, 80, 100));
