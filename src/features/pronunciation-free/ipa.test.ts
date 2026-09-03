import { describe, expect, it } from "vitest";

import {
  alignPhoneSequences,
  parseObservedPhonemes,
  tokenizeExpectedIpa,
} from "./ipa";

describe("pronunciation-free IPA utilities", () => {
  it("tokenizes the canonical think IPA", () => {
    expect(tokenizeExpectedIpa("/θɪŋk/")).toEqual(["θ", "ɪ", "ŋ", "k"]);
  });

  it("keeps long vowels and affricates as one phone", () => {
    expect(tokenizeExpectedIpa("/tʃiːp/")).toEqual(["tʃ", "iː", "p"]);
  });

  it("parses the model's whitespace-separated phonetic labels", () => {
    expect(parseObservedPhonemes("s ɪ ŋ k")).toEqual(["s", "ɪ", "ŋ", "k"]);
  });

  it("normalizes common tie-bar and glyph variants", () => {
    expect(parseObservedPhonemes("t͡ʃ ɪ ɡ")).toEqual(["tʃ", "ɪ", "g"]);
  });

  it("diagnoses a theta-to-s substitution without inventing other errors", () => {
    expect(
      alignPhoneSequences(["θ", "ɪ", "ŋ", "k"], ["s", "ɪ", "ŋ", "k"]),
    ).toEqual([
      { kind: "substitution", expected: "θ", observed: "s" },
      { kind: "match", expected: "ɪ", observed: "ɪ" },
      { kind: "match", expected: "ŋ", observed: "ŋ" },
      { kind: "match", expected: "k", observed: "k" },
    ]);
  });

  it("represents a missing final consonant as a deletion", () => {
    expect(alignPhoneSequences(["s", "t", "ɒ", "p"], ["s", "t", "ɒ"])).toEqual([
      { kind: "match", expected: "s", observed: "s" },
      { kind: "match", expected: "t", observed: "t" },
      { kind: "match", expected: "ɒ", observed: "ɒ" },
      { kind: "deletion", expected: "p", observed: null },
    ]);
  });

  it("represents an added phone as an insertion", () => {
    expect(alignPhoneSequences(["s", "t", "ɒ", "p"], ["s", "t", "ɒ", "p", "ə"])).toEqual([
      { kind: "match", expected: "s", observed: "s" },
      { kind: "match", expected: "t", observed: "t" },
      { kind: "match", expected: "ɒ", observed: "ɒ" },
      { kind: "match", expected: "p", observed: "p" },
      { kind: "insertion", expected: null, observed: "ə" },
    ]);
  });
});
