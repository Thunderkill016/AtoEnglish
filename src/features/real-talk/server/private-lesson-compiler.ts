import type { NaturalLessonPromptMetadata } from "@/features/real-talk/domain/lesson-prompt";
import {
  generationFailure,
  type GenerationFailure,
} from "@/features/real-talk/domain/generation-result";
import {
  TranscriptSourceError,
  type TranscriptSourceMetadata,
} from "@/features/real-talk/domain/transcript-source";
import { generateEvidenceBoundLessonWithGemini } from "@/features/real-talk/server/gemini-lesson-provider";
import { acquireTranscriptForCompilation } from "@/features/real-talk/server/transcript-source-policy";
import { experimentalYouTubeTranscriptSource } from "@/features/real-talk/server/transcript-sources/youtube-experimental";
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

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const queryId = url.searchParams.get("v");
      if (queryId && /^[\w-]{11}$/.test(queryId)) return queryId;

      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "v"].includes(parts[0] ?? "")) {
        const pathId = parts[1];
        return pathId && /^[\w-]{11}$/.test(pathId) ? pathId : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

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
          ? "Nguồn transcript thử nghiệm bị chặn trong production. Cần dùng nguồn caption đã được phê duyệt."
          : "Nguồn transcript thử nghiệm đang tắt. Chỉ bật trong dev/test bằng REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true.",
      );
    case "transcript_not_available":
      return generationFailure(
        "TRANSCRIPT_UNAVAILABLE",
        "Video này không có caption tiếng Anh có thể đọc được.",
      );
    case "transcript_too_short":
      return generationFailure(
        "TRANSCRIPT_INVALID",
        "Caption quá ngắn để tạo một bài hội thoại có ý nghĩa.",
      );
    case "transcript_provider_error":
      return generationFailure(
        "TRANSCRIPT_UNAVAILABLE",
        "Nguồn transcript tạm thời không khả dụng. Hãy thử lại hoặc dùng nguồn khác.",
        { retryAfterSeconds: 30 },
      );
    case "transcript_provenance_invalid":
      return generationFailure(
        "SOURCE_UNSUPPORTED",
        "Nguồn caption chưa có provenance và quyền sử dụng hợp lệ để được xem là nguồn đã phê duyệt.",
      );
    case "transcript_integrity_mismatch":
      return generationFailure(
        "TRANSCRIPT_INVALID",
        "Caption đã thay đổi sau lần review hoặc không khớp digest đã xác minh.",
      );
  }
}

export async function compilePrivateNaturalLesson(params: {
  youtubeUrl: string;
  level: RealTalkLevel;
}): Promise<PrivateLessonCompilationResult> {
  const videoId = extractYouTubeId(params.youtubeUrl);
  if (!videoId) {
    return generationFailure(
      "SOURCE_UNSUPPORTED",
      "Link không phải URL YouTube được hỗ trợ hoặc không chứa video ID hợp lệ.",
    );
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let transcript;
  try {
    transcript = await acquireTranscriptForCompilation({
      adapter: experimentalYouTubeTranscriptSource,
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
      "TRANSCRIPT_UNAVAILABLE",
      "Không thể lấy transcript từ nguồn đã chọn.",
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

  const fullDuration = Math.ceil(
    transcript.cues.reduce(
      (max, item) => Math.max(max, item.offset + item.duration),
      0,
    ),
  );
  const segmentStart = selectedSource[0]?.offset ?? 0;
  const segmentEnd = selectedSource.reduce(
    (max, item) => Math.max(max, item.offset + item.duration),
    segmentStart,
  );
  const warnings = [
    "Đây là bản nháp do AI tạo, chưa được người biên tập xác minh.",
    "Speaker labels được suy luận từ caption và có thể sai.",
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
    durationSeconds: fullDuration,
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
