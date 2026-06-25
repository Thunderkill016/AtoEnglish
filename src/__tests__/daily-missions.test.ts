import { describe, it, expect } from "vitest";

import {
  buildDailyMissions,
  countCompletedMissions,
} from "@/lib/dashboard/daily-missions";

const baseInput = {
  currentUnit: {
    title: "Unit 1: Greetings",
    progress: 40,
    route: "/learn/unit-1",
    xp: 80,
  },
  dueCardsCount: 5,
  lessonCompletedToday: false,
  srsReviewedToday: false,
  quizDoneToday: false,
  speakingDoneToday: false,
};

describe("buildDailyMissions", () => {
  it("marks SRS done when no cards are due", () => {
    const missions = buildDailyMissions({ ...baseInput, dueCardsCount: 0 });
    const srs = missions.find((m) => m.id === "srs");
    expect(srs?.completed).toBe(true);
  });

  it("marks SRS done when user reviewed flashcards today", () => {
    const missions = buildDailyMissions({
      ...baseInput,
      srsReviewedToday: true,
    });
    const srs = missions.find((m) => m.id === "srs");
    expect(srs?.completed).toBe(true);
  });

  it("reflects lesson, quiz, and speaking flags from server", () => {
    const missions = buildDailyMissions({
      ...baseInput,
      dueCardsCount: 0,
      lessonCompletedToday: true,
      quizDoneToday: true,
      speakingDoneToday: true,
      challengeDoneToday: true,
    });

    expect(missions.find((m) => m.id === "lesson")?.completed).toBe(true);
    expect(missions.find((m) => m.id === "quiz")?.completed).toBe(true);
    expect(missions.find((m) => m.id === "speaking")?.completed).toBe(true);
    expect(missions.find((m) => m.id === "challenge")?.completed).toBe(true);
    expect(countCompletedMissions(missions)).toBe(5);
  });
});