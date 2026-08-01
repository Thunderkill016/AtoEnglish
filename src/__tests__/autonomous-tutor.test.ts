import { describe, expect, it } from "vitest";

import {
  diagnoseTutorResponse,
  evaluateTutorFullTask,
  evaluateTutorIntent,
  scaffoldForAttempt,
  tutorMasteryPassed,
} from "@/lib/missions/autonomous-tutor";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";

describe("autonomous mastery tutor", () => {
  it("diagnoses only missing or malformed intents", () => {
    const diagnosis = diagnoseTutorResponse(
      GOLD_MISSION_01,
      "Hi, I'm Minh. I work developer.",
    );

    expect(diagnosis.independentIntentIds).toContain("introduce_name");
    expect(diagnosis.focusIntentIds).toEqual(
      expect.arrayContaining(["state_role", "ask_name", "repair_request"]),
    );
    expect(diagnosis.focusIntentIds).not.toContain("introduce_name");
  });

  it("does not treat a Vietnamese learner error as mastered", () => {
    const stateRole = GOLD_MISSION_01.intents.find(
      (intent) => intent.id === "state_role",
    );

    expect(stateRole).toBeDefined();
    expect(evaluateTutorIntent(stateRole!, "I work developer.").passed).toBe(
      false,
    );
    expect(
      evaluateTutorIntent(stateRole!, "I work as a developer.").passed,
    ).toBe(true);
  });

  it("requires all intents and no known correction before mastery", () => {
    const incomplete = evaluateTutorFullTask(
      GOLD_MISSION_01,
      "Hi, I'm Minh. I work as a developer.",
    );
    const complete = evaluateTutorFullTask(
      GOLD_MISSION_01,
      "Hi, I'm Minh. I work as a developer. What's your name? Sorry, I didn't catch that. Could you say that again?",
    );

    expect(tutorMasteryPassed(incomplete)).toBe(false);
    expect(tutorMasteryPassed(complete)).toBe(true);
  });

  it("reveals support gradually instead of showing the answer immediately", () => {
    const example = "Could you say that again?";

    expect(scaffoldForAttempt(example, 0)).toBeNull();
    expect(scaffoldForAttempt(example, 1)).toBe("Could you …");
    expect(scaffoldForAttempt(example, 2)).toBe(example);
  });
});
