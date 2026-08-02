import type { TranscriptAcquisitionMode } from "@/features/real-talk/domain/transcript-source";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

export const GENERATION_FAILURE_CODES = [
  "AUTH_REQUIRED",
  "INVALID_INPUT",
  "RATE_LIMITED",
  "SOURCE_UNSUPPORTED",
  "TRANSCRIPT_UNAVAILABLE",
  "TRANSCRIPT_INVALID",
  "MODEL_UNAVAILABLE",
  "MODEL_RATE_LIMITED",
  "MODEL_OUTPUT_INVALID",
  "SOURCE_EVIDENCE_FAILED",
  "DRAFT_PERSISTENCE_FAILED",
  "INTERNAL_ERROR",
] as const;

export type GenerationFailureCode =
  (typeof GENERATION_FAILURE_CODES)[number];

export interface GenerationFailure {
  success: false;
  code: GenerationFailureCode;
  error: string;
  evidenceFailures?: string[];
  retryAfterSeconds?: number;
}

export interface GenerationSuccess {
  success: true;
  status: "ai_draft";
  persisted: true;
  persistence: "saved_private_draft";
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  warnings: string[];
  source: {
    provider: "youtube";
    externalId: string;
    watchUrl: string;
    embedUrl: string;
    selectedStartSeconds: number;
    selectedEndSeconds: number;
    acquisitionMode: TranscriptAcquisitionMode;
  };
  generation: {
    model: string;
    warnings: string[];
  };
}

export type GenerateLessonResult = GenerationSuccess | GenerationFailure;

export function generationFailure(
  code: GenerationFailureCode,
  error: string,
  options: {
    evidenceFailures?: readonly string[];
    retryAfterSeconds?: number;
  } = {},
): GenerationFailure {
  return {
    success: false,
    code,
    error,
    ...(options.evidenceFailures?.length
      ? { evidenceFailures: [...new Set(options.evidenceFailures)] }
      : {}),
    ...(typeof options.retryAfterSeconds === "number"
      ? { retryAfterSeconds: Math.max(1, Math.ceil(options.retryAfterSeconds)) }
      : {}),
  };
}
