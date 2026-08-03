import { writeFileSync } from "node:fs";

import {
  createClient as createHostedClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { PrivateLessonCompilationResult } from "@/features/real-talk/server/private-lesson-compiler";
import type { GeneratedLessonDraft } from "@/lib/real-talk/generation-contract";
import type { AppDatabase } from "@/types/app-database";
import type { RealTalkLevel, RealTalkVideo } from "@/types/real-talk";

const harness = vi.hoisted(() => ({
  client: null as unknown,
  compileCounts: {} as Record<string, number>,
  successVideoId: "M7lc1UVf-VE",
  failureVideoId: "dQw4w9WgXcQ",
}));

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({
      "x-forwarded-for": "127.0.0.1",
      "x-spec001-verification": "hosted-server-action",
    }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => {
    if (!harness.client) throw new Error("Hosted client is not initialized");
    return harness.client;
  },
}));

vi.mock(
  "@/features/real-talk/server/private-lesson-compiler",
  async () => ({
    compilePrivateNaturalLesson: async (params: {
      youtubeUrl: string;
      level: RealTalkLevel;
    }): Promise<PrivateLessonCompilationResult> => {
      const { privateDraftPreviewLesson, privateDraftPreviewVideo } =
        await import("@/__fixtures__/real-talk/private-draft-preview");

      const videoId = new URL(params.youtubeUrl).searchParams.get("v");
      if (!videoId) throw new Error("Controlled compiler received no video ID");

      const version = (harness.compileCounts[videoId] ?? 0) + 1;
      harness.compileCounts[videoId] = version;

      const video: RealTalkVideo = {
        ...structuredClone(privateDraftPreviewVideo),
        id: videoId,
        youtubeId: videoId,
        title: `Hosted server-action source v${version}`,
        titleVi: `Nguồn server action v${version}`,
        level: params.level,
        source: {
          watchUrl: params.youtubeUrl,
          metadataSource:
            privateDraftPreviewVideo.source?.metadataSource ?? "curated",
          transcriptSource:
            privateDraftPreviewVideo.source?.transcriptSource ?? "manual",
        },
      };

      const draftRecord = structuredClone(
        privateDraftPreviewLesson,
      ) as unknown as Record<string, unknown>;
      delete draftRecord.videoId;
      delete draftRecord.generation;
      draftRecord.title = `Hosted server-action lesson v${version}`;
      draftRecord.titleVi = `Bài server action v${version}`;
      draftRecord.level = params.level;
      draftRecord.estimatedMinutes =
        videoId === harness.failureVideoId ? -1 : 12 + version;

      return {
        success: true,
        video,
        draft: draftRecord as unknown as GeneratedLessonDraft,
        model: "spec001-controlled-compiler",
        warnings: [
          "Controlled compiler fixture; persistence and reload use hosted services.",
        ],
        transcriptMetadata: {
          adapterId: "spec001-controlled-compiler",
          provider: "controlled_fixture",
          acquisitionMode: "experimental_unofficial",
          trust: "experimental",
          language: "en",
          reviewStatus: "unreviewed",
          sourceReference: params.youtubeUrl,
          acquiredAt: "2026-08-03T00:00:00.000Z",
          warnings: ["Test-only transcript metadata."],
        },
      };
    },
  }),
);

import {
  fetchLessonBySlug,
  generateRealTalkLesson,
} from "@/app/actions/real-talk";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

let client: SupabaseClient<AppDatabase>;
let testUserId: string;

beforeAll(async () => {
  const supabaseUrl = requiredEnv("SPEC001_SUPABASE_URL");
  const publishableKey = requiredEnv("SPEC001_SUPABASE_PUBLISHABLE_KEY");
  const email = requiredEnv("SPEC001_TEST_EMAIL");
  const password = requiredEnv("SPEC001_TEST_PASSWORD");
  testUserId = requiredEnv("SPEC001_TEST_USER_ID");

  client = createHostedClient<AppDatabase>(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || data.user?.id !== testUserId) {
    throw new Error("Could not establish the bounded hosted Auth session");
  }
  harness.client = client;
});

