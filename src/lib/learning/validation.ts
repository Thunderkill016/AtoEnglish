import { z } from "zod";
import { EVIDENCE_TYPES } from "./evidence";

const nullableShortText = z.string().trim().min(1).max(200).nullable().optional();

export const LearningAttemptSchema = z.object({
  knowledgeItemId: nullableShortText,
  capabilityId: nullableShortText,
  sessionId: z.string().uuid().nullable().optional(),
  exerciseType: z.string().trim().min(1).max(80),
  responseModality: z.enum(["choice", "text", "speech", "gesture", "none"]),
  promptId: nullableShortText,
  contextId: nullableShortText,
  responseText: z.string().max(5000).nullable().optional(),
  correct: z.boolean().nullable().optional(),
  latencyMs: z.number().int().min(0).max(60 * 60 * 1000).nullable().optional(),
  hintCount: z.number().int().min(0).max(100).optional(),
  revealUsed: z.boolean().optional(),
  supportLevel: z.number().int().min(0).max(10).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine(
  (value) => Boolean(value.knowledgeItemId || value.capabilityId),
  { message: "Attempt cần knowledgeItemId hoặc capabilityId" }
);

export const EvidenceCandidateSchema = z.object({
  type: z.enum(EVIDENCE_TYPES),
  targetId: z.string().trim().min(1).max(200),
  success: z.boolean(),
  confidence: z.number().min(0).max(1).optional(),
  contextId: nullableShortText,
  evaluator: z.string().trim().min(1).max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const RecordLearningAttemptSchema = z.object({
  attempt: LearningAttemptSchema,
  candidate: EvidenceCandidateSchema.nullable().optional(),
  previousSuccessfulContextId: nullableShortText,
});

export type RecordLearningAttemptInput = z.infer<typeof RecordLearningAttemptSchema>;
