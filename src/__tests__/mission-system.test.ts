import { describe, expect, it } from "vitest";

import { PILOT_LESSON_SPECS } from "@/lib/lessons/pilot-lessons";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";
import {
  evaluateMissionTranscript,
  selectDueTransferVariant,
} from "@/lib/missions/mission-evaluator";
import {
  createMissionSession,
  transitionMissionSession,
} from "@/lib/missions/mission-engine";
import { validateMissionSpec } from "@/lib/missions/mission-spec";

describe("Gold Mission 01", () => {
  it("satisfies the bounded mission contract", () => {
    expect(validateMissionSpec(GOLD_MISSION_01)).toEqual([]);
    expect(GOLD_MISSION_01.targetChunks).toHaveLength(8);
    expect(GOLD_MISSION_01.evaluation.maxCorrections).toBe(2);
    expect(GOLD_MISSION_01.review.transferAfterDays).toEqual([1, 7, 30]);
  });

  it("is attached to the first 15-minute pilot lesson", () => {
    const lesson = PILOT_LESSON_SPECS["unit-a0-1"];
    expect(lesson.mission?.id).toBe(GOLD_MISSION_01.id);
    expect(lesson.estimatedTime).toBe(15);
    expect(lesson.canDo).toEqual([GOLD_MISSION_01.canDoVi]);
    expect(lesson.assessment.activityIds).toEqual(["unit-a0-1:section:7"]);
  });
});

describe("mission evaluator", () => {
  it("scores task completion without claiming pronunciation evidence", () => {
    const result = evaluateMissionTranscript(GOLD_MISSION_01, [
      "Hi, I am Minh.",
      "I work as a designer at Ato.",
      "What is your name?",
      "Sorry, could you say that again?",
    ]);

    expect(result.taskCompleted).toBe(true);
    expect(result.taskScore).toBe(100);
    expect(result.missingIntentIds).toEqual([]);
    expect(result.rubric.pronunciation).toBeNull();
    expect(result.rubric.comprehensibility).toBeNull();
    expect(result.evidence.acousticEvidenceAvailable).toBe(false);
  });

  it("limits feedback to the two highest-value corrections", () => {
    const result = evaluateMissionTranscript(GOLD_MISSION_01, [
      "My name Minh. I work designer.",
    ]);

    expect(result.taskCompleted).toBe(false);
    expect(result.corrections).toHaveLength(2);
    expect(result.corrections.map((item) => item.code)).toEqual([
      "missing_be_after_my_name",
      "missing_work_as",
    ]);
    expect(result.retryRequired).toBe(true);
  });

  it("returns unscored when no reliable transcript exists", () => {
    const result = evaluateMissionTranscript(GOLD_MISSION_01, [""]);
    expect(result.status).toBe("unscored");
    expect(result.taskScore).toBeNull();
    expect(result.retryRequired).toBe(true);
  });

  it("scores the retry independently from a perfect first attempt", () => {
    const result = evaluateMissionTranscript(GOLD_MISSION_01, [
      "Hi, I am Minh.",
      "I work as a designer.",
      "What is your name?",
      "Could you say that again?",
      "Hello.",
    ]);

    expect(result.taskCompleted).toBe(false);
    expect(result.taskScore).toBe(0);
    expect(result.completedIntentIds).toEqual([]);
  });
});

describe("mission state machine", () => {
  it("requires feedback and retry before transfer when corrections exist", () => {
    let state = createMissionSession(GOLD_MISSION_01);
    state = transitionMissionSession(GOLD_MISSION_01, state, { type: "START" });
    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "MODEL_COMPLETE",
    });
    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "GUIDED_COMPLETE",
    });

    for (const transcript of [
      "My name Minh.",
      "I work designer.",
      "Hello.",
      "Okay.",
    ]) {
      state = transitionMissionSession(GOLD_MISSION_01, state, {
        type: "SUBMIT_TURN",
        transcript,
      });
    }

    const firstEvaluation = evaluateMissionTranscript(
      GOLD_MISSION_01,
      state.transcripts,
    );
    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "EVALUATE",
      result: firstEvaluation,
    });
    expect(state.stage).toBe("feedback");

    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "SHOW_FEEDBACK",
    });
    expect(state.stage).toBe("retry");

    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "SUBMIT_RETRY",
      transcript:
        "My name is Minh. I work as a designer. What is your name? Could you say that again?",
    });
    const retryEvaluation = evaluateMissionTranscript(
      GOLD_MISSION_01,
      state.transcripts,
    );
    state = transitionMissionSession(GOLD_MISSION_01, state, {
      type: "RETRY_EVALUATED",
      result: retryEvaluation,
    });

    expect(state.stage).toBe("transfer");
    expect(state.evaluation?.taskCompleted).toBe(true);
    expect(state.attempts).toBe(2);
  });
});

describe("transfer scheduling", () => {
  const completedAt = new Date("2026-08-01T00:00:00.000Z");

  it("selects the latest due variant at day 1, 7 and 30", () => {
    expect(
      selectDueTransferVariant(
        GOLD_MISSION_01,
        completedAt,
        new Date("2026-08-02T00:00:00.000Z"),
      )?.dueAfterDays,
    ).toBe(1);
    expect(
      selectDueTransferVariant(
        GOLD_MISSION_01,
        completedAt,
        new Date("2026-08-08T00:00:00.000Z"),
      )?.dueAfterDays,
    ).toBe(7);
    expect(
      selectDueTransferVariant(
        GOLD_MISSION_01,
        completedAt,
        new Date("2026-08-31T00:00:00.000Z"),
      )?.dueAfterDays,
    ).toBe(30);
  });
});
