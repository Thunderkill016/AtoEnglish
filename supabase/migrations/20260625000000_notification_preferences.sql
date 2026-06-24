-- Migration: Add notification preferences to user_progress
-- Run: supabase db push OR apply via Supabase dashboard SQL editor

ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS notification_hour INT DEFAULT 20 CHECK (notification_hour >= 0 AND notification_hour <= 23),
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- Index for cron job: quickly find users whose preferred hour matches current hour
CREATE INDEX IF NOT EXISTS idx_user_progress_notification_hour
  ON user_progress (notification_hour)
  WHERE notification_hour IS NOT NULL;

COMMENT ON COLUMN user_progress.notification_hour IS 'Hour (0-23, VN timezone) when user wants daily push reminder. Default: 20 (8 PM).';
COMMENT ON COLUMN user_progress.email_notifications IS 'Whether user opted in to weekly email digest and win-back emails.';
