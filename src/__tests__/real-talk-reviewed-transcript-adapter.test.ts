import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { acquireTranscriptForCompilation } from "@/features/real-talk/server/transcript-source-policy";
import { computeTranscriptCueDigest } from "@/features/real-talk/server/transcript-provenance";
import { createSupabaseReviewedTranscriptSource } from "@/features/real-talk/server/transcript-sources/supabase-reviewed";
import type { createClient } from "@/lib/supabase/server";

const request = {
  sourceId: "1000496",
  sourceUrl:
    "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm",
  requestedLanguage: "en",
};
const cues = [
  {
    text: "one big one left for the end of April,",
    offset: 21.317,
    duration: 2.222,
  },
  {
    text: "and it's going to be the Iwauni Incredible Race.",
    offset: 23.539,
    duration: 3.778,
  },
];

function clientWithRow(row: Record<string, unknown> | null, error: unknown = null) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(async () => ({ data: row, error })),
  };
  return {
    from: vi.fn(() => builder),
  } as unknown as Awaited<ReturnType<typeof createClient>>;
}

function approvedRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "12345678-1234-4234-8234-123456789abc",
    adapter_id: "supabase-reviewed-transcript-v1",
    provider: "wikimedia_commons",
    source_external_id: "1000496",
    canonical_source_url: request.sourceUrl,
    source_reference:
      "https://commons.wikimedia.org/wiki/TimedText:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm.en.srt",
    language: "en",
    acquisition_mode: "public_domain",
    rights_basis: "public_domain",
    rights_reference:
      "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm#Licensing",
    cues,
    cue_digest: computeTranscriptCueDigest(cues),
    review_status: "human_verified",
    submitted_by: "11111111-2222-4333-8444-555555555555",
    submitted_at: "2026-08-03T00:00:00.000Z",
    reviewed_by: "99999999-8888-4777-8666-555555555555",
    reviewed_at: "2026-08-03T00:05:00.000Z",
    warnings: ["Speaker labels require lesson-level review."],
    created_at: "2026-08-03T00:00:00.000Z",
    updated_at: "2026-08-03T00:05:00.000Z",
    ...overrides,
  };
}

describe("Supabase reviewed transcript adapter", () => {
  it("loads a reviewed row and passes the approved-only provenance gate", async () => {
    const client = clientWithRow(approvedRow());
    const adapter = createSupabaseReviewedTranscriptSource(async () => client);

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).resolves.toMatchObject({
      cues,
      metadata: {
        adapterId: "supabase-reviewed-transcript-v1",
        trust: "approved",
        acquisitionMode: "public_domain",
        reviewStatus: "human_verified",
        provenance: {
          rightsBasis: "public_domain",
          cueDigestSha256: computeTranscriptCueDigest(cues),
        },
      },
    });
    expect(client.from).toHaveBeenCalledWith("real_talk_transcript_sources");
  });

  it("returns transcript_not_available when no reviewed source exists", async () => {
    const adapter = createSupabaseReviewedTranscriptSource(async () =>
      clientWithRow(null),
    );

    await expect(adapter.acquire(request)).rejects.toMatchObject({
      code: "transcript_not_available",
    });
  });

  it("fails closed when the reviewed row is missing an independent reviewer", async () => {
    const adapter = createSupabaseReviewedTranscriptSource(async () =>
      clientWithRow(approvedRow({ reviewed_by: null })),
    );

    await expect(adapter.acquire(request)).rejects.toMatchObject({
      code: "transcript_provenance_invalid",
    });
  });

  it("detects cue changes after approval through the normal policy gate", async () => {
    const adapter = createSupabaseReviewedTranscriptSource(async () =>
      clientWithRow(
        approvedRow({
          cues: [cues[0], { ...cues[1], text: "changed after approval" }],
        }),
      ),
    );

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).rejects.toMatchObject({ code: "transcript_integrity_mismatch" });
  });
});
