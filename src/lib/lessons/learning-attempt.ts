import { z } from "zod";

export const LEARNING_MODALITIES = [
  "vocabulary",
  "grammar",
  "listening",
  "reading",
  "writing",
  "speaking",
  "shadowing",
  "quiz",
  "checkpoint",
] as const;

export const LEARNING_ATTEMPT_STATUSES = [
  "scored",
  "unscored",
  "unavailable",
  "skipped",
] as const;

const stableIdSchema = z
  .string()
  .min(1)
  .max(180)
  .regex(/^[a-zA-Z0-9:_-]+$/, "ID chỉ được chứa chữ, số, :, _ và -");

export const LearningAttemptItemSchema = z
  .object({
    activityId: stableIdSchema,
    modality: z.enum(LEARNING_MODALITIES),
    status: z.enum(LEARNING_ATTEMPT_STATUSES),
    score: z.number().min(0).max(100).nullable(),
    errorTags: z.array(stableIdSchema).max(3).default([]),
    evaluator: stableIdSchema.max(80),
    evaluatorVersion: z.string().min(1).max(40),
    latencyMs: z.number().int().min(0).max(300_000).nullable().default(null),
  })
  .strict()
  .superRefine((attempt, context) => {
    const hasScore = attempt.score !== null;
    if ((attempt.status === "scored") !== hasScore) {
      context.addIssue({
        code: "custom",
        path: ["score"],
        message: "Chỉ trạng thái scored mới được có điểm",
      });
    }
  });

export const LearningAttemptBatchSchema = z
  .object({
    sessionId: z.string().uuid(),
    lessonId: stableIdSchema.max(120),
    attempts: z.array(LearningAttemptItemSchema).min(1).max(20),
  })
  .strict();

export type LearningAttemptBatchInput = z.input<typeof LearningAttemptBatchSchema>;
export type LearningAttemptItem = z.output<typeof LearningAttemptItemSchema>;
