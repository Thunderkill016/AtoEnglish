import {
  TranscriptSourceError,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";
import { experimentalYouTubeTranscriptSource } from "@/features/real-talk/server/transcript-sources/youtube-experimental";
import { experimentalYouTubeTimedTextSource } from "@/features/real-talk/server/transcript-sources/youtube-timedtext-experimental";

const ADAPTER_ID = "youtube-private-composite-v1";
const SOURCES = [
  experimentalYouTubeTranscriptSource,
  experimentalYouTubeTimedTextSource,
] as const;

async function acquire(
  request: TranscriptSourceRequest,
): Promise<TranscriptSourceResult> {
  const failures: TranscriptSourceError[] = [];

  for (const source of SOURCES) {
    try {
      const result = await source.acquire(request);
      return {
        cues: result.cues,
        metadata: {
          ...result.metadata,
          adapterId: ADAPTER_ID,
          provider: `youtube-private-composite:${result.metadata.provider}`,
          warnings: [
            ...result.metadata.warnings,
            `Private composite adapter selected ${source.id}.`,
          ],
        },
      };
    } catch (error) {
      if (error instanceof TranscriptSourceError) {
        failures.push(error);
        continue;
      }
      failures.push(
        new TranscriptSourceError({
          code: "transcript_provider_error",
          message: `${source.id} failed unexpectedly.`,
          retryable: true,
          cause: error,
        }),
      );
    }
  }

  const retryable = failures.some((failure) => failure.retryable);
  const allUnavailable = failures.every(
    (failure) =>
      failure.code === "transcript_not_available" ||
      failure.code === "transcript_too_short",
  );

  throw new TranscriptSourceError({
    code: allUnavailable
      ? "transcript_not_available"
      : "transcript_provider_error",
    message: allUnavailable
      ? "No supported English caption track was returned by the available YouTube adapters."
      : "All private YouTube caption adapters failed.",
    retryable,
  });
}

export const privateYouTubeTranscriptSource: TranscriptSourceAdapter = {
  id: ADAPTER_ID,
  trust: "experimental",
  acquire,
};
