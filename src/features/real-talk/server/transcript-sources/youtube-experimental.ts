import {
  TranscriptSourceError,
  type TranscriptCue,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";

interface RawYouTubeTranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

const ADAPTER_ID = "youtube-transcript-unofficial-v1";

function sanitizeCaptionText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

export function normalizeExperimentalYouTubeTranscriptItems(
  items: readonly RawYouTubeTranscriptItem[],
): TranscriptCue[] {
  return items
    .filter(
      (item) =>
        typeof item.text === "string" &&
        Number.isFinite(item.offset) &&
        Number.isFinite(item.duration),
    )
    .map((item) => ({
      text: sanitizeCaptionText(item.text),
      offset: Math.max(0, item.offset / 1000),
      duration: Math.max(0.1, item.duration / 1000),
    }))
    .filter((item) => item.text.length > 0)
    .sort((left, right) => left.offset - right.offset);
}

function uniqueLanguageAttempts(requestedLanguage: string) {
  const attempts = [undefined, requestedLanguage, "en", "en-US"] as const;
  return attempts.filter(
    (language, index) => attempts.indexOf(language) === index,
  );
}

async function acquireYouTubeTranscript(
  request: TranscriptSourceRequest,
): Promise<TranscriptSourceResult> {
  const { YoutubeTranscript } = await import("youtube-transcript");
  let selectedLanguage = "auto";
  let rawItems: RawYouTubeTranscriptItem[] | null = null;
  let lastError: unknown;
  let providerResponded = false;

  for (const language of uniqueLanguageAttempts(request.requestedLanguage)) {
    try {
      const items = language
        ? await YoutubeTranscript.fetchTranscript(request.sourceId, {
            lang: language,
          })
        : await YoutubeTranscript.fetchTranscript(request.sourceId);
      providerResponded = true;

      if (items.length > 0) {
        rawItems = items;
        selectedLanguage = language ?? "auto";
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (!rawItems?.length) {
    if (!providerResponded && lastError) {
      throw new TranscriptSourceError({
        code: "transcript_provider_error",
        message: "The experimental YouTube transcript provider failed.",
        retryable: true,
        cause: lastError,
      });
    }

    throw new TranscriptSourceError({
      code: "transcript_not_available",
      message: "No readable English caption track was returned.",
    });
  }

  const cues = normalizeExperimentalYouTubeTranscriptItems(rawItems);
  if (cues.length < 2) {
    throw new TranscriptSourceError({
      code: "transcript_too_short",
      message: "The returned caption track is too short for lesson generation.",
    });
  }

  return {
    cues,
    metadata: {
      adapterId: ADAPTER_ID,
      provider: "youtube-transcript",
      acquisitionMode: "experimental_unofficial",
      trust: "experimental",
      language: selectedLanguage,
      reviewStatus: "unreviewed",
      sourceReference: request.sourceUrl,
      acquiredAt: new Date().toISOString(),
      warnings: [
        "Transcript được lấy qua adapter YouTube không chính thức và chưa được duyệt cho production.",
        "Caption, ngôn ngữ, speaker attribution và timestamp chưa được con người xác minh.",
        "Khả năng truy cập caption không chứng minh quyền lưu trữ hoặc tạo nội dung phái sinh.",
      ],
    },
  };
}

export const experimentalYouTubeTranscriptSource: TranscriptSourceAdapter = {
  id: ADAPTER_ID,
  trust: "experimental",
  acquire: acquireYouTubeTranscript,
};
