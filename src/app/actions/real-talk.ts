"use server";

import { headers } from "next/headers";

import {
  generationFailure,
  type GenerateLessonResult,
} from "@/features/real-talk/domain/generation-result";
import { persistOwnerPrivateDraft } from "@/features/real-talk/server/draft-repository";
import { compilePrivateNaturalLesson } from "@/features/real-talk/server/private-lesson-compiler";
import { generateRealTalkInputSchema } from "@/lib/real-talk/generation-contract";
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
): Promise<GenerateLessonResult> {
  try {
    const input = generateRealTalkInputSchema.safeParse({ youtubeUrl, level });
    if (!input.success) {
      return generationFailure(
        "INVALID_INPUT",
        "Link YouTube hoặc cấp độ không hợp lệ.",
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return generationFailure(
        "AUTH_REQUIRED",
        "Bạn cần đăng nhập để tạo bài học bằng Gemini.",
      );
    }

    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const rateCheck = await generateLimiter.check(`${user.id}:${ip}`);
    if (!rateCheck.success) {
      return generationFailure(
        "RATE_LIMITED",
        "Bạn đang tạo quá nhiều bài. Hãy thử lại sau.",
        {
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((rateCheck.resetTime - Date.now()) / 1000),
          ),
        },
      );
    }

    const compiled = await compilePrivateNaturalLesson({
      youtubeUrl: input.data.youtubeUrl,
      level: input.data.level,
    });
    if (!compiled.success) return compiled;

    const persisted = await persistOwnerPrivateDraft({
      video: compiled.video,
      draft: compiled.draft,
      model: compiled.model,
      warnings: compiled.warnings,
      userId: user.id,
    });
    if (!persisted.success) return persisted;

    const warnings =
      persisted.lesson.generation?.warnings ?? compiled.warnings;

    return {
      success: true,
      status: "ai_draft",
      persisted: true,
      persistence: "saved_private_draft",
      video: persisted.video,
      lesson: persisted.lesson,
      warnings,
      source: {
        provider: "youtube",
        externalId: persisted.video.youtubeId,
        watchUrl: persisted.video.source?.watchUrl ?? input.data.youtubeUrl,
        embedUrl: `https://www.youtube.com/embed/${persisted.video.youtubeId}`,
        selectedStartSeconds: persisted.video.segment.startSeconds,
        selectedEndSeconds: persisted.video.segment.endSeconds,
        acquisitionMode: compiled.transcriptMetadata.acquisitionMode,
      },
      generation: {
        model: compiled.model,
        warnings,
      },
    };
  } catch {
    return generationFailure(
      "INTERNAL_ERROR",
      "Đã xảy ra lỗi nội bộ khi tạo bài học. Không có bản nháp nào được xác nhận là đã lưu.",
      { retryAfterSeconds: 30 },
    );
  }
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
