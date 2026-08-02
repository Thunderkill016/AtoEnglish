import { describe, expect, it } from "vitest";

import { derivePrivateDraftSlug } from "@/features/real-talk/domain/draft-identity";
import {
  GENERATION_FAILURE_CODES,
  generationFailure,
} from "@/features/real-talk/domain/generation-result";

describe("Real Talk generation result contract", () => {
  it("keeps the documented failure-code set stable", () => {
    expect(GENERATION_FAILURE_CODES).toEqual([
      "AUTH_REQUIRED",
      "INVALID_INPUT",
      "RATE_LIMITED",
      "SOURCE_UNSUPPORTED",
      "TRANSCRIPT_UNAVAILABLE",
      "TRANSCRIPT_INVALID",
      "MODEL_UNAVAILABLE",
      "MODEL_RATE_LIMITED",
      "MODEL_OUTPUT_INVALID",
      "SOURCE_EVIDENCE_FAILED",
      "DRAFT_PERSISTENCE_FAILED",
      "INTERNAL_ERROR",
    ]);
  });

  it("deduplicates evidence failures and normalizes retry guidance", () => {
    expect(
      generationFailure("SOURCE_EVIDENCE_FAILED", "Unsupported content", {
        evidenceFailures: [
          "transcript_missing_source_evidence",
          "transcript_missing_source_evidence",
          "unknown_speaker_label",
        ],
        retryAfterSeconds: 1.2,
      }),
    ).toEqual({
      success: false,
      code: "SOURCE_EVIDENCE_FAILED",
      error: "Unsupported content",
      evidenceFailures: [
        "transcript_missing_source_evidence",
        "unknown_speaker_label",
      ],
      retryAfterSeconds: 2,
    });
  });
});

describe("Real Talk private draft identity", () => {
  const ownerId = "f4b2d4ee-f383-4b49-9f39-caf2d2627d0c";
  const youtubeId = "abcdefghijk";

  it("is deterministic for the same owner, source, and level", () => {
    const first = derivePrivateDraftSlug({ ownerId, youtubeId, level: "A1" });
    const second = derivePrivateDraftSlug({ ownerId, youtubeId, level: "A1" });

    expect(first).toBe(second);
    expect(first).toBe(
      "real-talk-abcdefghijk-a1-f4b2d4eef3834b499f39caf2d2627d0c",
    );
  });

  it("separates drafts by owner and requested level", () => {
    const base = derivePrivateDraftSlug({ ownerId, youtubeId, level: "A1" });
    const otherLevel = derivePrivateDraftSlug({
      ownerId,
      youtubeId,
      level: "B1",
    });
    const otherOwner = derivePrivateDraftSlug({
      ownerId: "52c7c14e-c52d-4dff-816e-2332e04c45c3",
      youtubeId,
      level: "A1",
    });

    expect(otherLevel).not.toBe(base);
    expect(otherOwner).not.toBe(base);
  });

  it("rejects invalid identity input", () => {
    expect(() =>
      derivePrivateDraftSlug({ ownerId: "", youtubeId, level: "A1" }),
    ).toThrow("Cannot derive a private draft identity");
    expect(() =>
      derivePrivateDraftSlug({ ownerId, youtubeId: "bad", level: "A1" }),
    ).toThrow("Cannot derive a private draft identity");
  });
});
