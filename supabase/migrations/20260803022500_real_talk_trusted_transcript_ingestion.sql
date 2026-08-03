-- Trusted transcript ingestion and independent-review boundary for Real Talk.
--
-- Direct client writes are intentionally revoked. A JWT-authenticated Edge
-- Function validates the caller, derives submitter/reviewer identities from
-- Supabase Auth, computes the cue digest server-side, and writes with the
-- service role. Approved rows are readable by authenticated editors and become
-- immutable after human verification.

CREATE TABLE IF NOT EXISTS public.real_talk_transcript_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adapter_id TEXT NOT NULL DEFAULT 'supabase-reviewed-transcript-v1',
  provider TEXT NOT NULL,
  source_external_id TEXT NOT NULL,
  canonical_source_url TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  language TEXT NOT NULL,
  acquisition_mode TEXT NOT NULL,
  rights_basis TEXT NOT NULL,
  rights_reference TEXT NOT NULL,
  cues JSONB NOT NULL,
  cue_digest TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'unreviewed',
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  reviewed_at TIMESTAMPTZ,
  warnings JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT real_talk_transcript_sources_identity_key
    UNIQUE (adapter_id, source_external_id, language),
  CONSTRAINT real_talk_transcript_sources_adapter_check
    CHECK (adapter_id = 'supabase-reviewed-transcript-v1'),
  CONSTRAINT real_talk_transcript_sources_provider_check
    CHECK (char_length(provider) BETWEEN 2 AND 120),
  CONSTRAINT real_talk_transcript_sources_external_id_check
    CHECK (
      char_length(source_external_id) BETWEEN 2 AND 160
      AND source_external_id !~ '[\r\n\0]'
    ),
  CONSTRAINT real_talk_transcript_sources_canonical_url_check
    CHECK (
      char_length(canonical_source_url) BETWEEN 12 AND 1000
      AND canonical_source_url ~ '^https://[^[:space:]]+$'
    ),
  CONSTRAINT real_talk_transcript_sources_reference_check
    CHECK (
      char_length(source_reference) BETWEEN 1 AND 1000
      AND source_reference !~ '[\r\n\0]'
      AND source_reference !~* '(access[_-]?token|authorization|api[_-]?key|signature|x-goog-signature|x-amz-signature)='
    ),
  CONSTRAINT real_talk_transcript_sources_language_check
    CHECK (language ~ '^[a-z]{2}(-[a-z0-9]+)*$'),
  CONSTRAINT real_talk_transcript_sources_acquisition_mode_check
    CHECK (
      acquisition_mode IN (
        'creator_provided',
        'authorized_export',
        'licensed_source',
        'public_domain',
        'human_reviewed_upload',
        'approved_provider_api'
      )
    ),
  CONSTRAINT real_talk_transcript_sources_rights_basis_check
    CHECK (
      rights_basis IN (
        'creator_owned',
        'authorized_editor_export',
        'explicit_license',
        'public_domain'
      )
    ),
  CONSTRAINT real_talk_transcript_sources_rights_compatibility_check
    CHECK (
      (acquisition_mode = 'creator_provided' AND rights_basis = 'creator_owned')
      OR (
        acquisition_mode = 'authorized_export'
        AND rights_basis IN ('creator_owned', 'authorized_editor_export')
      )
      OR (acquisition_mode = 'licensed_source' AND rights_basis = 'explicit_license')
      OR (acquisition_mode = 'public_domain' AND rights_basis = 'public_domain')
      OR (
        acquisition_mode = 'human_reviewed_upload'
        AND rights_basis IN (
          'creator_owned',
          'authorized_editor_export',
          'explicit_license',
          'public_domain'
        )
      )
      OR (
        acquisition_mode = 'approved_provider_api'
        AND rights_basis IN ('authorized_editor_export', 'explicit_license')
      )
    ),
  CONSTRAINT real_talk_transcript_sources_rights_reference_check
    CHECK (
      char_length(rights_reference) BETWEEN 1 AND 1000
      AND rights_reference !~ '[\r\n\0]'
      AND rights_reference !~* '(access[_-]?token|authorization|api[_-]?key|signature|x-goog-signature|x-amz-signature)='
    ),
  CONSTRAINT real_talk_transcript_sources_cues_check
    CHECK (
      jsonb_typeof(cues) = 'array'
      AND jsonb_array_length(cues) BETWEEN 2 AND 200
    ),
  CONSTRAINT real_talk_transcript_sources_digest_check
    CHECK (cue_digest ~ '^[0-9a-f]{64}$'),
  CONSTRAINT real_talk_transcript_sources_review_status_check
    CHECK (review_status IN ('unreviewed', 'human_verified')),
  CONSTRAINT real_talk_transcript_sources_review_fields_check
    CHECK (
      (
        review_status = 'unreviewed'
        AND reviewed_by IS NULL
        AND reviewed_at IS NULL
      )
      OR (
        review_status = 'human_verified'
        AND reviewed_by IS NOT NULL
        AND reviewed_at IS NOT NULL
        AND reviewed_by <> submitted_by
      )
    ),
  CONSTRAINT real_talk_transcript_sources_warnings_check
    CHECK (jsonb_typeof(warnings) = 'array')
);

ALTER TABLE public.real_talk_transcript_sources ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.real_talk_transcript_sources
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.real_talk_transcript_sources TO authenticated;
GRANT ALL ON TABLE public.real_talk_transcript_sources TO service_role;

DROP POLICY IF EXISTS "real_talk_transcript_sources_authenticated_read"
  ON public.real_talk_transcript_sources;
CREATE POLICY "real_talk_transcript_sources_authenticated_read"
ON public.real_talk_transcript_sources
FOR SELECT
TO authenticated
USING (
  review_status = 'human_verified'
  OR submitted_by = (SELECT auth.uid())
  OR reviewed_by = (SELECT auth.uid())
);

CREATE OR REPLACE FUNCTION public.real_talk_touch_transcript_source_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.real_talk_lock_verified_transcript_source()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.review_status = 'human_verified'
     AND (to_jsonb(NEW) - ARRAY['updated_at']::TEXT[])
         IS DISTINCT FROM
         (to_jsonb(OLD) - ARRAY['updated_at']::TEXT[]) THEN
    RAISE EXCEPTION 'human-verified transcript sources are immutable'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS real_talk_transcript_source_lock_verified
  ON public.real_talk_transcript_sources;
CREATE TRIGGER real_talk_transcript_source_lock_verified
BEFORE UPDATE ON public.real_talk_transcript_sources
FOR EACH ROW
EXECUTE FUNCTION public.real_talk_lock_verified_transcript_source();

DROP TRIGGER IF EXISTS real_talk_transcript_source_touch_updated_at
  ON public.real_talk_transcript_sources;
CREATE TRIGGER real_talk_transcript_source_touch_updated_at
BEFORE UPDATE ON public.real_talk_transcript_sources
FOR EACH ROW
EXECUTE FUNCTION public.real_talk_touch_transcript_source_updated_at();

CREATE INDEX IF NOT EXISTS real_talk_transcript_sources_review_status_idx
  ON public.real_talk_transcript_sources(review_status);
CREATE INDEX IF NOT EXISTS real_talk_transcript_sources_submitter_idx
  ON public.real_talk_transcript_sources(submitted_by);
CREATE INDEX IF NOT EXISTS real_talk_transcript_sources_reviewer_idx
  ON public.real_talk_transcript_sources(reviewed_by)
  WHERE reviewed_by IS NOT NULL;
