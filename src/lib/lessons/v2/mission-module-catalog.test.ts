import { describe, expect, it } from "vitest";

import {
  LEVEL_CURRICULUM_VOLUME,
  TOTAL_REQUIRED_LESSONS,
} from "./curriculum-volume";
import {
  EXPECTED_PRODUCTION_MODULE_COUNT,
  PRODUCTION_MISSION_MODULES,
  buildCheckpointPlans,
  getModulesForLevel,
} from "./mission-module-catalog";
import type { CefrLevel } from "./schema";

const LEVELS: CefrLevel[] = ["PRE_A1", "A1", "A2", "B1", "B2"];

describe("Production mission module catalog", () => {
  it("contains the complete 64-module production curriculum", () => {
    expect(PRODUCTION_MISSION_MODULES).toHaveLength(
      EXPECTED_PRODUCTION_MODULE_COUNT,
    );
    expect(EXPECTED_PRODUCTION_MODULE_COUNT).toBe(64);
  });

  it("matches the planned module volume at every level", () => {
    for (const level of LEVELS) {
      expect(getModulesForLevel(level)).toHaveLength(
        LEVEL_CURRICULUM_VOLUME[level].missionModuleCount,
      );
    }
  });

  it("uses unique ids and contiguous per-level ordering", () => {
    const ids = PRODUCTION_MISSION_MODULES.map((module) => module.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const level of LEVELS) {
      const modules = getModulesForLevel(level);
      expect(modules.map((module) => module.order)).toEqual(
        Array.from({ length: modules.length }, (_, index) => index + 1),
      );
    }
  });

  it("keeps every module observable and traceable to legacy content", () => {
    for (const module of PRODUCTION_MISSION_MODULES) {
      expect(module.canDoVi.length).toBeGreaterThanOrEqual(30);
      expect(module.legacySourceIds.length).toBeGreaterThan(0);
    }
  });

  it("builds one checkpoint after every four core modules", () => {
    for (const level of LEVELS) {
      const checkpoints = buildCheckpointPlans(level);
      const volume = LEVEL_CURRICULUM_VOLUME[level];

      expect(checkpoints).toHaveLength(volume.checkpointCount);
      expect(checkpoints.map((checkpoint) => checkpoint.afterModuleOrder)).toEqual(
        Array.from(
          { length: volume.checkpointCount },
          (_, index) => Math.min((index + 1) * 4, volume.missionModuleCount),
        ),
      );
    }
  });

  it("derives the same 264 required lessons from modules and checkpoints", () => {
    const derivedTotal = LEVELS.reduce((total, level) => {
      const volume = LEVEL_CURRICULUM_VOLUME[level];
      return (
        total +
        getModulesForLevel(level).length * volume.lessonsPerModule +
        buildCheckpointPlans(level).length
      );
    }, 0);

    expect(derivedTotal).toBe(264);
    expect(derivedTotal).toBe(TOTAL_REQUIRED_LESSONS);
  });
});
