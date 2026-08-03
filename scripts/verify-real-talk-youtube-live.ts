import {
  TranscriptSourceError,
  type TranscriptCue,
} from "../src/features/real-talk/domain/transcript-source";
import { extractYouTubeVideoId } from "../src/features/real-talk/domain/youtube-source";
import { acquireTranscriptForCompilation } from "../src/features/real-talk/server/transcript-source-policy";
import { experimentalYouTubeTranscriptSource } from "../src/features/real-talk/server/transcript-sources/youtube-experimental";

const DEFAULT_URL = "https://www.youtube.com/watch?v=Z5MU-5_pBfY";

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

async function main() {
  const sourceUrl = process.argv[2] ?? DEFAULT_URL;
  const sourceId = extractYouTubeVideoId(sourceUrl);
  if (!sourceId) {
    throw new Error("A supported HTTPS YouTube URL is required.");
  }

  const result = await acquireTranscriptForCompilation({
    adapter: experimentalYouTubeTranscriptSource,
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

  const bounds = transcriptBounds(result.cues);
  console.log(
    JSON.stringify(
      {
        success: true,
        adapterId: result.metadata.adapterId,
        provider: result.metadata.provider,
        sourceId,
        acquisitionMode: result.metadata.acquisitionMode,
        reviewStatus: result.metadata.reviewStatus,
        language: result.metadata.language,
        cueCount: result.cues.length,
        ...bounds,
        warningsCount: result.metadata.warnings.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const output =
    error instanceof TranscriptSourceError
      ? {
          success: false,
          code: error.code,
          retryable: error.retryable,
          message: error.message,
        }
      : {
          success: false,
          code: "unexpected_live_check_failure",
          retryable: false,
          message: error instanceof Error ? error.message : "Unknown failure",
        };

  console.error(JSON.stringify(output, null, 2));
  process.exitCode = 1;
});
