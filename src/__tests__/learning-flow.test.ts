import { describe, it, expect } from "vitest";
import {
  SECTION_ORDER,
  TOTAL_SECTIONS,
  getSectionPhase,
  LESSON_SECTIONS,
} from "@/lib/lessons/learning-flow";

describe("learning-flow", () => {
  it("has 10 sections in evidence-based order (vocab before dialogue)", () => {
    expect(TOTAL_SECTIONS).toBe(10);
    const vocabIdx = SECTION_ORDER.indexOf(2);
    const dialogueIdx = SECTION_ORDER.indexOf(5);
    expect(vocabIdx).toBeGreaterThan(-1);
    expect(dialogueIdx).toBeGreaterThan(vocabIdx);
  });

  it("maps every section to an IPOR phase", () => {
    for (const s of LESSON_SECTIONS) {
      expect(["input", "processing", "output", "review"]).toContain(getSectionPhase(s.id));
    }
  });

  it("ends with review phase (quiz)", () => {
    expect(getSectionPhase(SECTION_ORDER[SECTION_ORDER.length - 1])).toBe("review");
  });
});