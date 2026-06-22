import { describe, expect, it } from "vitest";

import type { UnitData } from "@/components/learn/UnitTemplate";
import { evaluateUnitQuality, getQualitySummary } from "@/lib/learning/content-quality";
import {
  LESSON_QUALITY_MAX_SCORE,
  LESSON_QUALITY_PASS_SCORE,
} from "@/lib/learning/atoenglish-plan";

function makeUnit(overrides: Partial<UnitData> = {}): UnitData {
  return {
    unitId: "unit-test",
    title: "Unit Test",
    level: "A0",
    xp: 10,
    estimatedTime: 15,
    description: "A small controlled lesson.",
    badgeName: "Test",
    badgeEmoji: "T",
    warmupGreetings: [
      { emoji: "*", en: "Hello", vn: "Xin chao", context: "Greeting" },
    ],
    culturalNote: "Nguoi Viet hay bo am cuoi khi noi tieng Anh.",
    vocab: [
      {
        id: 1,
        word: "name",
        phonetic: "/neim/",
        meaning: "ten",
        example: "My name is Linh.",
      },
      {
        id: 2,
        word: "hello",
        phonetic: "/he'lo/",
        meaning: "xin chao",
        example: "Hello, Nam.",
      },
    ],
    dialogues: [
      {
        id: 1,
        title: "Hello",
        audio: "",
        desc: "A short greeting",
        lines: [
          { id: "l1", speaker: "A", text: "Hello.", translation: "Xin chao." },
        ],
      },
    ],
    listenAndChoose: [
      {
        id: "lac1",
        audio_text: "Hello",
        options: ["Hello", "Goodbye"],
        answer: "Hello",
      },
    ],
    speaking: {
      level1Prompt: "Repeat: My name is Linh.",
      level1Placeholder: "My name is...",
      level2Situation: "Say your name.",
      level2Hint: "My name is...",
    },
    quiz: [
      {
        id: "q1",
        question: "Choose the correct sentence.",
        options: ["My name is Linh.", "My name Linh."],
        answer: "My name is Linh.",
        type: "multiple-choice",
      },
      {
        id: "q2",
        question: "Translate: Xin chao",
        answer: "Hello",
        type: "translate",
      },
      {
        id: "q3",
        question: "Fill: My name ___ Linh.",
        answer: "is",
        type: "cloze",
      },
    ],
    situation: "Meet a new classmate.",
    learningOutcomes: ["Say hello.", "Say your name."],
    pronunciationFocus: {
      phoneme: "final /m/",
      description: "Giu am cuoi cho nguoi Viet.",
      examples: [{ word: "name", ipa: "/neim/", tip: "Khep moi o cuoi tu." }],
    },
    fluencyDrill: {
      items: [{ en: "Hello", vn: "Xin chao" }],
    },
    ...overrides,
  };
}

describe("content quality evaluator", () => {
  it("builds a bounded summary for all registered units", () => {
    const summary = getQualitySummary();

    expect(summary.totalUnits).toBeGreaterThan(0);
    expect(summary.passCount + summary.failCount).toBe(summary.totalUnits);
    expect(summary.averageScore).toBeGreaterThanOrEqual(0);
    expect(summary.averageScore).toBeLessThanOrEqual(LESSON_QUALITY_MAX_SCORE);
    expect(summary.weakestCriteria).toHaveLength(3);
  });

  it("returns detailed criterion scores for one unit", () => {
    const report = evaluateUnitQuality(makeUnit());

    expect(report.score).toBeGreaterThanOrEqual(LESSON_QUALITY_PASS_SCORE);
    expect(report.maxScore).toBe(LESSON_QUALITY_MAX_SCORE);
    expect(report.criteria).toHaveLength(9);
    expect(report.strengths.length).toBeGreaterThan(0);
  });

  it("flags overpromise language in the safety criterion", () => {
    const report = evaluateUnitQuality(
      makeUnit({
        description: "Dam bao IELTS 6.5+ va noi nhu ban xu.",
      })
    );
    const safety = report.criteria.find((criterion) => criterion.id === "safety");

    expect(safety?.points).toBeLessThan(safety?.maxPoints ?? 0);
    expect(safety?.fix).toContain("guaranteed-score");
  });
});
