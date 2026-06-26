import { describe, it, expect } from "vitest";
import {
  getStartingUnitIndex,
  getStartingUnitSlug,
  getPlacementLearnPath,
  getNextUnitFromProgress,
  getNextUnitRoute,
  isUnitUnlocked,
  isPlacedOutUnit,
} from "@/lib/placement/starting-unit";

describe("placement starting unit", () => {
  it("maps CEFR levels to first unit in each band", () => {
    expect(getStartingUnitSlug("A0")).toBe("unit-a0-1");
    expect(getStartingUnitSlug("A1")).toBe("unit-1");
    expect(getStartingUnitSlug("A2")).toBe("unit-13");
    expect(getStartingUnitSlug("B1")).toBe("unit-19");
    expect(getStartingUnitSlug("B2")).toBe("unit-33");
  });

  it("returns learn path with mini session", () => {
    expect(getPlacementLearnPath("B1")).toBe("/learn/unit-19?mini=1");
  });

  it("unlocks units up to and including starting index", () => {
    const ids = ["u0", "u1", "u2", "u3"];
    expect(isUnitUnlocked(0, 2, [], ids)).toBe(true);
    expect(isUnitUnlocked(2, 2, [], ids)).toBe(true);
    expect(isUnitUnlocked(3, 2, [], ids)).toBe(false);
    expect(isUnitUnlocked(3, 2, ["u2"], ids)).toBe(true);
  });

  it("marks earlier units as placed out when not completed", () => {
    expect(isPlacedOutUnit(1, getStartingUnitIndex("A2"), [])).toBe(true);
    expect(isPlacedOutUnit(1, getStartingUnitIndex("A2"), ["unit-a0-2"])).toBe(false);
  });

  it("picks next unit from placement index, not curriculum start", () => {
    const b1Start = getStartingUnitIndex("B1");
    const next = getNextUnitFromProgress([], b1Start);
    expect(next?.id).toBe("unit-19");
    expect(getNextUnitRoute([], b1Start)).toBe("/learn/unit-19");
  });

  it("falls back to first incomplete when all from placement index are done", () => {
    const b1Start = getStartingUnitIndex("B1");
    const completed = ["unit-19", "unit-20"];
    expect(getNextUnitFromProgress(completed, b1Start)?.id).toBe("unit-21");
  });
});