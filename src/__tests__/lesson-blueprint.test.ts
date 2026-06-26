import { describe, it, expect } from "vitest";
import {
  LESSON_BLUEPRINT,
  CONTENT_BLOCK_ORDER,
  REFERENCE_UNIT_ID,
} from "@/lib/lessons/lesson-blueprint";
import { LESSON_SECTIONS, SECTION_ORDER } from "@/lib/lessons/learning-flow";

describe("lesson-blueprint", () => {
  it("references unit1 as golden template", () => {
    expect(REFERENCE_UNIT_ID).toBe("unit-1");
  });

  it("maps every app section (except meta) to at least one content block", () => {
    for (const sec of LESSON_SECTIONS) {
      const blocks = LESSON_BLUEPRINT.filter((b) => b.sectionIds.includes(sec.id));
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