afterAll(async () => {
  if (client) await client.auth.signOut();
  harness.client = null;
});

describe("Spec 001 real server action with hosted persistence", () => {
  it("updates one draft pair, reloads it, and rolls back a controlled lesson failure", async () => {
    const successUrl = `https://www.youtube.com/watch?v=${harness.successVideoId}`;
    const failureUrl = `https://www.youtube.com/watch?v=${harness.failureVideoId}`;

    const first = await generateRealTalkLesson(successUrl, "A1");
    const second = await generateRealTalkLesson(successUrl, "A1");

    expect(first).toMatchObject({
      success: true,
      persisted: true,
      status: "ai_draft",
    });
    expect(second).toMatchObject({
      success: true,
      persisted: true,
      status: "ai_draft",
    });
    if (!first.success || !second.success) {
      throw new Error("Expected two successful server-action results");
    }

    expect(second.video.id).toBe(first.video.id);
    expect(second.lesson.videoId).toBe(first.lesson.videoId);
    expect(second.video.title).toBe("Hosted server-action source v2");
    expect(second.lesson.title).toBe("Hosted server-action lesson v2");

    const { data: videoRows, error: videoError } = await client
      .from("real_talk_videos")
      .select("id, slug, title, youtube_id")
      .eq("created_by", testUserId)
      .eq("youtube_id", harness.successVideoId);
    expect(videoError).toBeNull();
    expect(videoRows).toHaveLength(1);
    expect(videoRows?.[0]?.title).toBe("Hosted server-action source v2");

    const persistedVideoId = videoRows?.[0]?.id;
    expect(persistedVideoId).toBeTruthy();

    const { data: lessonRows, error: lessonError } = await client
      .from("real_talk_lessons")
      .select("id, video_id, title")
      .eq("video_id", persistedVideoId ?? "");
    expect(lessonError).toBeNull();
    expect(lessonRows).toHaveLength(1);
    expect(lessonRows?.[0]?.title).toBe("Hosted server-action lesson v2");

    const reloaded = await fetchLessonBySlug(second.video.id);
    expect(reloaded.video).toMatchObject({
      id: second.video.id,
      youtubeId: harness.successVideoId,
      title: "Hosted server-action source v2",
    });
    expect(reloaded.lesson).toMatchObject({
      videoId: second.video.id,
      title: "Hosted server-action lesson v2",
    });

    const failed = await generateRealTalkLesson(failureUrl, "A1");
    expect(failed).toMatchObject({
      success: false,
      code: "DRAFT_PERSISTENCE_FAILED",
    });

    const { count: failedVideoCount, error: failedLookupError } = await client
      .from("real_talk_videos")
      .select("id", { count: "exact", head: true })
      .eq("created_by", testUserId)
      .eq("youtube_id", harness.failureVideoId);
    expect(failedLookupError).toBeNull();
    expect(failedVideoCount).toBe(0);

    const evidencePath = requiredEnv("SPEC001_EVIDENCE_PATH");
    writeFileSync(
      evidencePath,
      `${JSON.stringify(
        {
          realServerActionInvoked: true,
          realHostedAuthSession: true,
          repeatedGenerationSameVideoIdentity:
            second.video.id === first.video.id,
          repeatedGenerationSameLessonIdentity:
            second.lesson.videoId === first.lesson.videoId,
          hostedVideoRows: videoRows?.length ?? 0,
          hostedLessonRows: lessonRows?.length ?? 0,
          reloadObserved: Boolean(reloaded.video && reloaded.lesson),
          controlledPersistenceFailureCode: failed.success ? null : failed.code,
          failedWriteLeftNoVideo: failedVideoCount === 0,
          compilerBoundary: "controlled_fixture",
          persistenceBoundary: "real_hosted_rpc_rls",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  });
});
