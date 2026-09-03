import { describe, expect, it } from "vitest";

import type { CtcPosteriorMatrix } from "./ctc";
import { canonicalCtcLogLikelihood } from "./ctc-lattice";

describe("canonical CTC lattice", () => {
  it("matches the exact path sum for a one-phone target", () => {
    const matrix: CtcPosteriorMatrix = {
      tokenLabels: ["<pad>", "θ"],
      blankTokenId: 0,
      audioDurationMs: 40,
      frames: [
        [0.6, 0.4],
        [0.7, 0.3],
      ],
    };

    const result = canonicalCtcLogLikelihood(matrix, [1]);
    const exactProbability = 0.4 * 0.3 + 0.4 * 0.7 + 0.6 * 0.3;

    expect(Math.exp(result.logLikelihood)).toBeCloseTo(exactProbability, 12);
  });

  it("recovers target evidence even when greedy top-1 is blank on every frame", () => {
    const matrix: CtcPosteriorMatrix = {
      tokenLabels: ["<pad>", "θ", "s"],
      blankTokenId: 0,
      audioDurationMs: 60,
      frames: [
        [0.6, 0.35, 0.05],
        [0.6, 0.35, 0.05],
        [0.6, 0.35, 0.05],
      ],
    };

    const result = canonicalCtcLogLikelihood(matrix, [1]);

    expect(Number.isFinite(result.logLikelihood)).toBe(true);
    expect(result.extendedTarget).toEqual([0, 1, 0]);
    expect(result.minimumRequiredFrames).toBe(1);
  });

  it("assigns higher sequence likelihood to the acoustically supported canonical target", () => {
    const matrix: CtcPosteriorMatrix = {
      tokenLabels: ["<pad>", "θ", "s", "ɪ"],
      blankTokenId: 0,
      audioDurationMs: 60,
      frames: [
        [0.1, 0.8, 0.1, 0],
        [0.8, 0.1, 0.05, 0.05],
        [0.1, 0.05, 0.05, 0.8],
      ],
    };

    const thinkLike = canonicalCtcLogLikelihood(matrix, [1, 3]);
    const sinkLike = canonicalCtcLogLikelihood(matrix, [2, 3]);

    expect(thinkLike.logLikelihood).toBeGreaterThan(sinkLike.logLikelihood);
  });

  it("requires an intervening blank for repeated canonical labels", () => {
    const tooShort: CtcPosteriorMatrix = {
      tokenLabels: ["<pad>", "θ"],
      blankTokenId: 0,
      audioDurationMs: 40,
      frames: [
        [0.1, 0.9],
        [0.1, 0.9],
      ],
    };

    expect(() => canonicalCtcLogLikelihood(tooShort, [1, 1])).toThrow(
      "ctc_canonical_target_requires_more_frames",
    );

    const valid: CtcPosteriorMatrix = {
      ...tooShort,
      audioDurationMs: 60,
      frames: [
        [0.05, 0.95],
        [0.95, 0.05],
        [0.05, 0.95],
      ],
    };

    expect(
      Number.isFinite(canonicalCtcLogLikelihood(valid, [1, 1]).logLikelihood),
    ).toBe(true);
  });

  it("rejects invalid canonical targets and zero-probability paths", () => {
    const matrix: CtcPosteriorMatrix = {
      tokenLabels: ["<pad>", "θ", "s"],
      blankTokenId: 0,
      audioDurationMs: 40,
      frames: [
        [0.5, 0.5, 0],
        [0.5, 0.5, 0],
      ],
    };

    expect(() => canonicalCtcLogLikelihood(matrix, [])).toThrow(
      "ctc_canonical_target_required",
    );
    expect(() => canonicalCtcLogLikelihood(matrix, [0])).toThrow(
      "ctc_canonical_target_cannot_contain_blank",
    );
    expect(() => canonicalCtcLogLikelihood(matrix, [3])).toThrow(
      "ctc_canonical_token_out_of_range",
    );
    expect(() => canonicalCtcLogLikelihood(matrix, [2])).toThrow(
      "ctc_canonical_target_has_zero_probability_mass",
    );
  });
});
