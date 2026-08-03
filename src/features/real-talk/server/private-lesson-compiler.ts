import type { NaturalLessonPromptMetadata } from "@/features/real-talk/domain/lesson-prompt";
import {
  generationFailure,
  type GenerationFailure,
} from "@/features/real-talk/domain/generation-result";
import {
  TranscriptSourceError,
  type TranscriptSourceMetadata,
} from "@/features/real-talk/domain/transcript-source";
import { extractYouTubeVideoId } from "@/features/real-talk/domain/youtube-source";
import { generateEvidenceBoundLessonWithGemini } from "@/features/real-talk/server/gemini-lesson-provider";
import { acquireTranscriptForCompilation } from "@/features/real-talk/server/transcript-source-policy";
import { geminiYouTubeVideoTranscriptSource } from "@/features/real-talk/server/transcript-sources/gemini-youtube-video";
import {
  selectConversationWindow,
  type GeneratedLessonDraft,
} from "@/lib/real-talk/generation-contract";
import type { RealTalkLevel, RealTalkVideo } from "@/types/real-talk";

const MAX_SOURCE_ITEMS = 80;
const MAX_SEGMENT_SECONDS = 180;

export type PrivateLessonCompilationResult =
  | {
      success: true;
      video: RealTalkVideo;
      draft: GeneratedLessonDraft;
      model: string;
      warnings: string[];
      transcriptMetadata: TranscriptSourceMetadata;
    }
  | GenerationFailure;

async function fetchYouTubeMetadata(
  videoId: string,
): Promise<NaturalLessonPromptMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const fallback: NaturalLessonPromptMetadata = {
    title: "YouTube conversation",
    channelName: "Unknown channel",
    channelUrl: watchUrl,
  };

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { signal: AbortSignal.timeout(6_000) },
    );
    if (!response.ok) return fallback;

    const data = (await response.json()) as {
      title?: string;
      author_name?: string;
      author_url?: string;
    };

    return {
      title: data.title?.trim() || fallback.title,
      channelName: data.author_name?.trim() || fallback.channelName,
      channelUrl: data.author_url?.startsWith("https://")
        ? data.author_url
        : watchUrl,
    };
  } catch {
    return fallback;
  }
}

export function mapTranscriptSourceError(
  error: TranscriptSourceError,
): GenerationFailure {
  switch (error.code) {
    case "transcript_source_policy_blocked":
      return generationFailure(
        "SOURCE_UNSUPPORTED",
        process.env.NODE_ENV === "production"
          ? "Gemini YouTube video preview chưa được bật cho private draft trong production."
          : "Gemini YouTube video preview đang tắt. Bật REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true trong dev/test.",
      );
    case "transcript_not_available":
      return generationFailure(
        "TRANSCRIPT_UNAVAILABLE",
        "Gemini không tìm thấy một đoạn hội thoại tiếng Anh phù hợp trong video công khai này.",
      );
    case "transcript_too_short":
      return generationFailure(
        "TRANSCRIPT_INVALID",
        "Đoạn lời thoại trích xuất quá ngắn để tạo bài học.",
      );
    case "transcript_provider_error":
      return generationFailure(
        "MODEL_UNAVAILABLE",
        "Gemini video analysis tạm thời không khả dụng. Hãy thử lại sau.",
        { retryAfterSeconds: error.retryable ? 30 : undefined },
      );
    case "transcript_provenance_invalid":
      return generationFailure(
        "SOURCE_UNSUPPORTED",
        "Nguồn video analysis chưa có provenance hợp lệ cho nội dung công khai.",
      );
    case "transcript_integrity_mismatch":
      return generationFailure(
        "TRANSCRIPT_INVALID",
        "Transcript không khớp digest đã xác minh.",
      );
  }
}

export async function compilePrivateNaturalLesson(params: {
  youtubeUrl: string;
  level: RealTalkLevel;
}): Promise<PrivateLessonCompilationResult> {
  const videoId = extractYouTubeVideoId(params.youtubeUrl);
  if (!videoId) {
    return generationFailure(
      "SOURCE_UNSUPPORTED",
      "Link không phải URL YouTube HTTPS được hỗ trợ.",
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return generationFailure(
      "MODEL_UNAVAILABLE",
      "Gemini chưa được cấu hình cho môi trường này.",
    );
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let transcript;
  try {
    transcript = await acquireTranscriptForCompilation({
      adapter: geminiYouTubeVideoTranscriptSource,
      useCase: "private_draft",
      request: {
        sourceId: videoId,
        sourceUrl: watchUrl,
        requestedLanguage: "en",
      },
    });
  } catch (error) {
    if (error instanceof TranscriptSourceError) {
      return mapTranscriptSourceError(error);
    }
    return generationFailure(
      "MODEL_UNAVAILABLE",
      "Không thể phân tích video bằng Gemini.",
      { retryAfterSeconds: 30 },
    );
  }

  const selectedSource = selectConversationWindow(transcript.cues, {
    maxDurationSeconds: MAX_SEGMENT_SECONDS,
    maxItems: MAX_SOURCE_ITEMS,
  });
  if (selectedSource.length < 2) {
    return generationFailure(
      "TRANSCRIPT_INVALID",
      "Không tìm thấy một đoạn hội thoại đủ rõ để tạo bài học.",
    );
  }

  const metadata = await fetchYouTubeMetadata(videoId);
  const generated = await generateEvidenceBoundLessonWithGemini({
    source: selectedSource,
    metadata,
    level: params.level,
  });
  if (!generated.success) return generated;

  const segmentStart = selectedSource[0]?.offset ?? 0;
  const segmentEnd = selectedSource.reduce(
    (max, item) => Math.max(max, item.offset + item.duration),
    segmentStart,
  );
  const warnings = [
    "Đây là bản nháp do AI tạo cho riêng bạn, chưa được biên tập viên xác minh.",
    "Transcript và timestamp được Gemini trích xuất trực tiếp từ video công khai; hãy đối chiếu với video gốc.",
    ...transcript.metadata.warnings,
  ];

  const video: RealTalkVideo = {
    id: videoId,
    youtubeId: videoId,
    title: metadata.title,
    titleVi: generated.draft.titleVi,
    channelName: metadata.channelName,
    channelUrl: metadata.channelUrl,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    durationSeconds: Math.ceil(segmentEnd),
    segment: {
      startSeconds: segmentStart,
      endSeconds: segmentEnd,
    },
    level: params.level,
    topics: generated.draft.topics,
    speakerCount: generated.draft.speakers.length,
    speakers: generated.draft.speakers,
    source: {
      watchUrl,
      metadataSource: "youtube_oembed",
      transcriptSource: "youtube_caption",
    },
  };

  return {
    success: true,
    video,
    draft: { ...generated.draft, level: params.level },
    model: generated.model,
    warnings,
    transcriptMetadata: transcript.metadata,
  };
}
