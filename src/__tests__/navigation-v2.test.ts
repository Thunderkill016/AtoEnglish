import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getBottomNavItems,
  getDesktopPrimaryNav,
  getPrimaryLearnHref,
} from "@/lib/constants/navigation";
import {
  getMeHubStudy,
  ME_HUB_OUTCOME_LINE,
} from "@/lib/constants/me-hub";
import { CORE_OUTCOME_CEFR, CORE_OUTCOME_PROMISE_VI } from "@/lib/constants/product-outcome";

describe("TASK-277 primary learn nav flag matrix", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to /dashboard when v2 flag is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "");
    const { getPrimaryLearnHref: href } = await import("@/lib/constants/navigation");
    const { isCurriculumV2 } = await import("@/lib/v2/flag");
    expect(isCurriculumV2()).toBe(false);
    expect(href()).toBe("/dashboard");
  });

  it("returns /home when NEXT_PUBLIC_CURRICULUM_V2 is 1", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "1");
    const { getPrimaryLearnHref: href } = await import("@/lib/constants/navigation");
    const { isCurriculumV2 } = await import("@/lib/v2/flag");
    expect(isCurriculumV2()).toBe(true);
    expect(href()).toBe("/home");
  });

  it("returns /home when flag is true|yes|on (case-insensitive)", async () => {
    for (const raw of ["true", "TRUE", "yes", "on"]) {
      vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", raw);
      vi.resetModules();
      const { getPrimaryLearnHref: href } = await import("@/lib/constants/navigation");
      expect(href()).toBe("/home");
    }
  });

  it("bottom + desktop primary Học tab share flag-aware href", () => {
    const bottomHoc = getBottomNavItems().find((i) => i.title === "Học");
    const desktopHoc = getDesktopPrimaryNav().find((i) => i.title === "Học");
    expect(bottomHoc).toBeDefined();
    expect(desktopHoc).toBeDefined();
    expect(bottomHoc!.href).toBe(getPrimaryLearnHref());
    expect(desktopHoc!.href).toBe(getPrimaryLearnHref());
    expect(bottomHoc!.href).toBe(desktopHoc!.href);
  });

  it("keeps 3-tab shell: Học · Ôn · Tôi", () => {
    const titles = getBottomNavItems().map((i) => i.title);
    expect(titles).toEqual(["Học", "Ôn", "Tôi"]);
    expect(getDesktopPrimaryNav().map((i) => i.title)).toEqual(titles);
  });
});

describe("TASK-277 Me hub B1 copy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("outcome line matches product north star", () => {
    expect(ME_HUB_OUTCOME_LINE).toBe(CORE_OUTCOME_PROMISE_VI);
    expect(ME_HUB_OUTCOME_LINE).toMatch(/B1/);
  });

  it("study rows emphasize B1 Independent User", () => {
    const study = getMeHubStudy();
    expect(study.some((i) => i.description?.includes(CORE_OUTCOME_CEFR))).toBe(true);
    expect(study.some((i) => /Independent|B1/i.test(i.description ?? ""))).toBe(true);
  });

  it("v2 flag routes Me study to /home + /path", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "1");
    vi.resetModules();
    const { getMeHubStudy: studyFn } = await import("@/lib/constants/me-hub");
    const hrefs = studyFn().map((i) => i.href);
    expect(hrefs).toContain("/home");
    expect(hrefs).toContain("/path");
    expect(hrefs).not.toContain("/learn");
  });

  it("v2 off keeps v1 learn/roadmap hubs", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "");
    vi.resetModules();
    const { getMeHubStudy: studyFn } = await import("@/lib/constants/me-hub");
    const hrefs = studyFn().map((i) => i.href);
    expect(hrefs).toContain("/learn");
    expect(hrefs).toContain("/roadmap");
  });
});
