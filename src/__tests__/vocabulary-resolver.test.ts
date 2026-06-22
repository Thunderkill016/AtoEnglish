import { describe, it, expect } from "vitest";

import {
  getUnitVocabulary,
  resolveVocabularyKey,
} from "@/lib/constants/vocabulary";

describe("vocabulary resolver", () => {
  it("maps A0 unit ids to vocabulary keys", () => {
    expect(resolveVocabularyKey("unit-a0-1")).toBe("unit-A01");
    expect(resolveVocabularyKey("unit-a0-8")).toBe("unit-A08");
    expect(resolveVocabularyKey("unit-1")).toBe("unit-1");
  });

  it("returns A0 vocabulary for registry unit ids", () => {
    const vocab = getUnitVocabulary("unit-a0-1");
    expect(vocab.length).toBeGreaterThanOrEqual(4);
    expect(vocab[0].word).toBe("hello");
  });
});