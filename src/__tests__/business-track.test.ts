import { describe, it, expect } from "vitest";
import {
  BUSINESS_TRACK,
  getBusinessTrackProgress,
} from "@/lib/constants/business-track";

describe("getBusinessTrackProgress", () => {
  it("returns zero progress when no units completed", () => {
    const p = getBusinessTrackProgress([]);
    expect(p.doneCount).toBe(0);
    expect(p.total).toBe(BUSINESS_TRACK.length);
    expect(p.isComplete).toBe(false);
    expect(p.nextUnitId).toBe("unit-17");
    expect(p.nextRoute).toBe("/learn/unit-17");
  });

  it("finds next incomplete unit", () => {
    const p = getBusinessTrackProgress(["unit-17", "unit-22"]);
    expect(p.doneCount).toBe(2);
    expect(p.nextUnitId).toBe("unit-24");
  });

  it("marks complete when all track units done", () => {
    const p = getBusinessTrackProgress(BUSINESS_TRACK.map((u) => u.id));
    expect(p.isComplete).toBe(true);
    expect(p.percent).toBe(100);
    expect(p.nextRoute).toBeNull();
  });
});