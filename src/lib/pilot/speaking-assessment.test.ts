import { describe, expect, it } from "vitest";

import {
  ASSESSMENT_MAX_SCORE,
  PILOT_REQUIRED_FUNCTIONS,
  PILOT_SPEAKING_PROMPTS,
  PILOT_SPEAKING_RUBRIC,
  SPEAKING_CRITERIA,
  compareSpeakingAssessments,
  scoreSpeakingAssessment,
  type SpeakingScores,
} from "./speaking-assessment";

const scores = (overrides: Partial<SpeakingScores> = {}): SpeakingScores => ({
  taskCompletion: 0,
  comprehensibility: 0,
  targetChunks: 0,
  basicFluency: 0,
  ...overrides,
});

describe("pilot speaking prompts", () => {
  it("uses distinct baseline and final situations while measuring the same functions", () => {
    const baseline = PILOT_SPEAKING_PROMPTS.baseline;
    const final = PILOT_SPEAKING_PROMPTS.final;

    expect(baseline.id).not.toBe(final.id);
    expect(baseline.scenario).not.toBe(final.scenario);
    expect(baseline.followUpQuestions).not.toEqual(final.followUpQuestions);
    expect(baseline.repairCheck.utterance).not.toBe(final.repairCheck.utterance);
    expect(baseline.requiredFunctions).toEqual(PILOT_REQUIRED_FUNCTIONS);
    expect(final.requiredFunctions).toEqual(PILOT_REQUIRED_FUNCTIONS);
    expect(PILOT_REQUIRED_FUNCTIONS).toContain(
      "ask for repetition or slower speech during the repair check",
    );
  });

  it("keeps administration conditions comparable", () => {
    const baseline = PILOT_SPEAKING_PROMPTS.baseline;
    const final = PILOT_SPEAKING_PROMPTS.final;

    expect(baseline.preparationSeconds).toBe(30);
    expect(final.preparationSeconds).toBe(30);
    expect(baseline.responseSeconds).toBe(90);
    expect(final.responseSeconds).toBe(90);
    expect(baseline.followUpQuestions).toHaveLength(5);
    expect(final.followUpQuestions).toHaveLength(5);

    for (const prompt of Object.values(PILOT_SPEAKING_PROMPTS)) {
      expect(prompt.repairCheck).toMatchObject({
        delivery: "natural-brisk",
        waitSeconds: 5,
        showText: false,
        repeatOnlyAfterLearnerRequest: true,
      });
    }
  });

  it("creates a standardized opportunity to demonstrate a repair phrase", () => {
    for (const prompt of Object.values(PILOT_SPEAKING_PROMPTS)) {
      expect(prompt.repairCheck.utterance.length).toBeGreaterThan(20);

      const protocol = prompt.assessorProtocol.join(" ");
      expect(protocol).toMatch(/repair check/i);
      expect(protocol).toMatch(/không hiển thị/i);
      expect(protocol).toMatch(/Chỉ lặp lại hoặc nói chậm/i);
      expect(protocol).toMatch(/không gợi ý/i);
    }
  });

  it("does not expose a full model answer in either prompt", () => {
    for (const prompt of Object.values(PILOT_SPEAKING_PROMPTS)) {
      const text = [
        prompt.scenario,
        ...prompt.learnerInstructions,
        ...prompt.followUpQuestions,
        prompt.repairCheck.utterance,
      ].join(" ");

      expect(text).not.toMatch(/My name is .* I work/i);
      expect(text).not.toMatch(/sample answer|câu trả lời mẫu/i);
    }
  });
});

describe("pilot speaking rubric", () => {
  it("defines exactly four criteria with complete 0-3 anchors", () => {
    expect(SPEAKING_CRITERIA).toEqual([
      "taskCompletion",
      "comprehensibility",
      "targetChunks",
      "basicFluency",
    ]);
    expect(PILOT_SPEAKING_RUBRIC).toHaveLength(4);

    for (const criterion of PILOT_SPEAKING_RUBRIC) {
      expect(Object.keys(criterion.anchors)).toEqual(["0", "1", "2", "3"]);
      expect(Object.values(criterion.anchors).every(Boolean)).toBe(true);
    }
  });

  it("states that comprehensibility is not native-accent imitation", () => {
    const criterion = PILOT_SPEAKING_RUBRIC.find(
      ({ id }) => id === "comprehensibility",
    );

    expect(criterion?.description).toMatch(/Không chấm.*giọng bản xứ/i);
  });

  it("requires independent repair language for the highest functional score", () => {
    const taskCompletion = PILOT_SPEAKING_RUBRIC.find(
      ({ id }) => id === "taskCompletion",
    );
    const targetChunks = PILOT_SPEAKING_RUBRIC.find(
      ({ id }) => id === "targetChunks",
    );

    expect(taskCompletion?.anchors[3]).toMatch(/repair check/i);
    expect(targetChunks?.anchors[3]).toMatch(/nhắc lại|nói chậm/i);
  });
});

describe("scoreSpeakingAssessment", () => {
  it("calculates the total, percentage and core outcome gate", () => {
    const result = scoreSpeakingAssessment(
      scores({
        taskCompletion: 2,
        comprehensibility: 2,
        targetChunks: 1,
        basicFluency: 1,
      }),
    );

    expect(ASSESSMENT_MAX_SCORE).toBe(12);
    expect(result.total).toBe(6);
    expect(result.percentage).toBe(50);
    expect(result.meetsPilotOutcome).toBe(true);
  });

  it("does not allow a high total to hide a weak core outcome", () => {
    const result = scoreSpeakingAssessment(
      scores({
        taskCompletion: 1,
        comprehensibility: 3,
        targetChunks: 3,
        basicFluency: 3,
      }),
    );

    expect(result.total).toBe(10);
    expect(result.meetsPilotOutcome).toBe(false);
  });

  it("rejects invalid runtime scores", () => {
    expect(() =>
      scoreSpeakingAssessment(
        scores({ taskCompletion: 4 as SpeakingScores["taskCompletion"] }),
      ),
    ).toThrow(RangeError);

    expect(() =>
      scoreSpeakingAssessment(
        scores({ basicFluency: 1.5 as SpeakingScores["basicFluency"] }),
      ),
    ).toThrow(RangeError);
  });
});

describe("compareSpeakingAssessments", () => {
  it("reports criterion-level and total improvement", () => {
    const comparison = compareSpeakingAssessments(
      scores({
        taskCompletion: 1,
        comprehensibility: 1,
        targetChunks: 1,
        basicFluency: 0,
      }),
      scores({
        taskCompletion: 2,
        comprehensibility: 2,
        targetChunks: 2,
        basicFluency: 1,
      }),
    );

    expect(comparison.totalDelta).toBe(4);
    expect(comparison.percentagePointDelta).toBe(33);
    expect(comparison.improvedCriteria).toEqual([
      "taskCompletion",
      "comprehensibility",
      "targetChunks",
      "basicFluency",
    ]);
    expect(comparison.improvedAtLeastOneCoreCriterion).toBe(true);
  });

  it("does not claim core improvement from fluency alone", () => {
    const comparison = compareSpeakingAssessments(
      scores({ taskCompletion: 2, comprehensibility: 2, basicFluency: 0 }),
      scores({ taskCompletion: 2, comprehensibility: 2, basicFluency: 2 }),
    );

    expect(comparison.totalDelta).toBe(2);
    expect(comparison.improvedAtLeastOneCoreCriterion).toBe(false);
  });
});
