import { describe, it, expect } from "vitest";
import {
  LESSON_BLUEPRINT,
  CONTENT_BLOCK_ORDER,
  REFERENCE_UNIT_ID,
} from "@/lib/lessons/lesson-blueprint";
import {
  LESSON_SECTIONS,
  SECTION_ORDER,
} from "@/lib/lessons/learning-flow";
import { PILOT_LESSON_SPECS } from "@/lib/lessons/pilot-lessons";
import {
  canPublishLesson,
  evaluateLessonQuality,
  LESSON_QUALITY_THRESHOLD,
} from "@/lib/lessons/lesson-quality";

describe("lesson-blueprint", () => {
  it("references the first A0 pilot lesson as the template", () => {
    expect(REFERENCE_UNIT_ID).toBe("unit-a0-1");
  });

  it("maps every app section (except meta) to at least one content block", () => {
    for (const sec of LESSON_SECTIONS) {
      const blocks = LESSON_BLUEPRINT.filter((b) =>
        b.sectionIds.includes(sec.id),
      );
      expect(blocks.length, `section ${sec.id} ${sec.label}`).toBeGreaterThan(0);
    }
  });

  it("keeps vocab block before dialogues block (Nation & Webb order)", () => {
    const vocabIdx = CONTENT_BLOCK_ORDER.indexOf("vocab");
    const dialogueIdx = CONTENT_BLOCK_ORDER.indexOf("dialogues");
    expect(vocabIdx).toBeLessThan(dialogueIdx);
  });

  it("section order in app: vocab(2) before dialogue(5)", () => {
    expect(SECTION_ORDER.indexOf(2)).toBeLessThan(SECTION_ORDER.indexOf(5));
  });
});

describe("pilot lesson quality gate", () => {
  it("keeps exactly six A0 specs with stable section and mission activity IDs", () => {
    const specs = Object.values(PILOT_LESSON_SPECS);
    expect(specs).toHaveLength(6);

    for (const spec of specs) {
      expect(spec.schemaVersion).toBe(1);
      expect(spec.cefr).toBe("A0");
      expect(spec.activities).toHaveLength(11);
      expect(new Set(spec.activities.map((activity) => activity.id)).size).toBe(
        11,
      );
      expect(spec.activities.at(-1)?.id).toBe(
        `${spec.id}:mission:${spec.mission?.id}`,
      );
    }
  });

  it("passes automated QA without claiming publication", () => {
    for (const spec of Object.values(PILOT_LESSON_SPECS)) {
      const report = evaluateLessonQuality(spec);
      expect(report.total).toBeGreaterThanOrEqual(LESSON_QUALITY_THRESHOLD);
      expect(report.mandatoryFailures).toEqual([]);
      expect(report.automatedPass).toBe(true);
      expect(spec.qaStatus).toBe("automated_pass");
      expect(canPublishLesson(spec, report, null)).toBe(false);
    }
  });

  it("rejects a lesson whose mission violates the authoring contract", () => {
    const valid = PILOT_LESSON_SPECS["unit-a0-1"];
    expect(valid.mission).toBeDefined();

    const invalid = {
      ...valid,
      mission: {
        ...valid.mission!,
        targetChunks: valid.mission!.targetChunks.slice(0, 3),
      },
    };
    const report = evaluateLessonQuality(invalid);

    expect(report.mandatoryFailures).toContain(
      "mission:target_chunks_out_of_range",
    );
    expect(report.automatedPass).toBe(false);
  });

  it("requires an independent review of the same version to publish", () => {
    const spec = PILOT_LESSON_SPECS["unit-a0-1"];
    const report = evaluateLessonQuality(spec);

    expect(
      canPublishLesson(spec, report, {
        reviewerId: "reviewer-2",
        reviewedVersion: spec.version,
        reviewedAt: "2026-07-31T00:00:00.000Z",
        approved: true,
      }),
    ).toBe(true);
    expect(
      canPublishLesson(spec, report, {
        reviewerId: "reviewer-2",
        reviewedVersion: spec.version - 1,
        reviewedAt: "2026-07-31T00:00:00.000Z",
        approved: true,
      }),
    ).toBe(false);
  });
});
