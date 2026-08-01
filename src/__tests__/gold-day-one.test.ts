import { describe, expect, it } from "vitest";

import { GOLD_DAY_ONE_UNIT } from "@/lib/lessons/gold-day-one";
import { PILOT_LESSON_SPECS } from "@/lib/lessons/pilot-lessons";
import {
  evaluateMissionTranscript,
} from "@/lib/missions/mission-evaluator";
import {
  createMissionSession,
  transitionMissionSession,
} from "@/lib/missions/mission-engine";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";

describe("Gold Day 1", () => {
  it("ships only the six chunks needed for the first speaking outcome", () => {
    const lesson = PILOT_LESSON_SPECS["unit-a0-1"];
    const chunkIds = GOLD_MISSION_01.targetChunks.map((chunk) => chunk.id);

    expect(chunkIds).toEqual([
      "introduce-name",
      "state-role",
      "ask-name",
      "nice-to-meet",
      "repeat",
      "did-not-catch",
    ]);
    expect(GOLD_DAY_ONE_UNIT.vocab.map((item) => item.word)).toEqual(
      GOLD_MISSION_01.targetChunks.map((chunk) => chunk.english),
    );
    expect(lesson.vocab).toHaveLength(6);
    expect(lesson.mission?.checkpoint.passThreshold).toBe(4);
    expect(lesson.assessment.canDoEvidence).toHaveLength(4);

    const serializedLesson = JSON.stringify(lesson).toLowerCase();
    for (const legacyTopic of [
      "bảng 26",
      "bảng chữ cái",
      "the alphabet",
      "capital letter",
      "spell your name",
    ]) {
      expect(serializedLesson).not.toContain(legacyTopic);
    }
  });

  it("limits feedback to the two highest-priority corrections", () => {
    const result = evaluateMissionTranscript(GOLD_MISSION_01, [
      "My name Minh.",
      "I work developer.",
      "Nice to meet you.",
      "Hello.",
    ]);

    expect(result.taskCompleted).toBe(false);
    expect(result.corrections).toHaveLength(2);
    expect(result.corrections.map((correction) => correction.code)).toEqual([
      "missing_be_after_my_name",
      "missing_work_as",
    ]);
    expect(result.rubric.pronunciation).toBeNull();
  });

  it("completes scenario, roleplay, feedback, full-task retry and transfer", () => {
    let session = createMissionSession(GOLD_MISSION_01);

    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "START",
    });
    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "MODEL_COMPLETE",
    });
    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "GUIDED_COMPLETE",
    });

    for (const transcript of [
      "Hi, I'm Minh.",
      "I work as a developer.",
      "What's your name?",
      "Could you say that again?",
    ]) {
      session = transitionMissionSession(GOLD_MISSION_01, session, {
        type: "SUBMIT_TURN",
        transcript,
      });
    }

    const firstEvaluation = evaluateMissionTranscript(
      GOLD_MISSION_01,
      session.transcripts,
    );
    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "EVALUATE",
      result: firstEvaluation,
    });

    expect(firstEvaluation.taskScore).toBe(100);
    expect(firstEvaluation.completedIntentIds).toEqual([
      "introduce_name",
      "state_role",
      "ask_name",
      "repair_request",
    ]);
    expect(session.stage).toBe("feedback");

    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "SHOW_FEEDBACK",
    });
    expect(session.stage).toBe("retry");

    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "SUBMIT_RETRY",
      transcript:
        "Hi, I'm Minh. I work as a developer. What's your name? Sorry, I didn't catch that. Could you say that again?",
    });
    const retryEvaluation = evaluateMissionTranscript(
      GOLD_MISSION_01,
      session.transcripts,
    );
    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "RETRY_EVALUATED",
      result: retryEvaluation,
    });

    expect(retryEvaluation.taskScore).toBe(100);
    expect(session.stage).toBe("transfer");
    expect(session.attempts).toBe(2);

    session = transitionMissionSession(GOLD_MISSION_01, session, {
      type: "COMPLETE",
    });
    expect(session).toMatchObject({ stage: "completed", completed: true });
  });
});
