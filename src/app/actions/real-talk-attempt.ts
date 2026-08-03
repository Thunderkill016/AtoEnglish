"use server";

import {
  realTalkAttemptEvidenceSchema,
  type RealTalkAttemptEvidence,
  type SaveAttemptResult,
} from "@/features/real-talk/domain/learner-attempt";
import { persistRealTalkAttempt } from "@/features/real-talk/server/attempt-repository";

export async function saveRealTalkAttempt(
  input: RealTalkAttemptEvidence,
): Promise<SaveAttemptResult> {
  const parsed = realTalkAttemptEvidenceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "Checkpoint bài học không hợp lệ.",
    };
  }

  return persistRealTalkAttempt(parsed.data);
}
