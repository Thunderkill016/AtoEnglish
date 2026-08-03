-- Cover Auth foreign keys so deleting or updating a test/reviewer account does
-- not scan the transcript registry. The status-only index remains removed until
-- a measured query needs it.

CREATE INDEX IF NOT EXISTS real_talk_transcript_sources_submitter_idx
  ON public.real_talk_transcript_sources(submitted_by);
CREATE INDEX IF NOT EXISTS real_talk_transcript_sources_reviewer_idx
  ON public.real_talk_transcript_sources(reviewed_by)
  WHERE reviewed_by IS NOT NULL;
