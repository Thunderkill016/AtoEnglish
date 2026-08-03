import "server-only";

import {
  TranscriptSourceError,
  type TranscriptAcquisitionMode,
  type TranscriptCue,
  type TranscriptRightsBasis,
  type TranscriptSourceAdapter,
} from "@/features/real-talk/domain/transcript-source";
import { createClient } from "@/lib/supabase/server";

export const SUPABASE_REVIEWED_TRANSCRIPT_ADAPTER_ID =
  "supabase-reviewed-transcript-v1";

const ACQUISITION_MODES = new Set<TranscriptAcquisitionMode>([
  "creator_provided",
  "authorized_export",
  "licensed_source",
  "public_domain",
  "human_reviewed_upload",
  "approved_provider_api",
]);
const RIGHTS_BASES = new Set<TranscriptRightsBasis>([
  "creator_owned",
  "authorized_editor_export",
  "explicit_license",
  "public_domain",
]);

type ClientFactory = () => Promise<Awaited<ReturnType<typeof createClient>>>;

function invalidProvenance(message: string): never {
  throw new TranscriptSourceError({
    code: "transcript_provenance_invalid",
    message,
  });
}

function parseCues(value: unknown): TranscriptCue[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 200) {
    return invalidProvenance("Reviewed transcript cues are missing or unbounded.");
  }

  return value.map((cue, index) => {
    if (typeof cue !== "object" || cue === null || Array.isArray(cue)) {
      return invalidProvenance(`Reviewed transcript cue ${index} is invalid.`);
    }
    const record = cue as Record<string, unknown>;
    const text = typeof record.text === "string" ? record.text : "";
    const offset = Number(record.offset);
    const duration = Number(record.duration);
    if (
      !text.trim() ||
      !Number.isFinite(offset) ||
      offset < 0 ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return invalidProvenance(
        `Reviewed transcript cue ${index} has invalid text or timing.`,
      );
    }
    return { text, offset, duration };
  });
}

function parseWarnings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((warning): warning is string => typeof warning === "string");
}

export function createSupabaseReviewedTranscriptSource(
  clientFactory: ClientFactory = createClient,
): TranscriptSourceAdapter {
  return {
    id: SUPABASE_REVIEWED_TRANSCRIPT_ADAPTER_ID,
    trust: "approved",
    async acquire(request) {
      const client = await clientFactory();
      const requestedLanguage = request.requestedLanguage.trim().toLowerCase();
      const { data, error } = await client
        .from("real_talk_transcript_sources")
        .select("*")
        .eq("adapter_id", SUPABASE_REVIEWED_TRANSCRIPT_ADAPTER_ID)
        .eq("source_external_id", request.sourceId)
        .eq("language", requestedLanguage)
        .eq("review_status", "human_verified")
        .maybeSingle();

      if (error) {
        throw new TranscriptSourceError({
          code: "transcript_provider_error",
          message: "The reviewed transcript registry is temporarily unavailable.",
          retryable: true,
          cause: error,
        });
      }
      if (!data) {
        throw new TranscriptSourceError({
          code: "transcript_not_available",
          message: "No human-verified transcript exists for this source.",
        });
      }

      if (
        !ACQUISITION_MODES.has(
          data.acquisition_mode as TranscriptAcquisitionMode,
        ) ||
        !RIGHTS_BASES.has(data.rights_basis as TranscriptRightsBasis) ||
        !data.reviewed_by ||
        !data.reviewed_at
      ) {
        return invalidProvenance(
          "The reviewed transcript row has incomplete approval metadata.",
        );
      }

      return {
        cues: parseCues(data.cues),
        metadata: {
          adapterId: data.adapter_id,
          provider: data.provider,
          acquisitionMode:
            data.acquisition_mode as TranscriptAcquisitionMode,
          trust: "approved",
          language: data.language,
          reviewStatus: "human_verified",
          sourceReference: data.source_reference,
          acquiredAt: data.reviewed_at,
          warnings: parseWarnings(data.warnings),
          provenance: {
            canonicalSourceUrl: data.canonical_source_url,
            rightsBasis: data.rights_basis as TranscriptRightsBasis,
            rightsReference: data.rights_reference,
            submittedByUserId: data.submitted_by,
            reviewedByUserId: data.reviewed_by,
            reviewedAt: data.reviewed_at,
            cueDigestSha256: data.cue_digest,
          },
        },
      };
    },
  };
}

export const supabaseReviewedTranscriptSource =
  createSupabaseReviewedTranscriptSource();
