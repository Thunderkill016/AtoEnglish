import { describe, it, expect } from "vitest";

import {
  hasSpeakingOnDate,
  sumLessonXpOnDate,
  sumQuizXpOnDate,
  sumSpeakingXpOnDate,
} from "@/lib/dashboard/today-xp";

describe("today-xp", () => {
  const today = "2026-06-21";

  it("sums lesson XP for the target VN date only", () => {
    const total = sumLessonXpOnDate(
      [
        { xp_earned: 68, completed_at: "2026-06-21T08:00:00+07:00" },
        { xp_earned: 80, completed_at: "2026-06-20T08:00:00+07:00" },
      ],
      today,
    );
    expect(total).toBe(68);
  });

  it("sums speaking XP by practice type", () => {
    const total = sumSpeakingXpOnDate(
      [
        { practice_type: "shadowing", created_at: "2026-06-21T09:00:00+07:00" },
        { practice_type: "roleplay", created_at: "2026-06-21T10:00:00+07:00" },
        { practice_type: "journal", created_at: "2026-06-20T10:00:00+07:00" },
      ],
      today,
    );
    expect(total).toBe(13);
  });

  it("sums quiz XP by quiz_date", () => {
    const total = sumQuizXpOnDate(
      [
        { xp_earned: 15, quiz_date: "2026-06-21" },
        { xp_earned: 10, quiz_date: "2026-06-20" },
        { xp_earned: 5, quiz_date: "2026-06-21" },
      ],
      today,
    );
    expect(total).toBe(20);
  });

  it("detects speaking activity on date", () => {
    expect(
      hasSpeakingOnDate(
        [{ created_at: "2026-06-21T10:00:00+07:00" }],
        today,
      ),
    ).toBe(true);
    expect(hasSpeakingOnDate([], today)).toBe(false);
  });
});