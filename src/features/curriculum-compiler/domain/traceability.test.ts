import { describe, expect, it } from "vitest";

import {
  getTraceabilityRulesForValidationCode,
  TRACEABILITY_BY_VALIDATION_CODE,
  TRACEABILITY_RULES,
} from "@/features/curriculum-compiler/domain/traceability";

describe("curriculum standards traceability", () => {
  it("maps every validation code to at least one registered rule", () => {
    for (const [code, ruleIds] of Object.entries(
      TRACEABILITY_BY_VALIDATION_CODE,
    )) {
      expect(ruleIds.length, code).toBeGreaterThan(0);

      for (const ruleId of ruleIds) {
        expect(TRACEABILITY_RULES[ruleId], `${code} -> ${ruleId}`).toBeDefined();
      }
    }
  });

  it("does not mislabel pilot hypotheses as external requirements", () => {
    const pilotRules = Object.values(TRACEABILITY_RULES).filter(
      (rule) => rule.sourceType === "pilot_hypothesis",
    );

    expect(pilotRules.length).toBeGreaterThan(0);
    expect(
      pilotRules.every(
        (rule) =>
          rule.strength === "experimental" && rule.sourceUrls.length === 0,
      ),
    ).toBe(true);
  });

  it("keeps external and research claims linked to a source", () => {
    const sourcedRules = Object.values(TRACEABILITY_RULES).filter(
      (rule) =>
        rule.sourceType !== "pilot_hypothesis" &&
        rule.sourceType !== "internal_invariant",
    );

    expect(sourcedRules.every((rule) => rule.sourceUrls.length > 0)).toBe(true);
  });

  it("resolves validation codes into human-readable evidence rules", () => {
    expect(getTraceabilityRulesForValidationCode("invalid_transfer")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "TASK-TRANSFER-001" }),
        expect.objectContaining({ id: "CEFR-ALIGNMENT-001" }),
      ]),
    );

    expect(
      getTraceabilityRulesForValidationCode("invalid_duration"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "PILOT-CLIP-WINDOW-001",
          sourceType: "pilot_hypothesis",
        }),
      ]),
    );
  });
});
