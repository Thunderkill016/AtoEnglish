import {
  TranscriptSourceError,
  type TranscriptCue,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";

const ADAPTER_ID = "youtube-direct-timedtext-v1";
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

function cleanText(value: string) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

export function parseYouTubeTimedTextXml(xml: string): TranscriptCue[] {
  const cues: TranscriptCue[] = [];
  const srv3Pattern = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;

  for (const match of xml.matchAll(srv3Pattern)) {
    const inner = match[3] ?? "";
    const words = [...inner.matchAll(/<s[^>]*>([^<]*)<\/s>/g)]
      .map((word) => word[1] ?? "")
      .join("");
    const text = cleanText(words || inner);
    if (!text) continue;

    cues.push({
      text,
      offset: Number.parseInt(match[1] ?? "0", 10) / 1000,
      duration: Math.max(0.1, Number.parseInt(match[2] ?? "0", 10) / 1000),
    });
  }

  if (cues.length > 0) return cues;

  const classicPattern =
    /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g;
  for (const match of xml.matchAll(classicPattern)) {
    const text = cleanText(match[3] ?? "");
    if (!text) continue;

    cues.push({
      text,
      offset: Math.max(0, Number.parseFloat(match[1] ?? "0")),
      duration: Math.max(0.1, Number.parseFloat(match[2] ?? "0")),
    });
  }

  return cues.sort((left, right) => left.offset - right.offset);
}

function candidateUrls(videoId: string, requestedLanguage: string) {
  const languages = [requestedLanguage, "en", "en-US", "en-GB"]
    .map((language) => language.trim())
    .filter(Boolean)
    .filter((language, index, all) => all.indexOf(language) === index);

  return languages.flatMap((language) => [
    {
      language,
      kind: "manual" as const,
      url: new URL("https://www.youtube.com/api/timedtext"),
    },
    {
      language,
      kind: "asr" as const,
      url: new URL("https://www.youtube.com/api/timedtext"),
    },
  ]).map((candidate) => {
    candidate.url.searchParams.set("v", videoId);
    candidate.url.searchParams.set("lang", candidate.language);
    candidate.url.searchParams.set("fmt", "srv3");
    if (candidate.kind === "asr") {
      candidate.url.searchParams.set("kind", "asr");
    }
    return candidate;
  });
}

async function fetchWithTimeout(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      redirect: "error",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function acquire(
  request: TranscriptSourceRequest,
): Promise<TranscriptSourceResult> {
  let providerFailure = false;

  for (const candidate of candidateUrls(
    request.sourceId,
    request.requestedLanguage,
  )) {
    try {
      const response = await fetchWithTimeout(candidate.url);
      if (!response.ok) {
        providerFailure ||= response.status >= 500;
        continue;
      }

      const cues = parseYouTubeTimedTextXml(await response.text());
      if (cues.length < 2) continue;

      return {
        cues,
        metadata: {
          adapterId: ADAPTER_ID,
          provider: "youtube-direct-timedtext",
          acquisitionMode: "experimental_unofficial",
          trust: "experimental",
          language: candidate.language,
          reviewStatus: "unreviewed",
          sourceReference: request.sourceUrl,
          acquiredAt: new Date().toISOString(),
          warnings: [
            `Caption track was acquired through an unofficial direct timed-text request (${candidate.kind}).`,
            "Caption text, timing, speaker attribution, and publication rights remain unverified.",
          ],
        },
      };
    } catch {
      providerFailure = true;
    }
  }

  throw new TranscriptSourceError({
    code: providerFailure
      ? "transcript_provider_error"
      : "transcript_not_available",
    message: providerFailure
      ? "YouTube timed-text requests failed before a readable English track was returned."
      : "No readable English timed-text track was returned.",
    retryable: providerFailure,
  });
}

export const experimentalYouTubeTimedTextSource: TranscriptSourceAdapter = {
  id: ADAPTER_ID,
  trust: "experimental",
  acquire,
};
