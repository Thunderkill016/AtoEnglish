import { describe, it, expect } from "vitest";

import { computeNextStreak } from "@/lib/progress/streak";

describe("computeNextStreak", () => {
  it("starts at 1 when no prior activity", () => {
    expect(computeNextStreak(0, null, "2026-06-21", "2026-06-20")).toBe(1);
  });

  it("keeps streak on same day", () => {
    expect(computeNextStreak(5, "2026-06-21", "2026-06-21", "2026-06-20")).toBe(5);
  });

  it("increments on consecutive days", () => {
    expect(computeNextStreak(5, "2026-06-20", "2026-06-21", "2026-06-20")).toBe(6);
  });

  it("resets after a gap", () => {
    expect(computeNextStreak(5, "2026-06-18", "2026-06-21", "2026-06-20")).toBe(1);
  });
});