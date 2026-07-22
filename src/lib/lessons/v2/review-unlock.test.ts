import { describe, expect, it } from "vitest";

import {
  calculateReviewUnlockAt,
  earliestCompletionTimestamp,
  evaluateReviewAvailability,
} from "./review-unlock";

describe("Lesson V2 delayed review unlock", () => {
  it("opens a 24-hour review only after the real delay", () => {
    const completedAt = "2026-07-22T09:00:00.000Z";

    expect(calculateReviewUnlockAt(completedAt, 24)).toBe(
      "2026-07-23T09:00:00.000Z",
    );
    expect(
      evaluateReviewAvailability(
        { prerequisiteLessonId: "lesson-1", delayHours: 24 },
        completedAt,
        new Date("2026-07-23T08:59:59.000Z"),
      ),
    ).toMatchObject({ status: "locked", reason: "delay" });
    expect(
      evaluateReviewAvailability(
        { prerequisiteLessonId: "lesson-1", delayHours: 24 },
        completedAt,
        new Date("2026-07-23T09:00:00.000Z"),
      ),
    ).toEqual({ status: "available" });
  });

  it("keeps the review locked when the prerequisite is missing", () => {
    expect(
      evaluateReviewAvailability(
        { prerequisiteLessonId: "lesson-1", delayHours: 24 },
        undefined,
      ),
    ).toEqual({
      status: "locked",
      reason: "prerequisite",
      prerequisiteLessonId: "lesson-1",
    });
  });

  it("uses the earliest trustworthy completion from local and remote evidence", () => {
    expect(
      earliestCompletionTimestamp([
        "2026-07-22T11:00:00.000Z",
        undefined,
        "invalid",
        "2026-07-22T09:00:00.000Z",
      ]),
    ).toBe("2026-07-22T09:00:00.000Z");
  });
});
