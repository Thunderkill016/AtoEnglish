export type TimedTextFormat = "vtt" | "srt";

export interface TimedTextCue {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
}

export interface ParsedTimedText {
  format: TimedTextFormat;
  cues: TimedTextCue[];
}

function parseTimestamp(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  const parts = normalized.split(":");

  if (parts.length < 2 || parts.length > 3) {
    throw new Error(`Timestamp không hợp lệ: ${raw}`);
  }

  const secondsPart = parts.at(-1);
  const minutesPart = parts.at(-2);
  const hoursPart = parts.length === 3 ? parts[0] : "0";

  if (!secondsPart || !minutesPart || hoursPart === undefined) {
    throw new Error(`Timestamp không hợp lệ: ${raw}`);
  }

  const [secondsRaw, millisecondsRaw = "0"] = secondsPart.split(".");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);
  const seconds = Number(secondsRaw);
  const milliseconds = Number(millisecondsRaw.padEnd(3, "0").slice(0, 3));

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    !Number.isInteger(milliseconds) ||
    hours < 0 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59 ||
    milliseconds < 0 ||
    milliseconds > 999
  ) {
    throw new Error(`Timestamp không hợp lệ: ${raw}`);
  }

  return ((hours * 60 * 60 + minutes * 60 + seconds) * 1000) + milliseconds;
}

function stripMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCueBlock(block: string, index: number): TimedTextCue | null {
  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;
  if (/^(NOTE|STYLE|REGION)(\s|$)/.test(lines[0] ?? "")) return null;

  const timingLineIndex = lines.findIndex((line) => line.includes("-->"));
  if (timingLineIndex < 0) return null;

  const timingLine = lines[timingLineIndex];
  if (!timingLine) return null;

  const [startRaw, endWithSettings] = timingLine.split("-->").map((part) => part.trim());
  const endRaw = endWithSettings?.split(/\s+/)[0];

  if (!startRaw || !endRaw) {
    throw new Error(`Cue ${index + 1} thiếu timestamp.`);
  }

  const startMs = parseTimestamp(startRaw);
  const endMs = parseTimestamp(endRaw);

  if (endMs <= startMs) {
    throw new Error(`Cue ${index + 1} có thời gian kết thúc không hợp lệ.`);
  }

  const text = stripMarkup(lines.slice(timingLineIndex + 1).join(" "));
  if (!text) {
    throw new Error(`Cue ${index + 1} không có nội dung.`);
  }

  const explicitId = timingLineIndex > 0 ? lines[timingLineIndex - 1] : null;

  return {
    id: explicitId && !explicitId.includes("-->") ? explicitId : `cue-${index + 1}`,
    startMs,
    endMs,
    text,
  };
}

export function parseTimedText(
  source: string,
  options: { durationMs?: number } = {},
): ParsedTimedText {
  const normalized = source.replace(/^\uFEFF/, "").trim();
  if (!normalized) {
    throw new Error("Caption file rỗng.");
  }

  const format: TimedTextFormat = normalized.startsWith("WEBVTT") ? "vtt" : "srt";
  const body = format === "vtt"
    ? normalized.replace(/^WEBVTT[^\n]*(?:\r?\n)?/, "").trim()
    : normalized;

  const cues = body
    .split(/\r?\n\s*\r?\n/)
    .map(parseCueBlock)
    .filter((cue): cue is TimedTextCue => cue !== null)
    .sort((left, right) => left.startMs - right.startMs);

  if (cues.length === 0) {
    throw new Error("Không tìm thấy cue hợp lệ trong caption file.");
  }

  for (let index = 0; index < cues.length; index += 1) {
    const cue = cues[index];
    const previous = cues[index - 1];

    if (!cue) continue;
    if (previous && cue.startMs < previous.endMs) {
      throw new Error(`Cue ${cue.id} chồng lấn cue ${previous.id}.`);
    }

    if (options.durationMs !== undefined && cue.endMs > options.durationMs) {
      throw new Error(`Cue ${cue.id} vượt quá thời lượng media.`);
    }
  }

  return { format, cues };
}
