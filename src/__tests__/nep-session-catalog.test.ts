import { describe, expect, it } from "vitest";

import { firstMeetingLessonV1 } from "@/lib/nep/lesson-contract";
import { nepSessionCatalogV1 } from "@/lib/nep/session-catalog.v1";

function firstMeetingCandidates() {
  return nepSessionCatalogV1.filter(
    (candidate) => candidate.metadata?.lessonId === firstMeetingLessonV1.id,
  );
}

describe("Nếp session catalog v1", () => {
  it("compiles only evidence-bearing evaluated actions for the first-meeting lesson", () => {
    expect(firstMeetingCandidates().map((candidate) => candidate.metadata?.actionKind)).toEqual([
      "comprehend",
      "retrieve",
      "produce",
      "repair",
      "transfer",
    ]);
  });

  it("keeps first-meeting repair on CAP-003 and production/transfer on CAP-002", () => {
    const candidates = firstMeetingCandidates();
    const repair = candidates.find((candidate) => candidate.metadata?.actionKind === "repair");
    const production = candidates.find((candidate) => candidate.metadata?.actionKind === "produce");
    const transfer = candidates.find((candidate) => candidate.metadata?.actionKind === "transfer");

    expect(repair).toMatchObject({ targetId: "CAP-003", evidenceType: "repair" });
    expect(production).toMatchObject({ targetId: "CAP-002", evidenceType: "production" });
    expect(transfer).toMatchObject({ targetId: "CAP-002", evidenceType: "transfer" });
  });

  it("maps first-meeting comprehension to persisted recognition evidence", () => {
    const comprehension = firstMeetingCandidates().find(
      (candidate) => candidate.metadata?.actionKind === "comprehend",
    );
    expect(comprehension).toMatchObject({ targetId: "CAP-002", evidenceType: "recognition" });
  });

  it("does not schedule supported retry as mastery evidence in any lesson", () => {
    expect(nepSessionCatalogV1.some((candidate) => candidate.metadata?.actionKind === "retry")).toBe(false);
  });

  it("preserves first-meeting prerequisites and stable evaluation context", () => {
    for (const candidate of firstMeetingCandidates()) {
      expect(candidate.prerequisiteTargetIds).toEqual(["CAP-001"]);
      expect(candidate.metadata?.contextId).toBeTypeOf("string");
      expect(candidate.metadata?.evaluator).toBeTypeOf("string");
    }
  });

  it("keeps bootstrap candidates prerequisite-free while preserving evaluation metadata", () => {
    const bootstrapCandidates = nepSessionCatalogV1.filter(
      (candidate) => candidate.metadata?.lessonId !== firstMeetingLessonV1.id,
    );

    expect(bootstrapCandidates.length).toBeGreaterThan(0);
    for (const candidate of bootstrapCandidates) {
      expect(candidate.prerequisiteTargetIds).toEqual([]);
      expect(candidate.metadata?.contextId).toBeTypeOf("string");
      expect(candidate.metadata?.evaluator).toBeTypeOf("string");
    }
  });
});
