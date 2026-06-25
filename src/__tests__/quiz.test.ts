import { describe, it, expect } from "vitest";
import { quizXpFromPct } from "@/lib/quiz-scoring";

describe("quizXpFromPct", () => {
  it("scales XP by performance tier", () => {
    expect(quizXpFromPct(100)).toBe(15);
    expect(quizXpFromPct(80)).toBe(15);
    expect(quizXpFromPct(79)).toBe(10);
    expect(quizXpFromPct(50)).toBe(10);
    expect(quizXpFromPct(49)).toBe(5);
    expect(quizXpFromPct(0)).toBe(5);
  });
});