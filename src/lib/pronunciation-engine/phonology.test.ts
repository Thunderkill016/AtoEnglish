import { describe, expect, it } from "vitest";

import {
  articulatoryDeltaForPhones,
  isKnownEnglishPhone,
  normalizeEnglishPhone,
  phonologicalDistance,
} from "./phonology";

describe("pronunciation-engine phonology", () => {
  it("normalizes common English IPA variants", () => {
    expect(normalizeEnglishPhone(" t͡ʃ ")).toBe("tʃ");
    expect(normalizeEnglishPhone("ɡ")).toBe("g");
    expect(normalizeEnglishPhone("r")).toBe("ɹ");
  });

  it("assigns zero distance to the same phone", () => {
    expect(phonologicalDistance("θ", "θ")).toBe(0);
    expect(phonologicalDistance("t͡ʃ", "tʃ")).toBe(0);
  });

  it("treats a nearby theta-to-s change as closer than theta-to-m", () => {
    expect(phonologicalDistance("θ", "s")).toBeLessThan(
      phonologicalDistance("θ", "m"),
    );
  });

  it("treats a voicing-only stop contrast as relatively small", () => {
    expect(phonologicalDistance("t", "d")).toBeLessThan(0.25);
    expect(phonologicalDistance("t", "d")).toBeLessThan(
      phonologicalDistance("t", "ʃ"),
    );
  });

  it("treats a near high-front vowel contrast as closer than a distant vowel", () => {
    expect(phonologicalDistance("iː", "ɪ")).toBeLessThan(
      phonologicalDistance("iː", "ɑ"),
    );
  });

  it("describes the articulatory change for theta-to-s", () => {
    expect(articulatoryDeltaForPhones("θ", "s")).toEqual({
      place: { expected: "dental", observed: "alveolar" },
      manner: null,
      voicing: null,
    });
  });

  it("distinguishes known and unknown phone symbols", () => {
    expect(isKnownEnglishPhone("ð")).toBe(true);
    expect(isKnownEnglishPhone("🦊")).toBe(false);
  });
});
