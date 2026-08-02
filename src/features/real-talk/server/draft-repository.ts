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

function buildVideoPayload(params: {
  privateSlug: string;
  video: RealTalkVideo;
  transcriptMetadata: TranscriptSourceMetadata;
}): Json {
  const { privateSlug, video, transcriptMetadata } = params;

  return {
    slug: privateSlug,
    youtube_id: video.youtubeId,
    title: video.title,
    title_vi: video.titleVi,
    channel_name: video.channelName,
    channel_url: video.channelUrl,
    thumbnail_url: video.thumbnailUrl,
    duration_seconds: video.durationSeconds,
    segment_start: video.segment.startSeconds,
    segment_end: video.segment.endSeconds,
    level: video.level,
    topics: video.topics,
    speaker_count: video.speakerCount,
    speakers: video.speakers as unknown as Json,
    is_public: false,
    transcript_acquisition_mode: transcriptMetadata.acquisitionMode,
    transcript_review_status: transcriptMetadata.reviewStatus,
    transcript_source_metadata: transcriptMetadata as unknown as Json,
    transcript_cue_digest:
      transcriptMetadata.provenance?.cueDigestSha256 ?? null,
  };
}

function buildLessonPayload(params: {
  lesson: RealTalkLesson;
  model: string;
  warnings: string[];
}): Json {
  const { lesson, model, warnings } = params;

  return {
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
    generation_warnings: warnings,
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
    const { data, error } = await supabase.rpc(
      "upsert_real_talk_private_draft",
      {
        p_video: buildVideoPayload({
          privateSlug,
          video: privateVideo,
          transcriptMetadata,
        }),
        p_lesson: buildLessonPayload({ lesson, model, warnings }),
      },
    );

    if (error || !data?.[0]?.video_id || !data[0].lesson_id) {
      return generationFailure(
        "DRAFT_PERSISTENCE_FAILED",
        "Không thể lưu trọn vẹn bản nháp vào tài khoản. Giao dịch đã bị hủy và không có bản nháp nửa vời nào được xác nhận là đã lưu.",
        { retryAfterSeconds: 15 },
      );
    }

    return { success: true, video: privateVideo, lesson };
  } catch {
    return generationFailure(
      "DRAFT_PERSISTENCE_FAILED",
      "Không thể lưu bản nháp vào tài khoản do lỗi dữ liệu tạm thời. Giao dịch đã bị hủy; hãy thử lại.",
      { retryAfterSeconds: 15 },
    );
  }
}
