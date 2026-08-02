"use server";

import { headers } from "next/headers";

import { compilePrivateNaturalLesson } from "@/features/real-talk/server/private-lesson-compiler";
import {
  generateRealTalkInputSchema,
  type GeneratedLessonDraft,
} from "@/lib/real-talk/generation-contract";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type {
  RealTalkGenerationMetadata,
  RealTalkLesson,
  RealTalkLevel,
  RealTalkVideo,
} from "@/types/real-talk";
import type { Json } from "@/types/supabase";

const generateLimiter = createRateLimiter(5, 60 * 1000, "real-talk-generate");

export interface GenerateLessonResult {
  success: boolean;
  video?: RealTalkVideo;
  lesson?: RealTalkLesson;
  persistence?: "preview_only" | "saved_private_draft";
  warnings?: string[];
  error?: string;
}

function buildLesson(
  videoId: string,
  draft: GeneratedLessonDraft,
  generation: RealTalkGenerationMetadata,
): RealTalkLesson {
  return {
    videoId,
    title: draft.title,
    titleVi: draft.titleVi,
    level: draft.level,
    estimatedMinutes: draft.estimatedMinutes,
    canDoStatement: draft.canDoStatement,
    canDoStatementVi: draft.canDoStatementVi,
    transcript: draft.transcript,
    preWatch: draft.preWatch,
    whileWatch: draft.whileWatch,
    postWatch: draft.postWatch,
    environment: draft.environment,
    communicationEvents: draft.communicationEvents,
    transferTask: draft.transferTask,
    generation,
  };
}

async function persistOwnerPrivateDraft(params: {
  video: RealTalkVideo;
  draft: GeneratedLessonDraft;
  model: string;
  warnings: string[];
  userId: string;
}): Promise<{
  persistence: "preview_only" | "saved_private_draft";
  video: RealTalkVideo;
  lesson: RealTalkLesson;
}> {
  const { video, draft, model, warnings, userId } = params;
  const generatedAt = new Date().toISOString();
  const previewGeneration: RealTalkGenerationMetadata = {
    status: "ai_draft",
    model,
    generatedAt,
    persistence: "preview_only",
    warnings,
  };

  try {
    const supabase = await createClient();
    const privateSlug = `${video.id}-${userId.slice(0, 8)}`;
    const privateVideo: RealTalkVideo = { ...video, id: privateSlug };

    const { data: dbVideo, error: videoError } = await supabase
      .from("real_talk_videos")
      .upsert(
        {
          slug: privateSlug,
          youtube_id: privateVideo.youtubeId,
          title: privateVideo.title,
          title_vi: privateVideo.titleVi,
          channel_name: privateVideo.channelName,
          channel_url: privateVideo.channelUrl,
          thumbnail_url: privateVideo.thumbnailUrl,
          duration_seconds: privateVideo.durationSeconds,
          segment_start: privateVideo.segment.startSeconds,
          segment_end: privateVideo.segment.endSeconds,
          level: privateVideo.level,
          topics: privateVideo.topics,
          speaker_count: privateVideo.speakerCount,
          speakers: privateVideo.speakers as unknown as Json,
          created_by: userId,
          is_public: false,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (videoError || !dbVideo) {
      throw videoError ?? new Error("Missing private video id");
    }

    const generation: RealTalkGenerationMetadata = {
      ...previewGeneration,
      persistence: "saved_private_draft",
    };
    const lesson = buildLesson(privateSlug, draft, generation);
    const { error: lessonError } = await supabase
      .from("real_talk_lessons")
      .upsert(
        {
          video_id: dbVideo.id,
          title: lesson.title,
          title_vi: lesson.titleVi,
          level: lesson.level,
          estimated_minutes: lesson.estimatedMinutes,
          can_do_statement: lesson.canDoStatement,
          can_do_statement_vi: lesson.canDoStatementVi,
          transcript: lesson.transcript as unknown as Json,
          pre_watch: lesson.preWatch as unknown as Json,
          while_watch: lesson.whileWatch as unknown as Json,
          post_watch: lesson.postWatch as unknown as Json,
          environment: lesson.environment as unknown as Json,
          communication_events: lesson.communicationEvents as unknown as Json,
          transfer_task: lesson.transferTask as unknown as Json,
          generation_model: model,
          generation_status: "ai_draft",
          generation_warnings: warnings as unknown as Json,
          reviewed_at: null,
          reviewed_by: null,
        },
        { onConflict: "video_id" },
      );

    if (lessonError) throw lessonError;

    return {
      persistence: "saved_private_draft",
      video: privateVideo,
      lesson,
    };
  } catch (error) {
    console.error("[Real Talk] Private draft persistence failed:", error);
    const fallbackWarnings = [
      ...warnings,
      "Không lưu được bản nháp vào tài khoản; bản xem trước vẫn dùng được trong phiên hiện tại.",
    ];
    return {
      persistence: "preview_only",
      video,
      lesson: buildLesson(video.id, draft, {
        ...previewGeneration,
        warnings: fallbackWarnings,
      }),
    };
  }
}

export async function generateRealTalkLesson(
  youtubeUrl: string,
  level: RealTalkLevel = "A1",
): Promise<GenerateLessonResult> {
  try {
    const input = generateRealTalkInputSchema.safeParse({ youtubeUrl, level });
    if (!input.success) {
      return {
        success: false,
        error: "Link YouTube hoặc cấp độ không hợp lệ.",
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để tạo bài học bằng Gemini.",
      };
    }

    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const rateCheck = await generateLimiter.check(`${user.id}:${ip}`);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Bạn đang tạo quá nhiều bài. Hãy thử lại sau một phút.",
      };
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

    return {
      success: true,
      video: persisted.video,
      lesson: persisted.lesson,
      persistence: persisted.persistence,
      warnings: persisted.lesson.generation?.warnings ?? compiled.warnings,
    };
  } catch (error) {
    console.error("[Real Talk] generateRealTalkLesson error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi tạo bài học: ${error.message}`
          : "Đã xảy ra lỗi khi tạo bài học.",
    };
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
