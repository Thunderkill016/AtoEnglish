import { describe, it, expect } from "vitest";
import {
  CENTER_SOURCES,
  CENTER_BLOCK_MAPPING,
  formatCenterDesignGuideForAgent,
} from "@/lib/lessons/lesson-center-reference";
import { CONTENT_BLOCK_ORDER } from "@/lib/lessons/lesson-blueprint";

describe("lesson-center-reference", () => {
  it("lists major center methodologies", () => {
    expect(CENTER_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(CENTER_SOURCES.some((s) => s.id === "bc-esa")).toBe(true);
    expect(CENTER_SOURCES.some((s) => s.id === "vn-clt")).toBe(true);
  });

  it("maps every content block (except meta optional) to center guidance", () => {
    const mapped = new Set(CENTER_BLOCK_MAPPING.map((m) => m.blockId));
    for (const id of CONTENT_BLOCK_ORDER) {
      expect(mapped.has(id), `block ${id}`).toBe(true);
    }
  });

  it("exports agent checklist", () => {
    const text = formatCenterDesignGuideForAgent();
    expect(text).toContain("ESA");
    expect(text).toContain("unit1.ts");
  });
});