import { describe, expect, it } from "vitest";

import { collapseCtcPosteriorSegments } from "./ctc";

describe("pronunciation-engine CTC posterior collapse", () => {
  it("collapses repeated tokens and separates repetitions across blank", () => {
    const segments = collapseCtcPosteriorSegments({
      tokenLabels: ["<pad>", "θ", "s"],
      blankTokenId: 0,
      audioDurationMs: 100,
      frames: [
        [0.05, 0.9, 0.05],
        [0.05, 0.9, 0.05],
        [0.9, 0.05, 0.05],
        [0.05, 0.9, 0.05],
        [0.05, 0.9, 0.05],
      ],
    });

    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({
      tokenId: 1,
      startFrame: 0,
      endFrameExclusive: 2,
      startMs: 0,
      endMs: 40,
    });
    expect(segments[1]).toMatchObject({
      tokenId: 1,
      startFrame: 3,
      endFrameExclusive: 5,
      startMs: 60,
      endMs: 100,
    });
  });

  it("keeps real top-k posterior probabilities without renormalizing", () => {
    const [segment] = collapseCtcPosteriorSegments(
      {
        tokenLabels: ["<pad>", "θ", "s", "t"],
        blankTokenId: 0,
        audioDurationMs: 40,
        frames: [
          [0.1, 0.5, 0.3, 0.1],
          [0.1, 0.4, 0.35, 0.15],
        ],
      },
      { topK: 2 },
    );

    expect(segment?.candidates).toEqual([
      { phone: "θ", probability: 0.45 },
      { phone: "s", probability: 0.325 },
    ]);
    expect(segment?.capturedProbabilityMass).toBeCloseTo(0.775, 10);
  });

  it("uses segment-average evidence rather than one lucky frame", () => {
    const [segment] = collapseCtcPosteriorSegments({
      tokenLabels: ["<pad>", "θ", "s"],
      blankTokenId: 0,
      audioDurationMs: 60,
      frames: [
        [0.05, 0.9, 0.05],
        [0.05, 0.51, 0.44],
        [0.05, 0.52, 0.43],
      ],
    });

    expect(segment?.candidates[0]?.phone).toBe("θ");
    expect(segment?.candidates[0]?.probability).toBeCloseTo(
      (0.9 + 0.51 + 0.52) / 3,
      10,
    );
    expect(segment?.candidates[1]?.phone).toBe("s");
  });

  it("suppresses special tokens from phone candidates", () => {
    const [segment] = collapseCtcPosteriorSegments({
      tokenLabels: ["<pad>", "θ", "<unk>", "s"],
      blankTokenId: 0,
      audioDurationMs: 20,
      frames: [[0.05, 0.55, 0.3, 0.1]],
    });

    expect(segment?.candidates.map((candidate) => candidate.phone)).toEqual([
      "θ",
      "s",
    ]);
  });

  it("rejects invalid posterior matrices", () => {
    expect(() =>
      collapseCtcPosteriorSegments({
        tokenLabels: ["<pad>", "θ"],
        blankTokenId: 0,
        audioDurationMs: 20,
        frames: [[0.4, 0.4]],
      }),
    ).toThrow("ctc_frame_must_sum_to_one");
  });
});
