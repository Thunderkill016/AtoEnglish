import {
  TranscriptSourceError,
  type TranscriptCue,
} from "../src/features/real-talk/domain/transcript-source";
import { extractYouTubeVideoId } from "../src/features/real-talk/domain/youtube-source";
import { acquireTranscriptForCompilation } from "../src/features/real-talk/server/transcript-source-policy";
import { privateYouTubeTranscriptSource } from "../src/features/real-talk/server/transcript-sources/youtube-private";

const DEFAULT_URLS = [
  "https://www.youtube.com/watch?v=Z5MU-5_pBfY",
  "https://www.youtube.com/watch?v=Ks-_Mh1QhMc",
  "https://www.youtube.com/watch?v=M7lc1UVf-VE",
] as const;

function transcriptBounds(cues: readonly TranscriptCue[]) {
  const firstOffset = cues[0]?.offset ?? 0;
  const lastEnd = cues.reduce(
    (maximum, cue) => Math.max(maximum, cue.offset + cue.duration),
    firstOffset,
  );

  return {
    firstOffset: Number(firstOffset.toFixed(3)),
    lastEnd: Number(lastEnd.toFixed(3)),
    durationSeconds: Number((lastEnd - firstOffset).toFixed(3)),
  };
}

async function verifyOne(sourceUrl: string) {
  const sourceId = extractYouTubeVideoId(sourceUrl);
  if (!sourceId) {
    return {
      success: false as const,
      sourceUrl,
      code: "invalid_youtube_url",
      retryable: false,
      message: "A supported HTTPS YouTube URL is required.",
    };
  }

  try {
    const result = await acquireTranscriptForCompilation({
      adapter: privateYouTubeTranscriptSource,
      useCase: "private_draft",
      environment: {
        NODE_ENV: "test",
        REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS: "true",
      },
      request: {
        sourceId,
        sourceUrl: `https://www.youtube.com/watch?v=${sourceId}`,
        requestedLanguage: "en",
      },
    });

    if (result.cues.length < 2) {
      throw new Error("The live transcript contained fewer than two timed cues.");
    }

    return {
      success: true as const,
      adapterId: result.metadata.adapterId,
      provider: result.metadata.provider,
      sourceId,
      acquisitionMode: result.metadata.acquisitionMode,
      reviewStatus: result.metadata.reviewStatus,
      language: result.metadata.language,
      cueCount: result.cues.length,
      ...transcriptBounds(result.cues),
      warningsCount: result.metadata.warnings.length,
    };
  } catch (error) {
    return error instanceof TranscriptSourceError
      ? {
          success: false as const,
          sourceId,
          code: error.code,
          retryable: error.retryable,
          message: error.message,
        }
      : {
          success: false as const,
          sourceId,
          code: "unexpected_live_check_failure",
          retryable: false,
          message: error instanceof Error ? error.message : "Unknown failure",
        };
  }
}

async function main() {
  const urls = process.argv.slice(2);
  const candidates = urls.length > 0 ? urls : [...DEFAULT_URLS];
  const results = [];

  for (const candidate of candidates) {
    results.push(await verifyOne(candidate));
  }

  const successes = results.filter((result) => result.success);
  console.log(
    JSON.stringify(
      {
        success: successes.length > 0,
        supportedCount: successes.length,
        candidateCount: results.length,
        results,
      },
      null,
      2,
    ),
  );

  if (successes.length === 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(
    JSON.stringify(
      {
        success: false,
        code: "unexpected_live_check_failure",
        message: error instanceof Error ? error.message : "Unknown failure",
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
