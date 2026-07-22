import { describe, expect, it } from "vitest";

import {
  CURRICULUM_MISSION_MAP,
  EXPECTED_MISSION_COUNT,
  getMissionPlan,
} from "./curriculum-map";

const EXPECTED_COUNTS = {
  PRE_A1: 8,
  A1: 12,
  A2: 6,
  B1: 14,
  B2: 10,
} as const;

describe("Lesson System V2 curriculum map", () => {
  it("maps every legacy route exactly once", () => {
    expect(CURRICULUM_MISSION_MAP).toHaveLength(EXPECTED_MISSION_COUNT);

    const ids = CURRICULUM_MISSION_MAP.map((mission) => mission.legacyUnitId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the expected level distribution", () => {
    for (const [level, expected] of Object.entries(EXPECTED_COUNTS)) {
      expect(
        CURRICULUM_MISSION_MAP.filter((mission) => mission.level === level),
      ).toHaveLength(expected);
    }
  });

  it("uses action-oriented can-do statements instead of grammar labels", () => {
    for (const mission of CURRICULUM_MISSION_MAP) {
      expect(mission.canDoVi.length).toBeGreaterThanOrEqual(45);
      expect(mission.titleVi.length).toBeGreaterThanOrEqual(12);
    }
  });

  it("marks oversized legacy review and vocabulary units for splitting", () => {
    expect(getMissionPlan("unit-32")?.migration).toBe("split");
    expect(getMissionPlan("unit-41")?.migration).toBe("split");
    expect(getMissionPlan("unit-42")?.migration).toBe("split");
  });

  it("maps legacy A0 routes to Pre-A1", () => {
    const preA1Missions = CURRICULUM_MISSION_MAP.filter((mission) =>
      mission.legacyUnitId.startsWith("unit-a0-"),
    );

    expect(preA1Missions).toHaveLength(8);
    expect(preA1Missions.every((mission) => mission.level === "PRE_A1")).toBe(
      true,
    );
  });
});
