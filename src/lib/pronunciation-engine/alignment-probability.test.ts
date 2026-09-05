import { describe, expect, it } from "vitest";

import { alignCanonicalPronunciation } from "./alignment";

describe("pronunciation-engine posterior mass handling", () => {
  it("preserves real top-k probabilities instead of renormalizing them", () => {
    const result = alignCanonicalPronunciation(
      { id: "theta", phones: ["θ"] },
      [
        {
          candidates: [
            { phone: "θ", probability: 0.4 },
            { phone: "s", probability: 0.3 },
          ],
        },
      ],
    );

    expect(result.alignment[0]?.observedProbability).toBeCloseTo(0.4, 10);
    expect(result.alignment[0]?.posteriorMargin).toBeCloseTo(0.1, 10);
  });

  it("penalizes omitted posterior mass conservatively", () => {
    const complete = alignCanonicalPronunciation(
      { id: "theta", phones: ["θ"] },
      [
        {
          candidates: [
            { phone: "θ", probability: 0.7 },
            { phone: "s", probability: 0.3 },
          ],
        },
      ],
    );

    const truncated = alignCanonicalPronunciation(
      { id: "theta", phones: ["θ"] },
      [
        {
          candidates: [
            { phone: "θ", probability: 0.4 },
            { phone: "s", probability: 0.3 },
          ],
        },
      ],
    );

    expect(truncated.normalizedCost).toBeGreaterThan(complete.normalizedCost);
  });

  it("rejects impossible probability mass", () => {
    expect(() =>
      alignCanonicalPronunciation(
        { id: "theta", phones: ["θ"] },
        [
          {
            candidates: [
              { phone: "θ", probability: 0.8 },
              { phone: "s", probability: 0.5 },
            ],
          },
        ],
      ),
    ).toThrow("phone_observation_probability_mass_exceeds_one");
  });
});
