import { describe, expect, it } from "vitest";

import { firstMeetingLessonV1, qaLesson } from "../lesson-contract";

describe("Nếp lesson contract QA", () => {
  it("accepts the first-meeting vertical slice", () => {
    expect(qaLesson(firstMeetingLessonV1).filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("rejects a recognition-only lesson that claims the speaking flow", () => {
    const broken = {
      ...firstMeetingLessonV1,
      actions: firstMeetingLessonV1.actions.filter((action) => action.kind !== "produce" && action.kind !== "transfer"),
    };
    const codes = qaLesson(broken).map((issue) => issue.code);
    expect(codes).toContain("SPEAKING_NEEDS_SPEECH");
    expect(codes).toContain("TRANSFER_NEEDS_CHANGED_SPEECH");
  });

  it("rejects answer reveal before retrieval", () => {
    const broken = {
      ...firstMeetingLessonV1,
      actions: firstMeetingLessonV1.actions.map((action, index) =>
        index === 0 ? { ...action, revealsAnswer: true } : action,
      ),
    };
    expect(qaLesson(broken).map((issue) => issue.code)).toContain("ATTEMPT_BEFORE_REVEAL");
  });
});
