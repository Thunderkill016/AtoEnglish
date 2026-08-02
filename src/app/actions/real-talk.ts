"use server";

import { headers } from "next/headers";

import { generatePrivateLesson } from "@/features/real-talk/application/generate-private-lesson";
import type { GenerateLessonResult as GenerateLessonResultContract } from "@/features/real-talk/domain/generation-result";
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

    const mappedDb: RealTalkVideo[] = dbVideos.map((video) => ({
      id: video.slug,
      youtubeId: video.youtube_id,
      title: video.title,
      titleVi: video.title_vi,
      channelName: video.channel_name ?? "Unknown channel",
      channelUrl:
        video.channel_url ??
        `https://www.youtube.com/watch?v=${video.youtube_id}`,
      thumbnailUrl:
        video.thumbnail_url ??
        `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`,
      durationSeconds: video.duration_seconds,
      segment: {
        startSeconds: Number(video.segment_start ?? 0),
        endSeconds: Number(video.segment_end ?? video.duration_seconds),
      },
      level: (video.level as RealTalkLevel) || "A1",
      topics: video.topics ?? [],
      speakerCount: video.speaker_count ?? 2,
      speakers: video.speakers as unknown as RealTalkVideo["speakers"],
      source: {
        watchUrl: `https://www.youtube.com/watch?v=${video.youtube_id}`,
        metadataSource: "youtube_oembed",
        transcriptSource: "youtube_caption",
      },
    }));

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

    const video: RealTalkVideo = {
      id: videoRow.slug,
      youtubeId: videoRow.youtube_id,
      title: videoRow.title,
      titleVi: videoRow.title_vi,
      channelName: videoRow.channel_name ?? "Unknown channel",
      channelUrl:
        videoRow.channel_url ??
        `https://www.youtube.com/watch?v=${videoRow.youtube_id}`,
      thumbnailUrl:
        videoRow.thumbnail_url ??
        `https://i.ytimg.com/vi/${videoRow.youtube_id}/hqdefault.jpg`,
      durationSeconds: videoRow.duration_seconds,
      segment: {
        startSeconds: Number(videoRow.segment_start ?? 0),
        endSeconds: Number(
          videoRow.segment_end ?? videoRow.duration_seconds,
        ),
      },
      level: (videoRow.level as RealTalkLevel) || "A1",
      topics: videoRow.topics ?? [],
      speakerCount: videoRow.speaker_count ?? 2,
      speakers: videoRow.speakers as unknown as RealTalkVideo["speakers"],
      source: {
        watchUrl: `https://www.youtube.com/watch?v=${videoRow.youtube_id}`,
        metadataSource: "youtube_oembed",
        transcriptSource: "youtube_caption",
      },
    };

    const status = lessonRow.generation_status as
      | "ai_draft"
      | "human_reviewed"
      | "approved";
    const warnings = Array.isArray(lessonRow.generation_warnings)
      ? lessonRow.generation_warnings.filter(
          (warning): warning is string => typeof warning === "string",
        )
      : [];

    const lesson: RealTalkLesson = {
      videoId: video.id,
      title: lessonRow.title,
      titleVi: lessonRow.title_vi,
      level: (lessonRow.level as RealTalkLevel) || "A1",
      estimatedMinutes: lessonRow.estimated_minutes ?? 15,
      canDoStatement: lessonRow.can_do_statement ?? "",
      canDoStatementVi: lessonRow.can_do_statement_vi ?? "",
      transcript:
        lessonRow.transcript as unknown as RealTalkLesson["transcript"],
      preWatch: lessonRow.pre_watch as unknown as RealTalkLesson["preWatch"],
      whileWatch:
        lessonRow.while_watch as unknown as RealTalkLesson["whileWatch"],
      postWatch:
        lessonRow.post_watch as unknown as RealTalkLesson["postWatch"],
      environment:
        lessonRow.environment as unknown as RealTalkLesson["environment"],
      communicationEvents:
        lessonRow.communication_events as unknown as RealTalkLesson["communicationEvents"],
      transferTask:
        lessonRow.transfer_task as unknown as RealTalkLesson["transferTask"],
      generation: {
        status,
        model: lessonRow.generation_model ?? "unknown",
        generatedAt: lessonRow.created_at,
        persistence: "saved_private_draft",
        warnings,
      },
    };

    return { video, lesson };
  } catch {
    return {};
  }
}
