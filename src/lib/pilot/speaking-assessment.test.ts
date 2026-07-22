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
    expect(baseline.requiredFunctions).toEqual(PILOT_REQUIRED_FUNCTIONS);
    expect(final.requiredFunctions).toEqual(PILOT_REQUIRED_FUNCTIONS);
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
  });

  it("does not expose a full model answer in either prompt", () => {
    for (const prompt of Object.values(PILOT_SPEAKING_PROMPTS)) {
      const text = [
        prompt.scenario,
        ...prompt.learnerInstructions,
        ...prompt.followUpQuestions,
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
