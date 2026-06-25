import { describe, it, expect } from "vitest";
import {
  getFirstUnitSlug,
  getOnboardingRedirectPath,
  mapQuizLevelToCefr,
} from "@/lib/onboarding";

describe("onboarding helpers", () => {
  it("maps quiz levels to first unit slug", () => {
    expect(getFirstUnitSlug("A0-A1")).toBe("unit-a0-1");
    expect(getFirstUnitSlug("A2")).toBe("unit-13");
    expect(getFirstUnitSlug("B1")).toBe("unit-19");
    expect(getFirstUnitSlug("B2+")).toBe("unit-33");
    expect(getFirstUnitSlug("unknown")).toBe("unit-a0-1");
  });

  it("builds mini-session redirect path", () => {
    expect(getOnboardingRedirectPath("A0-A1")).toBe("/learn/unit-a0-1?mini=1");
    expect(getOnboardingRedirectPath("B1", "15min")).toBe("/learn/unit-19?mini=1");
  });

  it("maps quiz level to CEFR for user_progress", () => {
    expect(mapQuizLevelToCefr("A0-A1")).toBe("A0");
    expect(mapQuizLevelToCefr("A2")).toBe("A2");
    expect(mapQuizLevelToCefr("B2+")).toBe("B2");
  });
});