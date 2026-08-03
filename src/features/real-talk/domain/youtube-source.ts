const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
]);

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (hostname === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_VIDEO_ID.test(id) ? id : null;
  }

  if (!YOUTUBE_HOSTS.has(hostname)) return null;

  const queryId = url.searchParams.get("v");
  if (queryId && YOUTUBE_VIDEO_ID.test(queryId)) return queryId;

  const parts = url.pathname.split("/").filter(Boolean);
  if (["embed", "shorts", "v"].includes(parts[0] ?? "")) {
    const pathId = parts[1];
    return pathId && YOUTUBE_VIDEO_ID.test(pathId) ? pathId : null;
  }

  return null;
}

export function canonicalYouTubeWatchUrl(input: string): string | null {
  const videoId = extractYouTubeVideoId(input);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}
