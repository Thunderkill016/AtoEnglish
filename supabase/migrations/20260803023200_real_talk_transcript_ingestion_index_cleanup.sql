-- Keep only the unique source identity index until query evidence justifies
-- additional indexes. The registry starts empty and approved-source lookup uses
-- the unique (adapter_id, source_external_id, language) constraint.

DROP INDEX IF EXISTS public.real_talk_transcript_sources_review_status_idx;
DROP INDEX IF EXISTS public.real_talk_transcript_sources_submitter_idx;
DROP INDEX IF EXISTS public.real_talk_transcript_sources_reviewer_idx;
