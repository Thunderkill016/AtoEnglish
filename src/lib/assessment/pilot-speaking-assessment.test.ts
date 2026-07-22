import { describe, expect, it } from "vitest";

import {
  BASELINE_SPEAKING_PROMPT,
  FINAL_SPEAKING_PROMPT,
  SPEAKING_RUBRIC,
  SPEAKING_RUBRIC_DIMENSIONS,
  calculateSpeakingImprovement,
  summarizeSpeakingScore,
} from "./pilot-speaking-assessment";

describe("pilot speaking assessment", () => {
  it("uses distinct baseline and final scenarios to reduce memorization", () => {
    expect(BASELINE_SPEAKING_PROMPT.id).toBe("baseline");
    expect(FINAL_SPEAKING_PROMPT.id).toBe("final");
    expect(FINAL_SPEAKING_PROMPT.scenario).not.toBe(
      BASELINE_SPEAKING_PROMPT.scenario,
    );
    expect(FINAL_SPEAKING_PROMPT.requiredActions).not.toEqual(
      BASELINE_SPEAKING_PROMPT.requiredActions,
    );
    expect(BASELINE_SPEAKING_PROMPT.prohibitedSupport).toContain(
      "a model answer",
    );
    expect(FINAL_SPEAKING_PROMPT.prohibitedSupport).toContain(
      "the baseline prompt",
    );
  });

  it("defines exactly four rubric dimensions with complete 0–3 levels", () => {
    expect(SPEAKING_RUBRIC.map((criterion) => criterion.id)).toEqual(
      SPEAKING_RUBRIC_DIMENSIONS,
    );
    expect(SPEAKING_RUBRIC).toHaveLength(4);

    for (const criterion of SPEAKING_RUBRIC) {
      expect(criterion.evidenceToNotice.length).toBeGreaterThanOrEqual(3);
      expect(criterion.levels.map((level) => level.score)).toEqual([0, 1, 2, 3]);
      expect(
        criterion.levels.every((level) => level.descriptor.length > 20),
      ).toBe(true);
    }
  });

  it("summarizes the four dimensions on a 12-point scale", () => {
    expect(
      summarizeSpeakingScore({
        taskCompletion: 3,
        comprehensibility: 2,
        targetChunks: 1,
        basicFluency: 0,
      }),
    ).toEqual({
      total: 6,
      maximum: 12,
      percentage: 50,
    });
  });

  it("reports point change and dimensions that improved", () => {
    expect(
      calculateSpeakingImprovement(
        {
          taskCompletion: 1,
          comprehensibility: 1,
          targetChunks: 0,
          basicFluency: 1,
        },
        {
          taskCompletion: 2,
          comprehensibility: 2,
          targetChunks: 2,
          basicFluency: 1,
        },
      ),
    ).toEqual({
      baseline: { total: 3, maximum: 12, percentage: 25 },
      final: { total: 7, maximum: 12, percentage: 58 },
      pointChange: 4,
      percentagePointChange: 33,
      improvedDimensions: [
        "taskCompletion",
        "comprehensibility",
        "targetChunks",
      ],
    });
  });
});
