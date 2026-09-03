import { describe, expect, it } from "vitest";

import {
  softmaxLogitMatrix,
  summarizePhonePosteriorSequence,
} from "./posterior";

describe("pronunciation-engine posterior evidence", () => {
  it("computes numerically stable softmax rows", () => {
    const rows = softmaxLogitMatrix([1000, 999, -1000, -999], 2, 2);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.[0]).toBeGreaterThan(rows[0]?.[1] ?? 1);
    expect(rows[1]?.[1]).toBeGreaterThan(rows[1]?.[0] ?? 1);
    expect((rows[0]?.[0] ?? 0) + (rows[0]?.[1] ?? 0)).toBeCloseTo(1, 10);
  });

  it("preserves expected-phone posterior and competitor margin", () => {
    const summary = summarizePhonePosteriorSequence(
      {
        phones: ["θ", "s", "t"],
        frames: [
          [0.8, 0.15, 0.05],
          [0.7, 0.2, 0.1],
          [0.6, 0.3, 0.1],
        ],
      },
      "θ",
    );
    const expectedMeanMargin = (0.65 + 0.5 + 0.3) / 3;

    expect(summary.expected?.phone).toBe("θ");
    expect(summary.expected?.meanPosterior).toBeCloseTo(0.7, 8);
    expect(summary.expected?.top1Occupancy).toBe(1);
    expect(summary.expected?.meanMarginToBestCompetitor).toBeCloseTo(
      expectedMeanMargin,
      8,
    );
    expect(summary.meanTop2Margin).toBeCloseTo(expectedMeanMargin, 8);
  });

  it("reports uncertainty when a confusion dominates some frames", () => {
    const summary = summarizePhonePosteriorSequence(
      {
        phones: ["θ", "s", "t"],
        frames: [
          [0.65, 0.3, 0.05],
          [0.35, 0.6, 0.05],
          [0.55, 0.4, 0.05],
        ],
      },
      "θ",
    );

    expect(summary.expected?.top1Occupancy).toBeCloseTo(2 / 3, 8);
    expect(summary.expected?.meanMarginToBestCompetitor).toBeLessThan(0.2);
    expect(summary.meanTemporalVariation).toBeGreaterThan(0);
  });

  it("distinguishes sharp stable posteriors from diffuse posteriors", () => {
    const sharp = summarizePhonePosteriorSequence({
      phones: ["θ", "s", "t"],
      frames: [
        [0.98, 0.01, 0.01],
        [0.98, 0.01, 0.01],
      ],
    });
    const diffuse = summarizePhonePosteriorSequence({
      phones: ["θ", "s", "t"],
      frames: [
        [0.34, 0.33, 0.33],
        [0.34, 0.33, 0.33],
      ],
    });

    expect(sharp.normalizedMeanEntropy).toBeLessThan(diffuse.normalizedMeanEntropy);
    expect(sharp.meanTop2Margin).toBeGreaterThan(diffuse.meanTop2Margin);
    expect(sharp.meanTemporalVariation).toBe(0);
  });

  it("rejects truncated or invalid probability rows", () => {
    expect(() =>
      summarizePhonePosteriorSequence({
        phones: ["θ", "s"],
        frames: [[0.5, 0.2]],
      }),
    ).toThrow("posterior_frame_must_sum_to_one");

    expect(() => softmaxLogitMatrix([1, 2, 3], 2, 2)).toThrow(
      "invalid_logit_matrix_shape",
    );
  });
});
