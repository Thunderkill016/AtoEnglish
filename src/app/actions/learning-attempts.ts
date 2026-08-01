"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import {
  LearningAttemptBatchSchema,
  type LearningAttemptBatchInput,
} from "@/lib/lessons/learning-attempt";
import {
  TRIAL_CHECKPOINT_QUESTIONS,
  scoreTrialCheckpoint,
} from "@/lib/lessons/trial-checkpoint";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";
import { seedUnitVocabToSRS } from "@/app/actions/cards";
import { completeUnit } from "@/app/actions/unit";
import { z } from "zod";

const attemptLimiter = createRateLimiter(60, 60_000, "learning-attempts");

export async function recordLearningAttempts(input: LearningAttemptBatchInput) {
  const parsed = LearningAttemptBatchSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Dữ liệu lần học không hợp lệ." };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";
  const rateCheck = await attemptLimiter.check(ip);
  if (!rateCheck.success) {
    return {
      success: false as const,
      error: "Quá nhiều lần ghi nhận. Vui lòng thử lại sau.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false as const, error: "Bạn cần đăng nhập để lưu tiến độ." };
  }

  const { error } = await supabase.from("learning_attempts").insert(
    parsed.data.attempts.map((attempt) => ({
      user_id: user.id,
      session_id: parsed.data.sessionId,
      lesson_id: parsed.data.lessonId,
      activity_id: attempt.activityId,
      modality: attempt.modality,
      status: attempt.status,
      score: attempt.score,
      error_tags: attempt.errorTags,
      evaluator: attempt.evaluator,
      evaluator_version: attempt.evaluatorVersion,
      latency_ms: attempt.latencyMs,
    })),
  );

  if (error) {
    return { success: false as const, error: "Không thể lưu bằng chứng học tập." };
  }

  return { success: true as const, inserted: parsed.data.attempts.length };
}

const trialCheckpointClaimSchema = z
  .object({
    sessionId: z.string().uuid(),
    answers: z.record(z.string(), z.string()),
  })
  .strict();

export async function claimTrialCheckpoint(input: unknown) {
  const parsed = trialCheckpointClaimSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Kết quả checkpoint không hợp lệ." };
  }

  const allAnswered = TRIAL_CHECKPOINT_QUESTIONS.every(
    (question) => parsed.data.answers[question.id] !== undefined,
  );
  if (!allAnswered) {
    return {
      success: false as const,
      error: "Bạn cần trả lời đủ ba câu checkpoint.",
    };
  }

  const { correctCount, passed } = scoreTrialCheckpoint(parsed.data.answers);
  const attemptResult = await recordLearningAttempts({
    sessionId: parsed.data.sessionId,
    lessonId: "unit-a0-1",
    attempts: TRIAL_CHECKPOINT_QUESTIONS.map((question) => {
      const correct = parsed.data.answers[question.id] === question.answer;
      return {
        activityId: `unit-a0-1:checkpoint:${question.id}`,
        modality: "checkpoint" as const,
        status: "scored" as const,
        score: correct ? 100 : 0,
        errorTags: correct ? [] : ["answer_mismatch"],
        evaluator: "deterministic-answer-key",
        evaluatorVersion: "1.1.0",
        latencyMs: null,
      };
    }),
  });

  if (!attemptResult.success) return attemptResult;

  if (!passed) {
    return {
      success: true as const,
      passed: false,
      correctCount,
      masteryRecorded: false,
    };
  }

  const completion = await completeUnit(
    "unit-a0-1",
    correctCount === 3 ? 3 : 2,
  );
  if (!completion.success) {
    return {
      success: false as const,
      error: completion.error || "Không thể ghi nhận kết quả checkpoint.",
    };
  }

  // Reuse the existing FSRS deck for communicative chunks after mastery is verified.
  // Raw audio and transcripts are not persisted here.
  const reviewSeed = await seedUnitVocabToSRS({
    vocab: GOLD_MISSION_01.targetChunks.map((chunk) => ({
      word: chunk.english,
      phonetic: null,
      meaning_vn: chunk.vietnamese,
      example_en: chunk.useWhenVi,
    })),
    topic: GOLD_MISSION_01.titleVi,
    level: "A0",
  });

  return {
    success: true as const,
    passed: true,
    correctCount,
    masteryRecorded: true,
    reviewTargetsAdded: reviewSeed.success ? reviewSeed.added : 0,
  };
}
