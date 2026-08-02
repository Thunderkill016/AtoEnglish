import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildAuthorizedListeningLessonDraft } from "../src/features/media-ingestion/domain/lesson-draft";
import { parseTimedText } from "../src/features/media-ingestion/domain/timed-text";
import { fetchYouTubeCompanionMetadata } from "../src/features/media-ingestion/domain/youtube-companion-demo";

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const argument = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return argument ? argument.slice(prefix.length).trim() : null;
}

function hasFlag(name: string): boolean {
  return process.argv.slice(2).includes(`--${name}`);
}

function isoDurationToMs(value: string): number | undefined {
  const match = value.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/,
  );
  if (!match) return undefined;

  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);

  return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
}

async function main() {
  const url = readArg("url");
  const apiKey = process.env.YOUTUBE_API_KEY?.trim() ?? "";

  if (!url) {
    throw new Error(
      "Thiếu --url=<YouTube URL>. Ví dụ: --url=https://www.youtube.com/watch?v=VIDEO_ID",
    );
  }

  const metadata = await fetchYouTubeCompanionMetadata(url, apiKey);
  const captionPath = readArg("caption");

  if (!captionPath) {
    console.log(
      JSON.stringify(
        {
          mode: "metadata_only",
          metadata,
          nextStep:
            "Cung cấp caption local được phép dùng bằng --caption=<path> --caption-authorized --rights-evidence=<reference>.",
        },
        null,
        2,
      ),
    );
    return;
  }

  if (/^https?:\/\//i.test(captionPath)) {
    throw new Error("Demo chỉ nhận caption file local; không tải caption từ URL.");
  }

  if (!hasFlag("caption-authorized")) {
    throw new Error("Thiếu --caption-authorized để xác nhận quyền sử dụng caption.");
  }

  const rightsEvidence = readArg("rights-evidence");
  if (!rightsEvidence) {
    throw new Error("Thiếu --rights-evidence=<reference>.");
  }

  const absoluteCaptionPath = resolve(process.cwd(), captionPath);
  const captionSource = await readFile(absoluteCaptionPath, "utf8");
  const parsed = parseTimedText(captionSource, {
    durationMs: isoDurationToMs(metadata.durationIso8601),
  });
  const lesson = buildAuthorizedListeningLessonDraft(metadata, parsed.cues, {
    canStoreTranscript: true,
    canCreateDerivedLesson: true,
    evidenceReference: rightsEvidence,
  });

  console.log(
    JSON.stringify(
      {
        mode: "authorized_lesson_draft",
        captionFormat: parsed.format,
        cueCount: parsed.cues.length,
        lesson,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Demo thất bại: ${message}`);
  process.exitCode = 1;
});
