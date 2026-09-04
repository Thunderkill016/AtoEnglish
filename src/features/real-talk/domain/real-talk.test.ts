import { describe, expect, it } from "vitest";

import { REAL_TALK_LESSONS, USO_EVENT_PILOT } from "@/features/real-talk/data/lessons";
import {
  recallAnswerMatches,
  validateRealTalkLesson,
} from "@/features/real-talk/domain/real-talk";

describe("Real Talk lesson contract", () => {
  it("keeps every pilot lesson inside the provenance and evidence boundary", () => {
    for (const lesson of REAL_TALK_LESSONS) {
      expect(validateRealTalkLesson(lesson), lesson.id).toEqual([]);
      expect(lesson.source.license.publicCatalogAllowed).toBe(true);
      expect(lesson.source.license.attribution.length).toBeGreaterThan(20);
      expect(
        lesson.transcript.every(
          (segment) =>
            segment.startSeconds >= lesson.clip.startSeconds &&
            segment.endSeconds <= lesson.clip.endSeconds,
        ),
      ).toBe(true);
    }
  });

  it("preserves source captions separately from learner-facing normalization", () => {
    const normalizedSegment = USO_EVENT_PILOT.transcript.find(
      (segment) => segment.sourceText !== segment.displayText,
    );

    expect(normalizedSegment).toBeDefined();
    expect(normalizedSegment?.reviewStatus).toBe("editor_normalized");
    expect(USO_EVENT_PILOT.source.transcript.reviewed).toBe(false);
  });

  it("accepts controlled recall variants without using fuzzy semantic scoring", () => {
    expect(
      recallAnswerMatches(
        "It's going to be the Iwakuni Incredible Race!",
        USO_EVENT_PILOT.recall.acceptedAnswers,
      ),
    ).toBe(true);
    expect(
      recallAnswerMatches(
        "The event is probably in Iwakuni.",
        USO_EVENT_PILOT.recall.acceptedAnswers,
      ),
    ).toBe(false);
  });

  it("blocks public approval while the transcript is not human verified", () => {
    const invalidApprovedLesson = {
      ...USO_EVENT_PILOT,
      status: "approved" as const,
    };

    expect(validateRealTalkLesson(invalidApprovedLesson)).toContain(
      "approved_lesson_requires_reviewed_transcript",
    );
  });
});
