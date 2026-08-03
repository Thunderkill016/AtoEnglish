import type { RealTalkLevel } from "../src/types/real-talk";
import { compilePrivateNaturalLesson } from "../src/features/real-talk/server/private-lesson-compiler";

const DEFAULT_URL = "https://www.youtube.com/watch?v=Z5MU-5_pBfY";
const ALLOWED_LEVELS = new Set<RealTalkLevel>(["A0", "A1", "A2", "B1", "B2"]);

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for the live Gemini gate.");
  }

  process.env.REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS = "true";

  const youtubeUrl = process.argv[2] ?? DEFAULT_URL;
  const requestedLevel = (process.argv[3] ?? "A1") as RealTalkLevel;
  const level = ALLOWED_LEVELS.has(requestedLevel) ? requestedLevel : "A1";
  const result = await compilePrivateNaturalLesson({ youtubeUrl, level });

  if (!result.success) {
    console.error(
      JSON.stringify(
        {
          success: false,
          code: result.code,
          message: result.error,
          retryAfterSeconds: result.retryAfterSeconds,
          evidenceFailures: result.evidenceFailures,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        model: result.model,
        videoId: result.video.youtubeId,
        selectedStartSeconds: result.video.segment.startSeconds,
        selectedEndSeconds: result.video.segment.endSeconds,
        level: result.draft.level,
        transcriptSegments: result.draft.transcript.length,
        communicationEvents: result.draft.communicationEvents.length,
        vocabularyItems: result.draft.preWatch.vocabulary.length,
        comprehensionQuestions:
          result.draft.postWatch.comprehensionQuiz.length,
        speakingDrills: result.draft.postWatch.speakingDrills.length,
        transferCriteria: result.draft.transferTask.successCriteriaVi.length,
        acquisitionMode: result.transcriptMetadata.acquisitionMode,
        warningsCount: result.warnings.length,
      },
      null,
      2,
    ),
  );
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
