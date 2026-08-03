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

interface CaptionTrack {
  baseUrl?: unknown;
  languageCode?: unknown;
}

const ADAPTER_ID = "youtube-unofficial-fetch-v1";
const PLAYER_ENDPOINT =
  "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const CLIENT_VERSION = "20.10.38";
const REQUEST_TIMEOUT_MS = 12_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 Chrome/125 Safari/537.36";

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    );
}

function sanitizeCaptionText(value: string) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
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

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function parseInlineJson(html: string, globalName: string): unknown {
  const tokens = [`var ${globalName} = `, `${globalName} = `];
  const token = tokens.find((candidate) => html.includes(candidate));
  if (!token) return null;

  const start = html.indexOf(token) + token.length;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < html.length; index += 1) {
    const character = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }

    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, index + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

function readCaptionTracks(value: unknown): CaptionTrack[] {
  if (!value || typeof value !== "object") return [];
  const root = value as Record<string, unknown>;
  const captions = root.captions as Record<string, unknown> | undefined;
  const renderer = captions?.playerCaptionsTracklistRenderer as
    | Record<string, unknown>
    | undefined;
  return Array.isArray(renderer?.captionTracks)
    ? (renderer.captionTracks as CaptionTrack[])
    : [];
}

async function fetchCaptionTracks(videoId: string): Promise<CaptionTrack[]> {
  try {
    const response = await fetchWithTimeout(PLAYER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `com.google.android.youtube/${CLIENT_VERSION} (Linux; U; Android 14)`,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: CLIENT_VERSION,
          },
        },
        videoId,
      }),
    });

    if (response.ok) {
      const tracks = readCaptionTracks(await response.json());
      if (tracks.length > 0) return tracks;
    }
  } catch {
    // Continue to the web-page fallback below.
  }

  const response = await fetchWithTimeout(
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
    { headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" } },
  );
  if (!response.ok) return [];

  const html = await response.text();
  if (html.includes('class="g-recaptcha"')) {
    throw new TranscriptSourceError({
      code: "transcript_provider_error",
      message: "YouTube temporarily requires a captcha for this server.",
      retryable: true,
    });
  }

  return readCaptionTracks(parseInlineJson(html, "ytInitialPlayerResponse"));
}

function selectCaptionTrack(
  tracks: CaptionTrack[],
  requestedLanguage: string,
): { baseUrl: string; language: string } | null {
  const validTracks = tracks.flatMap((track) => {
    const baseUrl = typeof track.baseUrl === "string" ? track.baseUrl : "";
    const language =
      typeof track.languageCode === "string" ? track.languageCode : "";
    return baseUrl && language ? [{ baseUrl, language }] : [];
  });

  const normalized = requestedLanguage.trim().toLowerCase();
  return (
    validTracks.find((track) => track.language.toLowerCase() === normalized) ??
    validTracks.find((track) =>
      track.language.toLowerCase().startsWith(`${normalized}-`),
    ) ??
    validTracks.find((track) => track.language.toLowerCase() === "en") ??
    validTracks.find((track) => track.language.toLowerCase().startsWith("en-")) ??
    null
  );
}

function assertCaptionUrlSafe(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TranscriptSourceError({
      code: "transcript_provider_error",
      message: "YouTube returned an invalid caption URL.",
    });
  }

  if (
    url.protocol !== "https:" ||
    !(url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com"))
  ) {
    throw new TranscriptSourceError({
      code: "transcript_provider_error",
      message: "YouTube returned an unsafe caption host.",
    });
  }
}

function parseTranscriptXml(xml: string): RawYouTubeTranscriptItem[] {
  const results: RawYouTubeTranscriptItem[] = [];
  const paragraphPattern =
    /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;

  for (const match of xml.matchAll(paragraphPattern)) {
    const inner = match[3] ?? "";
    const words = [...inner.matchAll(/<s[^>]*>([^<]*)<\/s>/g)]
      .map((wordMatch) => wordMatch[1] ?? "")
      .join("");
    const text = sanitizeCaptionText(words || inner);
    if (text) {
      results.push({
        text,
        offset: Number.parseInt(match[1] ?? "0", 10),
        duration: Number.parseInt(match[2] ?? "0", 10),
      });
    }
  }

  if (results.length > 0) return results;

  const classicPattern =
    /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g;
  return [...xml.matchAll(classicPattern)].flatMap((match) => {
    const text = sanitizeCaptionText(match[3] ?? "");
    if (!text) return [];
    return [
      {
        text,
        offset: Number.parseFloat(match[1] ?? "0") * 1000,
        duration: Number.parseFloat(match[2] ?? "0") * 1000,
      },
    ];
  });
}

async function acquireYouTubeTranscript(
  request: TranscriptSourceRequest,
): Promise<TranscriptSourceResult> {
  try {
    const tracks = await fetchCaptionTracks(request.sourceId);
    const selected = selectCaptionTrack(tracks, request.requestedLanguage);
    if (!selected) {
      throw new TranscriptSourceError({
        code: "transcript_not_available",
        message: "No readable English caption track was returned.",
      });
    }

    assertCaptionUrlSafe(selected.baseUrl);
    const transcriptResponse = await fetchWithTimeout(selected.baseUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": selected.language,
      },
    });
    if (!transcriptResponse.ok) {
      throw new TranscriptSourceError({
        code: "transcript_provider_error",
        message: "YouTube did not return the selected caption track.",
        retryable: transcriptResponse.status >= 500,
      });
    }

    const cues = normalizeExperimentalYouTubeTranscriptItems(
      parseTranscriptXml(await transcriptResponse.text()),
    );
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
        provider: "youtube-unofficial-fetch",
        acquisitionMode: "experimental_unofficial",
        trust: "experimental",
        language: selected.language,
        reviewStatus: "unreviewed",
        sourceReference: request.sourceUrl,
        acquiredAt: new Date().toISOString(),
        warnings: [
          "Transcript được lấy qua endpoint YouTube không chính thức và chỉ dùng cho bản nháp riêng tư.",
          "Caption, ngôn ngữ, speaker attribution và timestamp chưa được con người xác minh.",
          "Khả năng truy cập caption không chứng minh quyền xuất bản hoặc chia sẻ nội dung phái sinh.",
        ],
      },
    };
  } catch (error) {
    if (error instanceof TranscriptSourceError) throw error;
    throw new TranscriptSourceError({
      code: "transcript_provider_error",
      message: "The experimental YouTube transcript provider failed.",
      retryable: true,
      cause: error,
    });
  }
}

export const experimentalYouTubeTranscriptSource: TranscriptSourceAdapter = {
  id: ADAPTER_ID,
  trust: "experimental",
  acquire: acquireYouTubeTranscript,
};
