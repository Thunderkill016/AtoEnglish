import { describe, expect, it } from "vitest";

import { buildVerificationPlan } from "./verification-plan.mjs";

describe("curriculum verification plan", () => {
  it("builds the full curriculum gate from existing repository commands", () => {
    const plan = buildVerificationPlan();

    expect(plan.scope).toBe("curriculum");
    expect(plan.mode).toBe("full");
    expect(plan.technicalChecks.map((check) => check.id)).toEqual([
      "focused-lesson-tests",
      "content-standard",
      "typecheck",
      "lint",
      "unit-tests",
      "production-build",
    ]);
    expect(plan.manualReview).toContain(
      "Open the changed lesson and one neighboring unit in the preview; compare title, step count, section labels, and navigation.",
    );
  });

  it("keeps fast mode bounded to focused tests, content standards, and typecheck", () => {
    const plan = buildVerificationPlan({ fast: true });

    expect(plan.mode).toBe("fast");
    expect(plan.technicalChecks.map((check) => check.id)).toEqual([
      "focused-lesson-tests",
      "content-standard",
      "typecheck",
    ]);
  });

  it("fails closed for an unsupported scope", () => {
    expect(() => buildVerificationPlan({ scope: "payments" })).toThrow(
      "Unsupported verification scope: payments",
    );
  });
});
