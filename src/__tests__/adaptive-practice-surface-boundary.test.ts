import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(__dirname, "../..");
const surfacePath = resolve(
  repositoryRoot,
  "src/features/adaptive-practice/AdaptivePracticePreview.tsx",
);
const safeActionPath = resolve(repositoryRoot, "src/app/actions/adaptive-practice.ts");

describe("adaptive practice learner-facing boundaries", () => {
  it("uses the learner-safe queue action instead of consuming the internal planner action", () => {
    const source = readFileSync(surfacePath, "utf8");

    expect(source).toContain("getNếpAdaptivePracticeQueue");
    expect(source).not.toContain("getNếpSessionPlan");
    expect(source).not.toContain("result.plan");
    expect(source).not.toContain("evaluateNếpAction");
    expect(source).not.toContain("toLearningAttemptRecord");
  });

  it("keeps internal planner diagnostics behind a server-only projection", () => {
    const source = readFileSync(safeActionPath, "utf8");

    expect(source).toMatch(/^\s*["']use server["'];?/m);
    expect(source).toContain("getNếpSessionPlan");
    expect(source).toContain("practices: result.practices");
    expect(source).toContain("practiceCount: result.practices.length");
    expect(source).not.toContain("plan: result.plan");
    expect(source).not.toContain("opportunities: result.plan");
    expect(source).not.toContain("blocked: result.plan");
  });
});
