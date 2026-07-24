import { describe, expect, it } from "vitest";

import {
  GOLD_DAY_1_SECTION_ORDER,
  SECTION_ORDER,
  getSectionOrder,
} from "@/components/learn/lesson-sections";

describe("lesson section order", () => {
  it("keeps Gold Day 1 as a focused seven-step speaking journey", () => {
    expect(getSectionOrder("unit-a0-1")).toBe(GOLD_DAY_1_SECTION_ORDER);
    expect([...GOLD_DAY_1_SECTION_ORDER]).toEqual([1, 2, 5, 4, 6, 7, 8]);
    expect(GOLD_DAY_1_SECTION_ORDER).not.toContain(3);
    expect(GOLD_DAY_1_SECTION_ORDER).not.toContain(9);
    expect(GOLD_DAY_1_SECTION_ORDER).not.toContain(10);
  });

  it("preserves the legacy section order for every other unit", () => {
    expect(getSectionOrder("unit-a0-2")).toBe(SECTION_ORDER);
    expect(getSectionOrder("unit-1")).toBe(SECTION_ORDER);
  });
});
