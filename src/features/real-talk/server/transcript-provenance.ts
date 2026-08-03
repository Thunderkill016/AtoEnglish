import { createHash, timingSafeEqual } from "node:crypto";

import {
  TranscriptSourceError,
  type TranscriptAcquisitionMode,
  type TranscriptCue,
  type TranscriptRightsBasis,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SECRET_REFERENCE_PATTERN =
  /(?:access[_-]?token|authorization|api[_-]?key|signature|x-goog-signature|x-amz-signature)=/i;

const APPROVED_RIGHTS_BY_MODE: Record<
  Exclude<TranscriptAcquisitionMode, "experimental_unofficial">,
  readonly TranscriptRightsBasis[]
> = {
  creator_provided: ["creator_owned"],
  authorized_export: ["creator_owned", "authorized_editor_export"],
  licensed_source: ["explicit_license"],
  public_domain: ["public_domain"],
  human_reviewed_upload: [
    "creator_owned",
    "authorized_editor_export",
    "explicit_license",
    "public_domain",
  ],
  approved_provider_api: ["authorized_editor_export", "explicit_license"],
};

function provenanceFailure(
  message: string,
  code:
    | "transcript_provenance_invalid"
    | "transcript_integrity_mismatch" = "transcript_provenance_invalid",
): never {
  throw new TranscriptSourceError({ code, message });
}

function canonicalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      provenanceFailure("Approved transcript sources must use HTTPS URLs.");
    }
    url.hash = "";
    return url.toString();
  } catch (error) {
    if (error instanceof TranscriptSourceError) throw error;
    return provenanceFailure("Approved transcript source URL is invalid.");
  }
}

function assertSafeReference(value: string, label: string) {
  const normalized = value.trim();
  if (
    normalized.length < 1 ||
    normalized.length > 1_000 ||
    /[\r\n\0]/.test(normalized) ||
    SECRET_REFERENCE_PATTERN.test(normalized)
  ) {
    provenanceFailure(`${label} is missing, unsafe, or contains secret material.`);
  }
}

function normalizeCueForDigest(cue: TranscriptCue) {
  if (
    !Number.isFinite(cue.offset) ||
    cue.offset < 0 ||
    !Number.isFinite(cue.duration) ||
    cue.duration <= 0
  ) {
    provenanceFailure("Transcript cues contain invalid timing values.");
  }

  const text = cue.text.trim().replace(/\s+/g, " ");
  if (!text) provenanceFailure("Transcript cues contain empty text.");

  return {
    text,
    offset: Number(cue.offset.toFixed(3)),
    duration: Number(cue.duration.toFixed(3)),
  };
}

export function computeTranscriptCueDigest(cues: TranscriptCue[]): string {
  if (cues.length < 2) {
    provenanceFailure("Approved transcripts require at least two timed cues.");
  }

  const canonicalCues = cues.map(normalizeCueForDigest);
  return createHash("sha256")
    .update(JSON.stringify(canonicalCues), "utf8")
    .digest("hex");
}

function digestsMatch(expected: string, actual: string): boolean {
  if (!SHA256_PATTERN.test(expected) || !SHA256_PATTERN.test(actual)) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(actual, "hex"),
  );
}

export function assertTranscriptSourceResultTrusted(params: {
  adapter: TranscriptSourceAdapter;
  request: TranscriptSourceRequest;
  result: TranscriptSourceResult;
  now?: Date;
}) {
  const { adapter, request, result } = params;
  const { metadata } = result;

  if (metadata.adapterId !== adapter.id || metadata.trust !== adapter.trust) {
    provenanceFailure(
      "Transcript adapter identity or trust metadata does not match the executing adapter.",
    );
  }

  if (adapter.trust === "experimental") {
    if (metadata.acquisitionMode !== "experimental_unofficial") {
      provenanceFailure(
        "Experimental adapters must identify their acquisition mode as experimental_unofficial.",
      );
    }
    return;
  }

  if (metadata.acquisitionMode === "experimental_unofficial") {
    provenanceFailure(
      "An approved adapter cannot return experimental transcript metadata.",
    );
  }

  if (metadata.reviewStatus !== "human_verified") {
    provenanceFailure(
      "Approved transcript sources require human_verified review status.",
    );
  }

  const requestedLanguage = request.requestedLanguage.trim().toLowerCase();
  const actualLanguage = metadata.language.trim().toLowerCase();
  if (
    !actualLanguage ||
    (actualLanguage !== requestedLanguage &&
      !actualLanguage.startsWith(`${requestedLanguage}-`))
  ) {
    provenanceFailure(
      "Approved transcript language does not match the requested language.",
    );
  }

  assertSafeReference(metadata.sourceReference, "Transcript source reference");

  const provenance = metadata.provenance;
  if (!provenance) {
    provenanceFailure("Approved transcript metadata is missing provenance.");
  }

  if (
    canonicalizeUrl(provenance.canonicalSourceUrl) !==
    canonicalizeUrl(request.sourceUrl)
  ) {
    provenanceFailure(
      "Transcript provenance does not match the requested canonical source URL.",
    );
  }

  const allowedRights = APPROVED_RIGHTS_BY_MODE[metadata.acquisitionMode];
  if (!allowedRights.includes(provenance.rightsBasis)) {
    provenanceFailure(
      "Transcript rights basis is incompatible with the acquisition mode.",
    );
  }

  assertSafeReference(provenance.rightsReference, "Transcript rights reference");

  if (
    !UUID_PATTERN.test(provenance.submittedByUserId) ||
    !UUID_PATTERN.test(provenance.reviewedByUserId)
  ) {
    provenanceFailure(
      "Transcript submitter and reviewer must be server-derived user IDs.",
    );
  }

  if (provenance.submittedByUserId === provenance.reviewedByUserId) {
    provenanceFailure(
      "Approved transcript review requires a reviewer distinct from the submitter.",
    );
  }

  const reviewedAt = Date.parse(provenance.reviewedAt);
  const now = (params.now ?? new Date()).getTime();
  if (!Number.isFinite(reviewedAt) || reviewedAt > now + 5 * 60 * 1_000) {
    provenanceFailure("Transcript review timestamp is invalid or in the future.");
  }

  const expectedDigest = computeTranscriptCueDigest(result.cues);
  if (!digestsMatch(expectedDigest, provenance.cueDigestSha256)) {
    provenanceFailure(
      "Transcript cues no longer match the reviewed provenance digest.",
      "transcript_integrity_mismatch",
    );
  }
}
