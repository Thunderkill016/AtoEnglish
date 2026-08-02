-- Real Talk Schema Migration
-- Migration: 20260802000000_real_talk_schema.sql

-- 1. Real Talk Videos catalog
CREATE TABLE IF NOT EXISTS public.real_talk_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  youtube_id VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  channel_name TEXT,
  channel_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT NOT NULL DEFAULT 0,
  segment_start DECIMAL NOT NULL DEFAULT 0,
  segment_end DECIMAL NOT NULL DEFAULT 0,
  level VARCHAR(5) NOT NULL DEFAULT 'A1',
  topics TEXT[] DEFAULT '{}',
  speaker_count INT DEFAULT 2,
  speakers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Real Talk Lessons
CREATE TABLE IF NOT EXISTS public.real_talk_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.real_talk_videos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  level VARCHAR(5) NOT NULL DEFAULT 'A1',
  estimated_minutes INT NOT NULL DEFAULT 15,
  can_do_statement TEXT,
  can_do_statement_vi TEXT,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  pre_watch JSONB NOT NULL DEFAULT '{}'::jsonb,
  while_watch JSONB NOT NULL DEFAULT '{}'::jsonb,
  post_watch JSONB NOT NULL DEFAULT '{}'::jsonb,
  generation_model TEXT DEFAULT 'gemini-2.0-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(video_id)
);

-- 3. Real Talk User Progress
CREATE TABLE IF NOT EXISTS public.real_talk_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.real_talk_videos(id) ON DELETE CASCADE,
  phase VARCHAR(20) NOT NULL DEFAULT 'pre_watch',
  quiz_score INT DEFAULT 0,
  speaking_scores JSONB DEFAULT '[]'::jsonb,
  saved_vocab TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.real_talk_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_talk_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_talk_progress ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Videos: Everyone can view public videos; authenticated users can create
CREATE POLICY "real_talk_videos_select" ON public.real_talk_videos
  FOR SELECT USING (is_public OR auth.uid() = created_by);

CREATE POLICY "real_talk_videos_insert" ON public.real_talk_videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Lessons: Everyone can view lessons for public videos
CREATE POLICY "real_talk_lessons_select" ON public.real_talk_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.real_talk_videos v
      WHERE v.id = real_talk_lessons.video_id
      AND (v.is_public OR v.created_by = auth.uid())
    )
  );

CREATE POLICY "real_talk_lessons_insert" ON public.real_talk_lessons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Progress: Users manage their own progress
CREATE POLICY "real_talk_progress_user" ON public.real_talk_progress
  FOR ALL USING (auth.uid() = user_id);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_real_talk_videos_slug ON public.real_talk_videos(slug);
CREATE INDEX IF NOT EXISTS idx_real_talk_videos_youtube_id ON public.real_talk_videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_real_talk_videos_level ON public.real_talk_videos(level);
CREATE INDEX IF NOT EXISTS idx_real_talk_progress_user_video ON public.real_talk_progress(user_id, video_id);
