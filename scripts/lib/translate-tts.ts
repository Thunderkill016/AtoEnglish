import { writeFile } from "node:fs/promises";

const DEFAULT_ENDPOINT = "https://translate.google.com/translate_tts";
const DEFAULT_MAX_CHARS = 180;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 500;
const DEFAULT_TIMEOUT_MS = 20_000;

export interface TranslateTtsOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  language?: string;
  maxChars?: number;
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function splitTextForTts(
  text: string,
  maxChars = DEFAULT_MAX_CHARS,
): string[] {
  if (!Number.isInteger(maxChars) || maxChars < 1) {
    throw new Error("maxChars must be a positive integer");
  }

  const normalized = normalizeText(text);
  if (!normalized) {
    throw new Error("TTS text must not be empty");
  }

  const chunks: string[] = [];
  let current = "";

  for (const word of normalized.split(" ")) {
    if (word.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      for (let offset = 0; offset < word.length; offset += maxChars) {
        chunks.push(word.slice(offset, offset + maxChars));
      }
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    chunks.push(current);
    current = word;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function buildTranslateTtsUrl(
  text: string,
  language = "en",
  endpoint = DEFAULT_ENDPOINT,
): URL {
  const normalizedLanguage = language.trim();
  if (!normalizedLanguage) {
    throw new Error("TTS language must not be empty");
  }

  const url = new URL(endpoint);
  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("client", "tw-ob");
  url.searchParams.set("tl", normalizedLanguage);
  url.searchParams.set("q", text);
  return url;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function delay(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchAudioChunk(
  text: string,
  options: Required<
    Pick<
      TranslateTtsOptions,
      | "endpoint"
      | "fetchImpl"
      | "language"
      | "retries"
      | "retryDelayMs"
      | "timeoutMs"
    >
  >,
): Promise<Buffer> {
  const url = buildTranslateTtsUrl(text, options.language, options.endpoint);
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

    try {
      const response = await options.fetchImpl(url, {
        headers: {
          Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.1",
          Referer: "https://translate.google.com/",
          "User-Agent":
            "Mozilla/5.0 (compatible; AtoEnglishAudioGenerator/1.0)",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `TTS endpoint returned ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().startsWith("audio/")) {
        throw new Error(
          `TTS endpoint returned unexpected content type: ${contentType || "unknown"}`,
        );
      }

      const audio = Buffer.from(await response.arrayBuffer());
      if (audio.length === 0) {
        throw new Error("TTS endpoint returned an empty audio response");
      }

      return audio;
    } catch (error) {
      lastError = toError(error);
      if (attempt < options.retries) {
        await delay(options.retryDelayMs * (attempt + 1));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `TTS request failed after ${options.retries + 1} attempts: ${lastError?.message ?? "unknown error"}`,
    { cause: lastError },
  );
}

export async function synthesizeMp3(
  text: string,
  options: TranslateTtsOptions = {},
): Promise<Buffer> {
  const resolved = {
    endpoint: options.endpoint ?? DEFAULT_ENDPOINT,
    fetchImpl: options.fetchImpl ?? fetch,
    language: options.language ?? "en",
    maxChars: options.maxChars ?? DEFAULT_MAX_CHARS,
    retries: options.retries ?? DEFAULT_RETRIES,
    retryDelayMs: options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS,
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };

  if (!Number.isInteger(resolved.retries) || resolved.retries < 0) {
    throw new Error("retries must be a non-negative integer");
  }
  if (!Number.isFinite(resolved.retryDelayMs) || resolved.retryDelayMs < 0) {
    throw new Error("retryDelayMs must be a non-negative number");
  }
  if (!Number.isFinite(resolved.timeoutMs) || resolved.timeoutMs <= 0) {
    throw new Error("timeoutMs must be a positive number");
  }

  const chunks = splitTextForTts(text, resolved.maxChars);
  const audioChunks: Buffer[] = [];

  for (const chunk of chunks) {
    audioChunks.push(await fetchAudioChunk(chunk, resolved));
  }

  return Buffer.concat(audioChunks);
}

export async function saveMp3(
  text: string,
  outPath: string,
  options: TranslateTtsOptions = {},
): Promise<void> {
  const audio = await synthesizeMp3(text, options);
  await writeFile(outPath, audio);
}
