export type YouTubeLicense = "youtube" | "creativeCommon";
export type YouTubeMetadataSource = "youtube_data_api" | "youtube_oembed";

export interface YouTubeCompanionMetadata {
  sourceMode: "youtube_companion";
  metadataSource?: YouTubeMetadataSource;
  videoId: string;
  title: string;
  channelTitle: string;
  authorUrl?: string | null;
  publishedAt: string;
  durationIso8601: string;
  embeddable: boolean;
  license: YouTubeLicense | "unknown";
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

interface YouTubeOEmbedResponse {
  type?: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  html?: string;
  error?: string;
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

async function fetchViaDataApi(
  videoId: string,
  apiKey: string,
  fetchImpl: typeof fetch,
): Promise<YouTubeCompanionMetadata> {
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet,status,contentDetails");
  endpoint.searchParams.set("id", videoId);
  endpoint.searchParams.set("key", apiKey);

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
    metadataSource: "youtube_data_api",
    videoId,
    title,
    channelTitle,
    authorUrl: null,
    publishedAt,
    durationIso8601,
    embeddable: item.status?.embeddable === true,
    license,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
  };
}

async function fetchViaOEmbed(
  videoId: string,
  fetchImpl: typeof fetch,
): Promise<YouTubeCompanionMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", watchUrl);
  endpoint.searchParams.set("format", "json");

  const response = await fetchImpl(endpoint, {
    headers: { Accept: "application/json" },
  });
  const payload = (await response.json()) as YouTubeOEmbedResponse;

  if (!response.ok) {
    throw new Error(
      payload.error ?? `YouTube oEmbed trả về HTTP ${response.status}.`,
    );
  }

  const title = payload.title?.trim();
  const channelTitle = payload.author_name?.trim();
  const hasEmbedRepresentation =
    payload.type === "video" &&
    typeof payload.html === "string" &&
    /youtube(?:-nocookie)?\.com\/embed\//i.test(payload.html);

  if (!title || !channelTitle || !hasEmbedRepresentation) {
    throw new Error("YouTube oEmbed thiếu metadata hoặc mã nhúng hợp lệ.");
  }

  return {
    sourceMode: "youtube_companion",
    metadataSource: "youtube_oembed",
    videoId,
    title,
    channelTitle,
    authorUrl: payload.author_url?.trim() || null,
    publishedAt: "",
    durationIso8601: "",
    embeddable: true,
    license: "unknown",
    watchUrl,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: payload.thumbnail_url?.trim() || null,
  };
}

export async function fetchYouTubeCompanionMetadata(
  input: string,
  apiKey = "",
  fetchImpl: typeof fetch = fetch,
): Promise<YouTubeCompanionMetadata> {
  const videoId = extractYouTubeVideoId(input);
  const normalizedKey = apiKey.trim();

  return normalizedKey
    ? fetchViaDataApi(videoId, normalizedKey, fetchImpl)
    : fetchViaOEmbed(videoId, fetchImpl);
}
