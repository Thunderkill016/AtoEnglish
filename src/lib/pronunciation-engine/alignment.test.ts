import { describe, expect, it } from "vitest";

import {
  alignCanonicalPronunciation,
  selectBestCanonicalPronunciation,
} from "./alignment";
import { deriveUncalibratedSegmentalEvidence } from "./evidence";
import type { CanonicalPronunciation, ObservedPhone } from "./types";

function top1(phone: string): ObservedPhone {
  return { candidates: [{ phone, probability: null }] };
}

const THINK: CanonicalPronunciation = {
  id: "think-general",
  phones: ["θ", "ɪ", "ŋ", "k"],
};

describe("pronunciation-engine alignment", () => {
  it("aligns an exact production at zero cost", () => {
    const result = alignCanonicalPronunciation(THINK, [
      top1("θ"),
      top1("ɪ"),
      top1("ŋ"),
      top1("k"),
    ]);

    expect(result.normalizedCost).toBe(0);
    expect(result.alignment.map((item) => item.kind)).toEqual([
      "match",
      "match",
      "match",
      "match",
    ]);
  });

  it("diagnoses a deliberate theta-to-s substitution", () => {
    const result = alignCanonicalPronunciation(THINK, [
      top1("s"),
      top1("ɪ"),
      top1("ŋ"),
      top1("k"),
    ]);

    expect(result.alignment[0]).toMatchObject({
      kind: "substitution",
      expected: "θ",
      observed: "s",
      observedProbability: null,
      posteriorMargin: null,
      articulatoryDelta: {
        place: { expected: "dental", observed: "alveolar" },
      },
    });

    expect(result.alignment.slice(1).every((item) => item.kind === "match")).toBe(
      true,
    );
  });

  it("uses the full candidate distribution instead of only top-1", () => {
    const expected: CanonicalPronunciation = {
      id: "theta",
      phones: ["θ"],
    };

    const mostlyTheta = alignCanonicalPronunciation(expected, [
      {
        candidates: [
          { phone: "θ", probability: 0.7 },
          { phone: "s", probability: 0.3 },
        ],
      },
    ]);

    const mostlyS = alignCanonicalPronunciation(expected, [
      {
        candidates: [
          { phone: "s", probability: 0.7 },
          { phone: "θ", probability: 0.3 },
        ],
      },
    ]);

    expect(mostlyTheta.normalizedCost).toBeLessThan(mostlyS.normalizedCost);
    expect(mostlyTheta.alignment[0]?.observedProbability).toBeCloseTo(0.7);
    expect(mostlyTheta.alignment[0]?.posteriorMargin).toBeCloseTo(0.4);
  });

  it("does not invent probabilities for rank-only sensor candidates", () => {
    const result = alignCanonicalPronunciation(
      { id: "theta", phones: ["θ"] },
      [
        {
          candidates: [
            { phone: "s", probability: null },
            { phone: "θ", probability: null },
          ],
        },
      ],
    );

    expect(result.alignment[0]?.observed).toBe("s");
    expect(result.alignment[0]?.observedProbability).toBeNull();
    expect(result.alignment[0]?.posteriorMargin).toBeNull();
  });

  it("keeps deletion and insertion as distinct error types", () => {
    const missingFinal = alignCanonicalPronunciation(THINK, [
      top1("θ"),
      top1("ɪ"),
      top1("ŋ"),
    ]);

    expect(missingFinal.alignment.at(-1)).toMatchObject({
      kind: "deletion",
      expected: "k",
      observed: null,
    });

    const epenthesis = alignCanonicalPronunciation(
      { id: "stop", phones: ["s", "t", "ɒ", "p"] },
      [top1("s"), top1("t"), top1("ɒ"), top1("p"), top1("ə")],
    );

    expect(epenthesis.alignment.at(-1)).toMatchObject({
      kind: "insertion",
      expected: null,
      observed: "ə",
    });
  });

  it("selects the canonical variant best supported by the observation", () => {
    const result = selectBestCanonicalPronunciation(
      [
        { id: "goat-us", phones: ["g", "oʊ", "t"] },
        { id: "goat-uk", phones: ["g", "əʊ", "t"] },
      ],
      [top1("g"), top1("oʊ"), top1("t")],
    );

    expect(result.pronunciationId).toBe("goat-us");
    expect(result.normalizedCost).toBe(0);
  });

  it("derives research evidence without turning it into a validated score", () => {
    const result = alignCanonicalPronunciation(THINK, [
      top1("s"),
      top1("ɪ"),
      top1("ŋ"),
    ]);
    const evidence = deriveUncalibratedSegmentalEvidence(result);

    expect(evidence.calibration).toBe("unvalidated");
    expect(evidence.substitutionCount).toBe(1);
    expect(evidence.deletionCount).toBe(1);
    expect(evidence.insertionCount).toBe(0);
    expect(evidence.rawCompletenessSignal).toBeCloseTo(0.75);
    expect(evidence.rawAccuracySignal).toBeGreaterThanOrEqual(0);
    expect(evidence.rawAccuracySignal).toBeLessThanOrEqual(1);
  });
});
