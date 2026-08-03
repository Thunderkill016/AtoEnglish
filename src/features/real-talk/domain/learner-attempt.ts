import { z } from "zod";

export const realTalkAttemptEvidenceSchema = z.object({
  lessonSlug: z.string().trim().min(1).max(180),
  firstListenCompleted: z.boolean(),
  comprehensionCorrect: z.number().int().min(0).max(20),
  comprehensionTotal: z.number().int().min(0).max(20),
  maxSupportLevel: z.number().int().min(0).max(3),
  retrievalAttempted: z.boolean(),
  speakConfirmed: z.boolean(),
  transferAttempted: z.boolean(),
});

export type RealTalkAttemptEvidence = z.infer<
  typeof realTalkAttemptEvidenceSchema
>;

export interface RestoredRealTalkAttempt {
  attemptId: string;
  status: "started" | "in_progress" | "completed";
  checkpoint:
    | "environment"
    | "first_listen"
    | "support"
    | "retrieval"
    | "speaking"
    | "transfer"
    | "completed";
  firstListenCompleted: boolean;
  comprehensionCorrect: number;
  comprehensionTotal: number;
  maxSupportLevel: 0 | 1 | 2 | 3;
  retrievalAttempted: boolean;
  speakConfirmed: boolean;
  transferAttempted: boolean;
  completedAt: string | null;
}

export type SaveAttemptResult =
  | {
      success: true;
      attemptId: string;
      status: "started" | "in_progress" | "completed";
      checkpoint: RestoredRealTalkAttempt["checkpoint"];
      completedAt: string | null;
    }
  | {
      success: false;
      code: "AUTH_REQUIRED" | "INVALID_INPUT" | "PERSISTENCE_FAILED";
      error: string;
    };
