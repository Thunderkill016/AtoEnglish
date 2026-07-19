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
import {
  countAuthoredOnCorePath,
  getContinueLessonId,
  getLessonV2,
  getNextPlayableLessonId,
  isCorePathComplete,
  isPathLessonOpenable,
  listAuthoredLessonIds,
} from "@/lib/v2/lessons";
import {
  CORE_END_LESSON_ID,
  CORE_PATH_PLAN,
  CORE_PATH_TOTAL,
} from "@/lib/v2/path";

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

  it("TASK-316: v2 soft-hides leaderboard from Me more + explore", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "1");
    vi.resetModules();
    const { getMeHubMore } = await import("@/lib/constants/me-hub");
    const { getDashboardExploreActions } = await import(
      "@/lib/constants/navigation"
    );
    expect(getMeHubMore().some((i) => i.href === "/leaderboard")).toBe(false);
    expect(
      getDashboardExploreActions("/learn/v2/l-a0-01").some(
        (i) => i.href === "/leaderboard",
      ),
    ).toBe(false);
  });

  it("TASK-316: v2 off keeps leaderboard on Me + explore", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "");
    vi.resetModules();
    const { getMeHubMore } = await import("@/lib/constants/me-hub");
    const { getDashboardExploreActions } = await import(
      "@/lib/constants/navigation"
    );
    expect(getMeHubMore().some((i) => i.href === "/leaderboard")).toBe(true);
    expect(
      getDashboardExploreActions("/learn/unit-1").some(
        (i) => i.href === "/leaderboard",
      ),
    ).toBe(true);
  });
});

describe("TASK-310 path sequential unlock + full registry", () => {
  it("registry covers full CORE_PATH plan (no pilot-only subset)", () => {
    expect(CORE_PATH_TOTAL).toBe(42);
    expect(countAuthoredOnCorePath()).toBe(CORE_PATH_TOTAL);
    expect(listAuthoredLessonIds().length).toBeGreaterThanOrEqual(CORE_PATH_TOTAL);
    for (const meta of CORE_PATH_PLAN) {
      expect(getLessonV2(meta.id), meta.id).not.toBeNull();
    }
  });

  it("empty progress: only first path lesson openable", () => {
    expect(isPathLessonOpenable("l-a0-01", [])).toBe(true);
    expect(isPathLessonOpenable("l-a0-02", [])).toBe(false);
    expect(isPathLessonOpenable("l-a1-01", [])).toBe(false);
    expect(isPathLessonOpenable("l-b1-14", [])).toBe(false);
  });

  it("unlocks next after previous completed; completed stay openable", () => {
    expect(isPathLessonOpenable("l-a0-02", ["l-a0-01"])).toBe(true);
    expect(isPathLessonOpenable("l-a0-01", ["l-a0-01"])).toBe(true);
    expect(isPathLessonOpenable("l-a0-03", ["l-a0-01"])).toBe(false);
    expect(
      isPathLessonOpenable("l-a0-03", ["l-a0-01", "l-a0-02"]),
    ).toBe(true);
  });

  it("unknown / missing content never openable", () => {
    expect(isPathLessonOpenable("l-does-not-exist", [])).toBe(false);
  });
});

describe("TASK-311 home continue walks full sequential path to l-b1-14", () => {
  const allCoreIds = CORE_PATH_PLAN.map((m) => m.id);

  it("empty progress continues at first path lesson", () => {
    expect(getNextPlayableLessonId([])).toBe("l-a0-01");
    expect(getContinueLessonId([])).toBe("l-a0-01");
    expect(isCorePathComplete([])).toBe(false);
  });

  it("advances to next uncompleted after each completed id (guest/auth same pure helper)", () => {
    // Guest localStorage + auth hydrate both feed completed id lists into these helpers
    const progressive: string[] = [];
    for (let i = 0; i < allCoreIds.length - 1; i++) {
      progressive.push(allCoreIds[i]!);
      expect(getNextPlayableLessonId(progressive)).toBe(allCoreIds[i + 1]);
      expect(getContinueLessonId(progressive)).toBe(allCoreIds[i + 1]);
      expect(isCorePathComplete(progressive)).toBe(false);
    }
  });

  it("after l-b1-13 → continue is l-b1-14 (CORE_END)", () => {
    const almost = allCoreIds.slice(0, -1);
    expect(almost[almost.length - 1]).toBe("l-b1-13");
    expect(getNextPlayableLessonId(almost)).toBe(CORE_END_LESSON_ID);
    expect(getContinueLessonId(almost)).toBe("l-b1-14");
    expect(isCorePathComplete(almost)).toBe(false);
  });

  it("end-of-path after l-b1-14: complete + continue review target is gate", () => {
    expect(getNextPlayableLessonId(allCoreIds)).toBeNull();
    expect(isCorePathComplete(allCoreIds)).toBe(true);
    // Review target (Home shows congrats; continue id still points at gate for ôn)
    expect(getContinueLessonId(allCoreIds)).toBe(CORE_END_LESSON_ID);
    expect(getLessonV2(CORE_END_LESSON_ID)).not.toBeNull();
    expect(CORE_END_LESSON_ID).toBe("l-b1-14");
  });

  it("primary Học tab still lands on /home under v2 (continue UI lives there)", async () => {
    vi.stubEnv("NEXT_PUBLIC_CURRICULUM_V2", "1");
    vi.resetModules();
    const { getPrimaryLearnHref: href } = await import("@/lib/constants/navigation");
    expect(href()).toBe("/home");
  });

  it("ignores unknown completed ids when choosing next", () => {
    expect(getContinueLessonId(["not-a-lesson", "l-a0-01"])).toBe("l-a0-02");
  });
});

