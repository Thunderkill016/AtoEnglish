import "server-only";

import { derivePrivateDraftSlug } from "@/features/real-talk/domain/draft-identity";
import {
  generationFailure,
  type GenerationFailure,
} from "@/features/real-talk/domain/generation-result";
import type { TranscriptSourceMetadata } from "@/features/real-talk/domain/transcript-source";
import type { GeneratedLessonDraft } from "@/lib/real-talk/generation-contract";
import { createClient } from "@/lib/supabase/server";
import type {
  RealTalkGenerationMetadata,
  RealTalkLesson,
  RealTalkVideo,
} from "@/types/real-talk";
import type { Json } from "@/types/supabase";

export type PersistPrivateDraftResult =
  | {
      success: true;
      video: RealTalkVideo;
      lesson: RealTalkLesson;
    }
  | GenerationFailure;

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

export async function persistOwnerPrivateDraft(params: {
  video: RealTalkVideo;
  draft: GeneratedLessonDraft;
  model: string;
  warnings: string[];
  transcriptMetadata: TranscriptSourceMetadata;
  userId: string;
}): Promise<PersistPrivateDraftResult> {
  const { video, draft, model, warnings, transcriptMetadata, userId } = params;
  const generatedAt = new Date().toISOString();
  const privateSlug = derivePrivateDraftSlug({
    ownerId: userId,
    youtubeId: video.youtubeId,
    level: video.level,
  });
  const privateVideo: RealTalkVideo = { ...video, id: privateSlug };
  const generation: RealTalkGenerationMetadata = {
    status: "ai_draft",
    model,
    generatedAt,
    persistence: "saved_private_draft",
    warnings,
  };
  const lesson = buildLesson(privateSlug, draft, generation);

  try {
    const supabase = await createClient();
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
          transcript_acquisition_mode: transcriptMetadata.acquisitionMode,
          transcript_review_status: transcriptMetadata.reviewStatus,
          transcript_source_metadata: transcriptMetadata as unknown as Json,
          transcript_cue_digest:
            transcriptMetadata.provenance?.cueDigestSha256 ?? null,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (videoError || !dbVideo) {
      return generationFailure(
        "DRAFT_PERSISTENCE_FAILED",
        "Không thể lưu nguồn của bản nháp vào tài khoản. Không có bài học nào được xác nhận là đã lưu.",
      );
    }

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

    if (lessonError) {
      return generationFailure(
        "DRAFT_PERSISTENCE_FAILED",
        "Nguồn đã được ghi riêng tư nhưng nội dung bài học chưa lưu hoàn chỉnh. Hãy thử lại trước khi rời trang.",
      );
    }

    return { success: true, video: privateVideo, lesson };
  } catch {
    return generationFailure(
      "DRAFT_PERSISTENCE_FAILED",
      "Không thể lưu bản nháp vào tài khoản do lỗi dữ liệu tạm thời. Hãy thử lại.",
      { retryAfterSeconds: 15 },
    );
  }
}
