-- Real Talk transcript provenance persistence boundary
--
-- This migration does not approve a production transcript adapter. It stores
-- the audit data required by a future approved ingestion flow and prevents an
-- ordinary authenticated client from self-labelling transcript evidence as
-- approved. The current experimental adapter remains the only client-writable
-- mode and is still blocked by application policy in production.

ALTER TABLE public.real_talk_videos
  ADD COLUMN IF NOT EXISTS transcript_acquisition_mode TEXT NOT NULL
    DEFAULT 'experimental_unofficial',
  ADD COLUMN IF NOT EXISTS transcript_review_status TEXT NOT NULL
    DEFAULT 'unreviewed',
  ADD COLUMN IF NOT EXISTS transcript_source_metadata JSONB NOT NULL
    DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS transcript_cue_digest TEXT;

ALTER TABLE public.real_talk_videos
  DROP CONSTRAINT IF EXISTS real_talk_videos_transcript_acquisition_mode_check,
  DROP CONSTRAINT IF EXISTS real_talk_videos_transcript_review_status_check,
  DROP CONSTRAINT IF EXISTS real_talk_videos_transcript_cue_digest_check,
  DROP CONSTRAINT IF EXISTS real_talk_videos_approved_transcript_provenance_check;

ALTER TABLE public.real_talk_videos
  ADD CONSTRAINT real_talk_videos_transcript_acquisition_mode_check
    CHECK (
      transcript_acquisition_mode IN (
        'creator_provided',
        'authorized_export',
        'licensed_source',
        'public_domain',
        'human_reviewed_upload',
        'approved_provider_api',
        'experimental_unofficial'
      )
    ),
  ADD CONSTRAINT real_talk_videos_transcript_review_status_check
    CHECK (
      transcript_review_status IN (
        'unreviewed',
        'machine_checked',
        'human_verified'
      )
    ),
  ADD CONSTRAINT real_talk_videos_transcript_cue_digest_check
    CHECK (
      transcript_cue_digest IS NULL
      OR transcript_cue_digest ~ '^[0-9a-f]{64}$'
    ),
  ADD CONSTRAINT real_talk_videos_approved_transcript_provenance_check
    CHECK (
      transcript_acquisition_mode = 'experimental_unofficial'
      OR (
        transcript_review_status = 'human_verified'
        AND transcript_cue_digest IS NOT NULL
        AND jsonb_typeof(transcript_source_metadata) = 'object'
        AND transcript_source_metadata ? 'adapterId'
        AND transcript_source_metadata ? 'acquisitionMode'
        AND transcript_source_metadata ? 'language'
        AND transcript_source_metadata ? 'sourceReference'
        AND transcript_source_metadata ? 'provenance'
        AND jsonb_typeof(transcript_source_metadata -> 'provenance') = 'object'
        AND transcript_source_metadata -> 'provenance' ? 'canonicalSourceUrl'
        AND transcript_source_metadata -> 'provenance' ? 'rightsBasis'
        AND transcript_source_metadata -> 'provenance' ? 'rightsReference'
        AND transcript_source_metadata -> 'provenance' ? 'submittedByUserId'
        AND transcript_source_metadata -> 'provenance' ? 'reviewedByUserId'
        AND transcript_source_metadata -> 'provenance' ? 'reviewedAt'
        AND transcript_source_metadata -> 'provenance' ? 'cueDigestSha256'
        AND transcript_source_metadata -> 'provenance' ->> 'cueDigestSha256'
          = transcript_cue_digest
      )
    );

CREATE OR REPLACE FUNCTION public.real_talk_enforce_transcript_provenance_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  requester_role TEXT := COALESCE((SELECT auth.role()), '');
BEGIN
  -- Approved provenance must come from a future trusted reviewer/service path,
  -- never from an ordinary authenticated browser client.
  IF requester_role = 'authenticated'
     AND NEW.transcript_acquisition_mode <> 'experimental_unofficial' THEN
    RAISE EXCEPTION 'approved transcript provenance requires a trusted server review path'
      USING ERRCODE = '42501';
  END IF;

  -- Once an approved source exists, ordinary roles cannot rewrite its rights,
  -- reviewer, source, or cue digest. A future reviewer workflow must use the
  -- controlled service path and leave an audit record.
  IF TG_OP = 'UPDATE'
     AND OLD.transcript_acquisition_mode <> 'experimental_unofficial'
     AND requester_role <> 'service_role'
     AND (
       OLD.transcript_acquisition_mode IS DISTINCT FROM NEW.transcript_acquisition_mode
       OR OLD.transcript_review_status IS DISTINCT FROM NEW.transcript_review_status
       OR OLD.transcript_source_metadata IS DISTINCT FROM NEW.transcript_source_metadata
       OR OLD.transcript_cue_digest IS DISTINCT FROM NEW.transcript_cue_digest
     ) THEN
    RAISE EXCEPTION 'approved transcript provenance is immutable for ordinary roles'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS real_talk_transcript_provenance_write_gate
  ON public.real_talk_videos;

CREATE TRIGGER real_talk_transcript_provenance_write_gate
BEFORE INSERT OR UPDATE ON public.real_talk_videos
FOR EACH ROW
EXECUTE FUNCTION public.real_talk_enforce_transcript_provenance_write();

CREATE INDEX IF NOT EXISTS real_talk_videos_transcript_mode_idx
  ON public.real_talk_videos(transcript_acquisition_mode);
