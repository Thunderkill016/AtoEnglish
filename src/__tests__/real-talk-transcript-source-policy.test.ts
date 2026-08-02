import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import type {
  TranscriptSourceAdapter,
  TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";
import {
  acquireTranscriptForCompilation,
  resolveTranscriptSourcePolicy,
} from "@/features/real-talk/server/transcript-source-policy";
import { normalizeExperimentalYouTubeTranscriptItems } from "@/features/real-talk/server/transcript-sources/youtube-experimental";

const sourceResult: TranscriptSourceResult = {
  cues: [
    { text: "Hi there.", offset: 1, duration: 1 },
    { text: "How are you?", offset: 2, duration: 1 },
  ],
  metadata: {
    adapterId: "fixture",
    provider: "fixture",
    acquisitionMode: "approved_provider_api",
    trust: "approved",
    language: "en",
    reviewStatus: "machine_checked",
    sourceReference: "fixture://transcript",
    acquiredAt: "2026-08-02T00:00:00.000Z",
    warnings: [],
  },
};

const request = {
  sourceId: "abcdefghijk",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  requestedLanguage: "en",
};

function createAdapter(trust: "approved" | "experimental") {
  const acquire = vi.fn(async () => ({
    ...sourceResult,
    metadata: { ...sourceResult.metadata, trust },
  }));
  const adapter = {
    id: `${trust}-fixture`,
    trust,
    acquire,
  } satisfies TranscriptSourceAdapter;
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

  it("allows an approved adapter in production", async () => {
    const { adapter, acquire } = createAdapter("approved");

    await expect(
      acquireTranscriptForCompilation({
        adapter,
        request,
        environment: { NODE_ENV: "production" },
      }),
    ).resolves.toMatchObject({ cues: sourceResult.cues });
    expect(acquire).toHaveBeenCalledOnce();
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
    ).resolves.toMatchObject({ cues: sourceResult.cues });
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
