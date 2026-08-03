"use server";

import { headers } from "next/headers";

import { generatePrivateLesson } from "@/features/real-talk/application/generate-private-lesson";
import type { GenerateLessonResult as GenerateLessonResultContract } from "@/features/real-talk/domain/generation-result";
import {
  mapPersistedRealTalkDraft,
  mapRealTalkVideoRow,
} from "@/features/real-talk/server/draft-mapping";
import { persistOwnerPrivateDraft } from "@/features/real-talk/server/draft-repository";
import { compilePrivateNaturalLesson } from "@/features/real-talk/server/private-lesson-compiler";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type {
  RealTalkLesson,
  RealTalkLevel,
  RealTalkVideo,
} from "@/types/real-talk";

export type { GenerateLessonResult } from "@/features/real-talk/domain/generation-result";

const generateLimiter = createRateLimiter(5, 60 * 1000, "real-talk-generate");

export async function generateRealTalkLesson(
  youtubeUrl: string,
  level: RealTalkLevel = "A1",
): Promise<GenerateLessonResultContract> {
  return generatePrivateLesson(
    { youtubeUrl, level },
    {
      getAuthenticatedUserId: async () => {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        return error ? null : (user?.id ?? null);
      },
      checkRateLimit: async (userId) => {
        const requestHeaders = await headers();
        const ip =
          requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "127.0.0.1";
        const result = await generateLimiter.check(`${userId}:${ip}`);
        if (result.success) return { success: true };

        return {
          success: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((result.resetTime - Date.now()) / 1000),
          ),
        };
      },
      compile: compilePrivateNaturalLesson,
      persist: persistOwnerPrivateDraft,
    },
  );
}

export async function fetchCatalogVideos(): Promise<RealTalkVideo[]> {
  const { realTalkVideos } = await import("@/lib/data/real-talk/videos");

  try {
    const supabase = await createClient();
    const { data: dbVideos } = await supabase
      .from("real_talk_videos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (!dbVideos?.length) return realTalkVideos;

    const mappedDb = dbVideos.map(mapRealTalkVideoRow);
    const staticSlugs = new Set(realTalkVideos.map((video) => video.id));

    return [
      ...realTalkVideos,
      ...mappedDb.filter((video) => !staticSlugs.has(video.id)),
    ];
  } catch {
    return realTalkVideos;
  }
}

export async function fetchLessonBySlug(slug: string): Promise<{
  video?: RealTalkVideo;
  lesson?: RealTalkLesson;
}> {
  const { getRealTalkLesson, getRealTalkVideo } =
    await import("@/lib/data/real-talk/videos");
  const staticVideo = getRealTalkVideo(slug);
  const staticLesson = getRealTalkLesson(slug);
  if (staticVideo && staticLesson) {
    return { video: staticVideo, lesson: staticLesson };
  }

  try {
    const supabase = await createClient();
    const { data: videoRow } = await supabase
      .from("real_talk_videos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!videoRow) return {};

    const { data: lessonRow } = await supabase
      .from("real_talk_lessons")
      .select("*")
      .eq("video_id", videoRow.id)
      .maybeSingle();
    if (!lessonRow) return {};

    return mapPersistedRealTalkDraft(videoRow, lessonRow);
  } catch {
    return {};
  }
}
