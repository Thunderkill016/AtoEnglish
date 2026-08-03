import { describe, expect, it, vi } from "vitest";

import {
  generatePrivateLesson,
  type GeneratePrivateLessonDependencies,
} from "@/features/real-talk/application/generate-private-lesson";
import { generationFailure } from "@/features/real-talk/domain/generation-result";
import type { GeneratedLessonDraft } from "@/lib/real-talk/generation-contract";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

const OWNER_ID = "11111111-2222-4333-8444-555555555555";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=abcdefghijk";

const sourceVideo: RealTalkVideo = {
  id: "source-draft",
  youtubeId: "abcdefghijk",
  title: "Natural conversation",
  titleVi: "Cuộc trò chuyện tự nhiên",
  channelName: "Fixture channel",
  channelUrl: "https://www.youtube.com/@fixture",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  durationSeconds: 120,
  segment: { startSeconds: 20, endSeconds: 80 },
  level: "A1",
  topics: ["introductions"],
  speakerCount: 2,
  speakers: [
    { label: "Speaker A", color: "#60a5fa" },
    { label: "Speaker B", color: "#34d399" },
  ],
  source: {
    watchUrl: YOUTUBE_URL,
    metadataSource: "youtube_oembed",
    transcriptSource: "youtube_caption",
  },
};

const generatedDraft = {} as GeneratedLessonDraft;

const persistedLesson = {
  videoId: "real-talk-abcdefghijk-a1-owner",
  title: "Meeting someone new",
  titleVi: "Làm quen với người mới",
  level: "A1",
  generation: {
    status: "ai_draft",
    model: "gemini-test",
    generatedAt: "2026-08-02T00:00:00.000Z",
    persistence: "saved_private_draft",
    warnings: ["Cần người biên tập kiểm tra."],
  },
} as RealTalkLesson;

const persistedVideo: RealTalkVideo = {
  ...sourceVideo,
  id: "real-talk-abcdefghijk-a1-owner",
};

const compiledSuccess = {
  success: true as const,
  video: sourceVideo,
  draft: generatedDraft,
  model: "gemini-test",
  warnings: ["Cần người biên tập kiểm tra."],
  transcriptMetadata: {
    adapterId: "fixture-approved",
    provider: "fixture",
    acquisitionMode: "approved_provider_api" as const,
    trust: "approved" as const,
    language: "en",
    reviewStatus: "machine_checked" as const,
    sourceReference: YOUTUBE_URL,
    acquiredAt: "2026-08-02T00:00:00.000Z",
    warnings: [],
  },
};

const persistedSuccess = {
  success: true as const,
  video: persistedVideo,
  lesson: persistedLesson,
  persistedIds: {
    video_id: "11111111-2222-4333-8444-555555555555",
    lesson_id: "66666666-7777-4888-8999-000000000000",
  },
};

function createDependencies(
  overrides: Partial<GeneratePrivateLessonDependencies> = {},
) {
  const calls: string[] = [];
  const dependencies: GeneratePrivateLessonDependencies = {
    getAuthenticatedUserId: vi.fn(async () => {
      calls.push("auth");
      return OWNER_ID;
    }),
    checkRateLimit: vi.fn(async () => {
      calls.push("rate");
      return { success: true };
    }),
    compile: vi.fn(async () => {
      calls.push("compile");
      return compiledSuccess;
    }),
    persist: vi.fn(async () => {
      calls.push("persist");
      return persistedSuccess;
    }),
    ...overrides,
  };

  return { calls, dependencies };
}

describe("Real Talk generation application orchestration", () => {
  it("returns a complete saved private draft on the mocked happy path", async () => {
    const { calls, dependencies } = createDependencies();

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toMatchObject({
      success: true,
      status: "ai_draft",
      persisted: true,
      persistence: "saved_private_draft",
      video: { id: persistedVideo.id, youtubeId: "abcdefghijk" },
      source: {
        externalId: "abcdefghijk",
        acquisitionMode: "approved_provider_api",
      },
      generation: { model: "gemini-test" },
    });
    expect(calls).toEqual(["auth", "rate", "compile", "persist"]);
  });

  it("rejects anonymous generation before any paid or external work", async () => {
    const { dependencies } = createDependencies({
      getAuthenticatedUserId: vi.fn(async () => null),
    });

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toMatchObject({ success: false, code: "AUTH_REQUIRED" });
    expect(dependencies.checkRateLimit).not.toHaveBeenCalled();
    expect(dependencies.compile).not.toHaveBeenCalled();
    expect(dependencies.persist).not.toHaveBeenCalled();
  });

  it("rejects invalid input before auth or external work", async () => {
    const { dependencies } = createDependencies();

    const result = await generatePrivateLesson(
      { youtubeUrl: "not-a-youtube-url", level: "A1" },
      dependencies,
    );

    expect(result).toMatchObject({ success: false, code: "INVALID_INPUT" });
    expect(dependencies.getAuthenticatedUserId).not.toHaveBeenCalled();
    expect(dependencies.compile).not.toHaveBeenCalled();
    expect(dependencies.persist).not.toHaveBeenCalled();
  });

  it("stops before compilation when rate limited", async () => {
    const { dependencies } = createDependencies({
      checkRateLimit: vi.fn(async () => ({
        success: false,
        retryAfterSeconds: 17,
      })),
    });

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toMatchObject({
      success: false,
      code: "RATE_LIMITED",
      retryAfterSeconds: 17,
    });
    expect(dependencies.compile).not.toHaveBeenCalled();
    expect(dependencies.persist).not.toHaveBeenCalled();
  });

  it.each([
    generationFailure("MODEL_RATE_LIMITED", "Gemini đang vượt quota.", {
      retryAfterSeconds: 60,
    }),
    generationFailure("MODEL_OUTPUT_INVALID", "Gemini trả JSON không hợp lệ."),
    generationFailure("MODEL_UNAVAILABLE", "Không thể kết nối tới Gemini.", {
      retryAfterSeconds: 30,
    }),
    generationFailure(
      "SOURCE_EVIDENCE_FAILED",
      "Nội dung AI không có đủ bằng chứng trong transcript.",
      { evidenceFailures: ["transcript_missing_source_evidence"] },
    ),
  ])("propagates compiler failure without writing a draft", async (failure) => {
    const { dependencies } = createDependencies({
      compile: vi.fn(async () => failure),
    });

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toEqual(failure);
    expect(dependencies.persist).not.toHaveBeenCalled();
  });

  it("returns persistence failure instead of preview or saved success", async () => {
    const failure = generationFailure(
      "DRAFT_PERSISTENCE_FAILED",
      "Không thể lưu bản nháp.",
      { retryAfterSeconds: 15 },
    );
    const { dependencies } = createDependencies({
      persist: vi.fn(async () => failure),
    });

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toEqual(failure);
  });

  it("bounds unexpected dependency exceptions", async () => {
    const { dependencies } = createDependencies({
      compile: vi.fn(async () => {
        throw new Error("secret provider detail");
      }),
    });

    const result = await generatePrivateLesson(
      { youtubeUrl: YOUTUBE_URL, level: "A1" },
      dependencies,
    );

    expect(result).toMatchObject({
      success: false,
      code: "INTERNAL_ERROR",
      retryAfterSeconds: 30,
    });
    if (!result.success) {
      expect(result.error).not.toContain("secret provider detail");
    }
    expect(dependencies.persist).not.toHaveBeenCalled();
  });
});
