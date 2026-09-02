import { describe, expect, it } from "vitest";

import { nepSessionCatalogV1 } from "@/lib/nep/session-catalog.v1";

describe("Nếp session catalog v1", () => {
  it("compiles only evidence-bearing evaluated actions", () => {
    expect(nepSessionCatalogV1.map((candidate) => candidate.metadata?.actionKind)).toEqual([
      "comprehend",
      "retrieve",
      "produce",
      "repair",
      "transfer",
    ]);
  });

  it("keeps repair on CAP-003 and production/transfer on CAP-002", () => {
    const repair = nepSessionCatalogV1.find((candidate) => candidate.metadata?.actionKind === "repair");
    const production = nepSessionCatalogV1.find((candidate) => candidate.metadata?.actionKind === "produce");
    const transfer = nepSessionCatalogV1.find((candidate) => candidate.metadata?.actionKind === "transfer");

    expect(repair).toMatchObject({ targetId: "CAP-003", evidenceType: "repair" });
    expect(production).toMatchObject({ targetId: "CAP-002", evidenceType: "production" });
    expect(transfer).toMatchObject({ targetId: "CAP-002", evidenceType: "transfer" });
  });

  it("maps comprehension to persisted recognition evidence", () => {
    const comprehension = nepSessionCatalogV1.find((candidate) => candidate.metadata?.actionKind === "comprehend");
    expect(comprehension).toMatchObject({ targetId: "CAP-002", evidenceType: "recognition" });
  });

  it("does not schedule the supported retry as mastery evidence", () => {
    expect(nepSessionCatalogV1.some((candidate) => candidate.metadata?.actionKind === "retry")).toBe(false);
  });

  it("preserves declared lesson prerequisites and stable evaluation context", () => {
    for (const candidate of nepSessionCatalogV1) {
      expect(candidate.prerequisiteTargetIds).toEqual(["CAP-001"]);
      expect(candidate.metadata?.contextId).toBeTypeOf("string");
      expect(candidate.metadata?.evaluator).toBeTypeOf("string");
    }
  });
});
