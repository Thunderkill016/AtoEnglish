"use server";

import { z } from "zod";

import { seedUnitVocabToSRS } from "@/app/actions/cards";
import { recordLearningAttempts } from "@/app/actions/learning-attempts";
import { completeUnit } from "@/app/actions/unit";
import { getMissionForLesson } from "@/lib/missions/mission-catalog";

const missionCheckpointClaimSchema = z
  .object({
    sessionId: z.string().uuid(),
    lessonId: z.string().min(1),
    answers: z.record(z.string(), z.string()),
  })
  .strict();

export async function claimMissionCheckpoint(input: unknown) {
  const parsed = missionCheckpointClaimSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Kết quả checkpoint không hợp lệ." };
  }

  const mission = getMissionForLesson(parsed.data.lessonId);
  if (!mission) {
    return { success: false as const, error: "Không tìm thấy mission tương ứng." };
  }

  const allAnswered = mission.checkpoint.questions.every(
    (question) => parsed.data.answers[question.id] !== undefined,
  );
  if (!allAnswered) {
    return {
      success: false as const,
      error: "Bạn cần trả lời đủ các câu checkpoint.",
    };
  }

  const correctCount = mission.checkpoint.questions.filter(
    (question) => parsed.data.answers[question.id] === question.answer,
  ).length;
  const passed = correctCount >= mission.checkpoint.passThreshold;

  const attemptResult = await recordLearningAttempts({
    sessionId: parsed.data.sessionId,
    lessonId: mission.lessonId,
    attempts: mission.checkpoint.questions.map((question) => {
      const correct = parsed.data.answers[question.id] === question.answer;
      return {
        activityId: `${mission.lessonId}:checkpoint:${question.id}`,
        modality: "checkpoint" as const,
        status: "scored" as const,
        score: correct ? 100 : 0,
        errorTags: correct ? [] : ["answer_mismatch"],
        evaluator: "deterministic-answer-key",
        evaluatorVersion: "2.0.0",
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
      totalCount: mission.checkpoint.questions.length,
      masteryRecorded: false,
      reviewTargetsAdded: 0,
    };
  }

  const perfect = correctCount === mission.checkpoint.questions.length;
  const completion = await completeUnit(mission.lessonId, perfect ? 3 : 2);
  if (!completion.success) {
    return {
      success: false as const,
      error: completion.error || "Không thể ghi nhận mastery.",
    };
  }

  const reviewSeed = await seedUnitVocabToSRS({
    vocab: mission.targetChunks.map((chunk) => ({
      word: chunk.english,
      phonetic: null,
      meaning_vn: `${chunk.vietnamese} — ${chunk.useWhenVi}`,
      example_en: chunk.english.replace("...", "Minh"),
    })),
    topic: mission.titleVi,
    level: "A0",
  });

  return {
    success: true as const,
    passed: true,
    correctCount,
    totalCount: mission.checkpoint.questions.length,
    masteryRecorded: true,
    reviewTargetsAdded: reviewSeed.success ? reviewSeed.added : 0,
  };
}
