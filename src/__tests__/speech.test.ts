import { describe, it, expect } from "vitest";
import { calcSpeechScore } from "@/lib/utils/speech";

describe("calcSpeechScore", () => {
  it("perfect match returns 100", () => {
    expect(calcSpeechScore("hello world", "hello world")).toBe(100);
  });

  it("empty spoken returns 0", () => {
    expect(calcSpeechScore("hello world", "")).toBe(0);
  });

  it("empty target returns 100 (nothing to match)", () => {
    expect(calcSpeechScore("", "anything")).toBe(100);
  });

  it("partial match returns correct percentage", () => {
    // target: 4 words, spoken: 2 match → 50%
    expect(calcSpeechScore("the quick brown fox", "the brown")).toBe(50);
  });

  it("case-insensitive matching", () => {
    expect(calcSpeechScore("Hello World", "hello world")).toBe(100);
    expect(calcSpeechScore("HELLO WORLD", "Hello World")).toBe(100);
  });

  it("ignores punctuation in comparison", () => {
    expect(calcSpeechScore("hello, world!", "hello world")).toBe(100);
  });

  it("extra words in spoken don't reduce score", () => {
    // target: "hello" → all target words found → 100%
    expect(calcSpeechScore("hello", "oh hello there")).toBe(100);
  });

  it("completely wrong spoken returns 0", () => {
    expect(calcSpeechScore("hello world", "foo bar baz")).toBe(0);
  });

  it("single word match", () => {
    expect(calcSpeechScore("hello", "hello")).toBe(100);
  });

  it("handles multiple spaces correctly", () => {
    expect(calcSpeechScore("hello world", "hello  world")).toBe(100);
  });
});
