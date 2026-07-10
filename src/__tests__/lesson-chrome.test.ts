import { describe, it, expect } from "vitest";
import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";

describe("isLessonChromeHidden (TASK-261)", () => {
  it("hides v1 unit lessons", () => {
    expect(isLessonChromeHidden("/learn/unit-1")).toBe(true);
    expect(isLessonChromeHidden("/learn/unit-a0-1")).toBe(true);
  });

  it("hides v2 lesson player", () => {
    expect(isLessonChromeHidden("/learn/v2/l-a1-01")).toBe(true);
  });

  it("shows shell on hubs", () => {
    expect(isLessonChromeHidden("/dashboard")).toBe(false);
    expect(isLessonChromeHidden("/learn")).toBe(false);
    expect(isLessonChromeHidden("/home")).toBe(false);
  });
});
