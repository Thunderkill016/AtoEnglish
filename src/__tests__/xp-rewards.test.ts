import { describe, it, expect } from "vitest";

import { getQuizXp, getSpeakingXp } from "@/lib/constants/xp-rewards";

describe("xp-rewards", () => {
  it("maps speaking practice types to XP", () => {
    expect(getSpeakingXp("shadowing")).toBe(5);
    expect(getSpeakingXp("roleplay")).toBe(8);
    expect(getSpeakingXp("journal")).toBe(5);
    expect(getSpeakingXp("unknown")).toBe(5);
  });

  it("scales quiz XP by percent", () => {
    expect(getQuizXp(90)).toBe(15);
    expect(getQuizXp(60)).toBe(10);
    expect(getQuizXp(30)).toBe(5);
  });
});