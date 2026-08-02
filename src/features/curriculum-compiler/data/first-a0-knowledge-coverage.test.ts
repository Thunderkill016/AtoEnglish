import { describe, expect, it } from "vitest";

import { FIRST_A0_CAPABILITIES } from "@/features/curriculum-compiler/data/first-a0-capabilities";
import { FIRST_A0_KNOWLEDGE_COVERAGE } from "@/features/curriculum-compiler/data/first-a0-knowledge-coverage";
import type { CapabilityKnowledgeCoverage } from "@/features/curriculum-compiler/domain/content-lanes";

const KNOWLEDGE_FIELDS: Array<keyof CapabilityKnowledgeCoverage> = [
  "meaningAndUse",
  "formulaicChunks",
  "grammarPatterns",
  "speechFeatures",
  "interactionStrategies",
  "pragmaticsAndRegister",
  "vietnameseLearnerRisks",
];

describe("First A0 knowledge coverage", () => {
  it("covers every first-slice capability exactly once", () => {
    const capabilityIds = FIRST_A0_CAPABILITIES.map((capability) => capability.id).sort();
    const planIds = FIRST_A0_KNOWLEDGE_COVERAGE.map((plan) => plan.capabilityId).sort();

    expect(planIds).toEqual(capabilityIds);
    expect(new Set(planIds).size).toBe(planIds.length);
  });

  it("contains reviewed instructional content in every required category", () => {
    for (const plan of FIRST_A0_KNOWLEDGE_COVERAGE) {
      for (const field of KNOWLEDGE_FIELDS) {
        const values = plan.knowledge[field];
        expect(values.length).toBeGreaterThan(0);
        expect(values.every((value: string) => value.trim().length > 0)).toBe(true);
      }
    }
  });
});
