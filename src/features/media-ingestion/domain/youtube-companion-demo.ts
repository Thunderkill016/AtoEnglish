export type YouTubeLicense = "youtube" | "creativeCommon";

export interface YouTubeCompanionMetadata {
  sourceMode: "youtube_companion";
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  durationIso8601: string;
  embeddable: boolean;
  license: YouTubeLicense;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string | null;
}

interface YouTubeVideosListResponse {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      channelTitle?: string;
      publishedAt?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
    status?: {
      embeddable?: boolean;
      license?: YouTubeLicense;
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function assertVideoId(candidate: string | null): string {
  if (!candidate || !VIDEO_ID_PATTERN.test(candidate)) {
    throw new Error("Không tìm thấy YouTube video ID hợp lệ trong URL.");
  }

  return candidate;
}

export function extractYouTubeVideoId(input: string): string {
  const trimmed = input.trim();

  if (VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("YouTube URL không hợp lệ.");
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (hostname === "youtu.be") {
    return assertVideoId(url.pathname.split("/").filter(Boolean)[0] ?? null);
  }

  if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
    throw new Error("Chỉ chấp nhận URL thuộc youtube.com hoặc youtu.be.");
  }

  if (url.pathname === "/watch") {
    return assertVideoId(url.searchParams.get("v"));
  }

  const [first, second] = url.pathname.split("/").filter(Boolean);
  if (["embed", "shorts", "live"].includes(first ?? "")) {
    return assertVideoId(second ?? null);
  }

  throw new Error("Định dạng YouTube URL chưa được hỗ trợ.");
}

function pickThumbnail(
  thumbnails: NonNullable<
    NonNullable<YouTubeVideosListResponse["items"]>[number]["snippet"]
  >["thumbnails"],
): string | null {
  return (
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    null
  );
}

export async function fetchYouTubeCompanionMetadata(
  input: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<YouTubeCompanionMetadata> {
  const normalizedKey = apiKey.trim();
  if (!normalizedKey) {
    throw new Error("Thiếu YOUTUBE_API_KEY.");
  }

  const videoId = extractYouTubeVideoId(input);
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet,status,contentDetails");
  endpoint.searchParams.set("id", videoId);
  endpoint.searchParams.set("key", normalizedKey);

  const response = await fetchImpl(endpoint, {
    headers: { Accept: "application/json" },
  });

  const payload = (await response.json()) as YouTubeVideosListResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ?? `YouTube Data API trả về HTTP ${response.status}.`,
    );
  }

  const item = payload.items?.[0];
  if (!item) {
    throw new Error("Không tìm thấy video hoặc video không khả dụng qua API.");
  }

  const title = item.snippet?.title?.trim();
  const channelTitle = item.snippet?.channelTitle?.trim();
  const publishedAt = item.snippet?.publishedAt?.trim();
  const durationIso8601 = item.contentDetails?.duration?.trim();
  const license = item.status?.license;

  if (!title || !channelTitle || !publishedAt || !durationIso8601 || !license) {
    throw new Error("Metadata YouTube thiếu trường bắt buộc.");
  }

  return {
    sourceMode: "youtube_companion",
    videoId,
    title,
    channelTitle,
    publishedAt,
    durationIso8601,
    embeddable: item.status?.embeddable === true,
    license,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
  };
}
