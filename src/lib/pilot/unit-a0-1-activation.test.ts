import { describe, expect, it } from "vitest";

import {
  ACTIVATION_QUIZ,
  ACTIVATION_STEPS,
  DEFAULT_WORK_PROFILE,
  SURVIVAL_PHRASES,
  UNIT_A0_1_ACTIVATION_META,
  WORK_QUESTIONS,
  buildWorkIntroduction,
} from "./unit-a0-1-activation";

describe("Unit A0-1 activation lesson", () => {
  it("fits the 10–15 minute pilot promise", () => {
    const totalMinutes = ACTIVATION_STEPS.reduce(
      (sum, step) => sum + step.minutes,
      0,
    );

    expect(ACTIVATION_STEPS).toHaveLength(5);
    expect(totalMinutes).toBeGreaterThanOrEqual(10);
    expect(totalMinutes).toBeLessThanOrEqual(15);
    expect(UNIT_A0_1_ACTIVATION_META.estimatedTime).toBe(totalMinutes);
  });

  it("covers the five basic workplace questions", () => {
    expect(WORK_QUESTIONS).toHaveLength(5);
    expect(WORK_QUESTIONS.map((item) => item.question)).toEqual(
      expect.arrayContaining([
        "What is your name?",
        "What do you do?",
        "Where do you work?",
        "What are you responsible for?",
        "Could you spell your name?",
      ]),
    );
  });

  it("includes a phrase for asking the listener to slow down", () => {
    expect(SURVIVAL_PHRASES.map((item) => item.en)).toContain(
      "Could you speak more slowly, please?",
    );
  });

  it("builds a complete four-sentence work introduction", () => {
    const introduction = buildWorkIntroduction(DEFAULT_WORK_PROFILE);

    expect(introduction).toContain("My name is Minh.");
    expect(introduction).toContain("I work as a delivery driver.");
    expect(introduction).toContain("I work at Ato Delivery.");
    expect(introduction).toContain(
      "I am responsible for delivering customer orders.",
    );
  });

  it("keeps every quiz answer inside its option list", () => {
    for (const question of ACTIVATION_QUIZ) {
      expect(question.options).toContain(question.answer);
    }
  });
});
