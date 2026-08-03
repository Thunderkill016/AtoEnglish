import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type {
  TranscriptSourceAdapter,
  TranscriptSourceMetadata,
  TranscriptSourceResult,
  TranscriptSourceTrust,
} from "@/features/real-talk/domain/transcript-source";
import {
  acquireTranscriptForCompilation,
  resolveTranscriptSourcePolicy,
} from "@/features/real-talk/server/transcript-source-policy";
import { computeTranscriptCueDigest } from "@/features/real-talk/server/transcript-provenance";
import { normalizeExperimentalYouTubeTranscriptItems } from "@/features/real-talk/server/transcript-sources/youtube-experimental";

const cues = [
  { text: "Hi there.", offset: 1, duration: 1 },
  { text: "How are you?", offset: 2, duration: 1 },
];

const request = {
  sourceId: "abcdefghijk",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  requestedLanguage: "en",
};

function approvedMetadata(adapterId: string): TranscriptSourceMetadata {
  return {
    adapterId,
    provider: "fixture",
    acquisitionMode: "authorized_export",
    trust: "approved",
    language: "en",
    reviewStatus: "human_verified",
    sourceReference: "youtube-studio-export:caption-track-123",
    acquiredAt: "2026-08-02T00:00:00.000Z",
    warnings: [],
    provenance: {
      canonicalSourceUrl: request.sourceUrl,
      rightsBasis: "authorized_editor_export",
      rightsReference: "rights-review:real-talk-source-123",
      submittedByUserId: "11111111-2222-4333-8444-555555555555",
      reviewedByUserId: "99999999-8888-4777-8666-555555555555",
      reviewedAt: "2026-08-02T01:00:00.000Z",
      cueDigestSha256: computeTranscriptCueDigest(cues),
    },
  };
}

function createAdapter(
  trust: TranscriptSourceTrust,
  metadataOverride: Partial<TranscriptSourceMetadata> = {},
  resultCues = cues,
) {
  const id = `${trust}-fixture`;
  const metadata: TranscriptSourceMetadata =
    trust === "approved"
      ? { ...approvedMetadata(id), ...metadataOverride }
      : {
          adapterId: id,
          provider: "fixture",
          acquisitionMode: "experimental_unofficial",
          trust: "experimental",
          language: "en",
          reviewStatus: "unreviewed",
          sourceReference: request.sourceUrl,
          acquiredAt: "2026-08-02T00:00:00.000Z",
          warnings: ["Experimental fixture."],
          ...metadataOverride,
        };

  const sourceResult: TranscriptSourceResult = {
    cues: resultCues,
    metadata,
  };
  const acquire = vi.fn(async () => sourceResult);
  const adapter = { id, trust, acquire } satisfies TranscriptSourceAdapter;
  return { adapter, acquire };
}

describe("Real Talk transcript source policy", () => {
  it("defaults to approved-only outside production", () => {
    expect(resolveTranscriptSourcePolicy({ NODE_ENV: "development" })).toEqual({
      runtime: "non_production",
      experimentalFlagEnabled: false,
      mode: "approved_only",
    });
  });

  it("allows a human-verified approved adapter with matching provenance in production", async () => {
    const { adapter, acquire } = createAdapter("approved");

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).resolves.toMatchObject({ cues });
    expect(acquire).toHaveBeenCalledOnce();
  });

  it("rejects an approved adapter that omits provenance", async () => {
    const { adapter } = createAdapter("approved", { provenance: undefined });

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_provenance_invalid" });
  });

  it("rejects adapter metadata that does not match the executing adapter", async () => {
    const { adapter } = createAdapter("approved", {
      adapterId: "forged-approved-adapter",
    });

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_provenance_invalid" });
  });

  it("rejects self-review for an approved transcript", async () => {
    const metadata = approvedMetadata("approved-fixture");
    const { adapter } = createAdapter("approved", {
      provenance: {
        ...metadata.provenance!,
        reviewedByUserId: metadata.provenance!.submittedByUserId,
      },
    });

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_provenance_invalid" });
  });

  it("rejects secret-bearing rights references", async () => {
    const metadata = approvedMetadata("approved-fixture");
    const { adapter } = createAdapter("approved", {
      provenance: {
        ...metadata.provenance!,
        rightsReference: "https://example.com/review?access_token=secret",
      },
    });

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_provenance_invalid" });
  });

  it("rejects cues changed after human review", async () => {
    const changedCues = [
      cues[0],
      { ...cues[1], text: "This text changed after review." },
    ];
    const { adapter } = createAdapter("approved", {}, changedCues);

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_integrity_mismatch" });
  });

  it("blocks an experimental adapter unless non-production explicitly opts in", async () => {
    const { adapter, acquire } = createAdapter("experimental");

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "development" },
      }),
    ).rejects.toMatchObject({ code: "transcript_source_policy_blocked" });
    expect(acquire).not.toHaveBeenCalled();
  });

  it("allows an experimental adapter only with the non-production flag", async () => {
    const { adapter, acquire } = createAdapter("experimental");

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: {
          NODE_ENV: "test",
          REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS: "true",
        },
      }),
    ).resolves.toMatchObject({ cues });
    expect(acquire).toHaveBeenCalledOnce();
  });

  it("blocks an experimental adapter in production even when the flag is set", async () => {
    const { adapter, acquire } = createAdapter("experimental");

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: {
          NODE_ENV: "production",
          REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS: "true",
        },
      }),
    ).rejects.toMatchObject({ code: "transcript_source_policy_blocked" });
    expect(acquire).not.toHaveBeenCalled();
  });

  it("normalizes, bounds, sorts, and rejects invalid experimental provider cues", () => {
    expect(
      normalizeExperimentalYouTubeTranscriptItems([
        {
          text: "  <b>Hello</b> &amp; welcome  ",
          offset: 3_000,
          duration: 0,
        },
        {
          text: "invalid timing",
          offset: Number.NaN,
          duration: 1_000,
        },
        {
          text: "How are you?",
          offset: 1_000,
          duration: 2_000,
        },
      ]),
    ).toEqual([
      { text: "How are you?", offset: 1, duration: 2 },
      { text: "Hello & welcome", offset: 3, duration: 0.1 },
    ]);
  });

  it("keeps the server action from importing the unofficial package directly", () => {
    const actionSource = readFileSync(
      join(process.cwd(), "src/app/actions/real-talk.ts"),
      "utf8",
    );
    const compilerSource = readFileSync(
      join(
        process.cwd(),
        "src/features/real-talk/server/private-lesson-compiler.ts",
      ),
      "utf8",
    );

    expect(actionSource).not.toContain("youtube-transcript");
    expect(actionSource).toContain("compilePrivateNaturalLesson");
    expect(compilerSource).toContain("acquireTranscriptForCompilation");
    expect(compilerSource).toContain("experimentalYouTubeTranscriptSource");
  });
});
