import { describe, expect, it } from "vitest";
import {
  answersMatch,
  normalizeExerciseAnswer,
  shuffleWords,
} from "@/lib/v2/exercise-answer";

describe("normalizeExerciseAnswer (v2 controlled)", () => {
  it("lowercases and trims", () => {
    expect(normalizeExerciseAnswer("  Hello World  ")).toBe("hello world");
  });

  it("collapses spaces and strips trailing punct", () => {
    expect(normalizeExerciseAnswer("Nice   to meet you!")).toBe("nice to meet you");
  });

  it("answersMatch ignores case/space/punct", () => {
    expect(answersMatch("How do you spell it?", "how do you spell it")).toBe(true);
    expect(answersMatch("from", "FROM")).toBe(true);
    expect(answersMatch("I'm fine", "I am fine")).toBe(false);
  });

  it("shuffleWords returns same multiset", () => {
    const words = ["Nice", "to", "meet", "you"];
    const out = shuffleWords(words);
    expect(out).toHaveLength(words.length);
    expect([...out].sort()).toEqual([...words].sort());
    expect(words).toEqual(["Nice", "to", "meet", "you"]);
  });
});
