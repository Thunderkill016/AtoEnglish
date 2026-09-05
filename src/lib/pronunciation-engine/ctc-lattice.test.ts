import { describe, expect, it } from "vitest";

import type { CtcPosteriorMatrix } from "./ctc";
import { canonicalCtcForwardBackward, canonicalCtcLogLikelihood } from "./ctc-lattice";

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

describe("canonical CTC forward-backward", () => {
  const matrix: CtcPosteriorMatrix = {
    tokenLabels: ["<pad>", "θ", "s"],
    blankTokenId: 0,
    audioDurationMs: 40,
    frames: [[0.6, 0.4, 0], [0.7, 0.3, 0]],
  };

  it("matches manually enumerated path posteriors and occupancy duration", () => {
    const result = canonicalCtcForwardBackward(matrix, [1]);
    // Valid paths: θθ (0.12), θ_ (0.28), _θ (0.18).
    const mass = 0.58;
    const expected = [[0.18 / mass, 0.4 / mass, 0], [0, 0.3 / mass, 0.28 / mass]];
    result.statePosteriors.forEach((row, t) => {
      row.forEach((value, s) => expect(value).toBeCloseTo(expected[t][s], 12));
      expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    });
    expect(result.extendedTarget).toEqual([0, 1, 0]);
    expect(result.canonicalPhonePositionByState).toEqual([null, 0, null]);
    expect(result.minimumRequiredFrames).toBe(1);
    expect(result.phones[0]).toMatchObject({ canonicalPhonePosition: 0, tokenId: 1, stateIndex: 1, peakSupportFrame: 0 });
    expect(result.phones[0].expectedOccupiedFrames).toBeCloseTo(0.7 / mass, 12);
    expect(result.phones[0].expectedDurationMs).toBeCloseTo(20 * 0.7 / mass, 12);
    expect(result.phones[0].peakPosterior).toBeCloseTo(0.4 / mass, 12);
  });

  it("retains phone occupancy under blank-dominant and competitor-dominant frames", () => {
    for (const frame of [[0.6, 0.35, 0.05], [0.05, 0.05, 0.9]]) {
      const result = canonicalCtcForwardBackward({ ...matrix, frames: [frame, frame, frame] }, [1]);
      expect(result.phones[0].expectedOccupiedFrames).toBeGreaterThan(0);
      for (const row of result.statePosteriors) {
        expect(row[1]).toBeGreaterThan(0);
        expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
      }
    }
  });

  it("requires an intervening blank and keeps repeated phone positions distinct", () => {
    const repeated = { ...matrix, frames: [[0.1, 0.9, 0], [0.8, 0.2, 0], [0.1, 0.9, 0]], audioDurationMs: 90 };
    const result = canonicalCtcForwardBackward(repeated, [1, 1]);
    expect(result.minimumRequiredFrames).toBe(3);
    expect(result.canonicalPhonePositionByState).toEqual([null, 0, null, 1, null]);
    const onlyLegalStates = [1, 2, 3];
    result.statePosteriors.forEach((row, t) => row.forEach((value, s) => {
      expect(value).toBeCloseTo(s === onlyLegalStates[t] ? 1 : 0, 12);
    }));
    result.phones.forEach((phone, position) => {
      expect(phone.canonicalPhonePosition).toBe(position);
      expect(phone.expectedOccupiedFrames).toBeCloseTo(1, 12);
      expect(phone.expectedDurationMs).toBeCloseTo(30, 12);
    });
    expect(() => canonicalCtcForwardBackward(matrix, [1, 1])).toThrow("ctc_canonical_target_requires_more_frames");
    expect(() => canonicalCtcForwardBackward({ ...repeated, frames: [[0, 1, 0], [0, 1, 0], [0, 1, 0]] }, [1, 1])).toThrow("ctc_canonical_target_has_zero_probability_mass");
  });

  it("handles a single frame and adjacent distinct labels with a nonzero blank ID", () => {
    const input = { tokenLabels: ["θ", "s", "<pad>"], blankTokenId: 2, audioDurationMs: 20, frames: [[0.4, 0.2, 0.4]] };
    const single = canonicalCtcForwardBackward(input, [0]);
    expect(single.statePosteriors).toEqual([[0, 1, 0]]);
    expect(single.phones[0].expectedDurationMs).toBe(20);
    const adjacent = canonicalCtcForwardBackward({ ...input, frames: [[0.4, 0.2, 0.4], [0.3, 0.5, 0.2]] }, [0, 1]);
    adjacent.statePosteriors.forEach((row, t) => row.forEach((value, s) => {
      expect(value).toBeCloseTo(s === 2 * t + 1 ? 1 : 0, 12);
    }));
  });

  it.each([[1], [2], [1, 2], [1, 1], [1, 2, 1]])("agrees with forward likelihood and conserves frame mass for %j", (...target) => {
    const input = { ...matrix, frames: [[0.6, 0.3, 0.1], [0.2, 0.3, 0.5], [0.7, 0.1, 0.2], [0.1, 0.6, 0.3], [0.5, 0.2, 0.3]] };
    const result = canonicalCtcForwardBackward(input, target);
    expect(result.logLikelihood).toBeCloseTo(canonicalCtcLogLikelihood(input, target).logLikelihood, 12);
    for (const row of result.statePosteriors) {
      expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
      row.forEach((value) => { expect(value).toBeGreaterThanOrEqual(0); expect(value).toBeLessThanOrEqual(1 + 1e-12); });
    }
  });

  it("stays finite when complete path probabilities underflow outside log space", () => {
    const input = { ...matrix, frames: Array.from({ length: 400 }, () => [0.1, 0.01, 0.89]) };
    const result = canonicalCtcForwardBackward(input, [1]);
    expect(Math.exp(result.logLikelihood)).toBe(0);
    expect(Number.isFinite(result.logLikelihood)).toBe(true);
    result.statePosteriors.forEach((row) => {
      expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 9);
    });
    expect(Number.isFinite(result.phones[0].expectedDurationMs)).toBe(true);
  });

  it("preserves explicit rejection of invalid inputs and zero mass", () => {
    for (const target of [[], [0], [3], [-1], [1.5], [NaN], [2]]) {
      let expectedError = "";
      try { canonicalCtcLogLikelihood(matrix, target); } catch (error) { expectedError = (error as Error).message; }
      expect(expectedError).not.toBe("");
      expect(() => canonicalCtcForwardBackward(matrix, target)).toThrow(expectedError);
    }
    expect(() => canonicalCtcForwardBackward({ ...matrix, frames: [] }, [1])).toThrow("ctc_frames_required");
    expect(() => canonicalCtcForwardBackward({ ...matrix, audioDurationMs: 0 }, [1])).toThrow("ctc_audio_duration_required");
    expect(() => canonicalCtcForwardBackward({ ...matrix, frames: [[NaN, 1, 0]] }, [1])).toThrow("ctc_probability_out_of_range");
  });
});
