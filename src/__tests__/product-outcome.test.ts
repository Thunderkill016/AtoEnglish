import { describe, it, expect } from "vitest";
import { UNITS } from "@/lib/constants/units";
import {
  CORE_OUTCOME_CEFR,
  CORE_PATH,
  EXTENSION_PATH,
  SURVIVAL_CHECKPOINT_CEFR,
} from "@/lib/constants/product-outcome";
import {
  B1_MODULES,
  getCorePhases,
  PROGRAM_PHASES,
} from "@/lib/constants/program-phases";

describe("product-outcome North Star (B1 core)", () => {
  it("locks core outcome at B1", () => {
    expect(CORE_OUTCOME_CEFR).toBe("B1");
    expect(SURVIVAL_CHECKPOINT_CEFR).toBe("A2");
  });

  it("core path ends at last B1 unit (unit-32)", () => {
    expect(CORE_PATH.endUnitId).toBe("unit-32");
    const b1 = UNITS.filter((u) => u.level === "B1");
    expect(b1.length).toBe(CORE_PATH.unitCounts.B1);
    expect(b1[b1.length - 1]?.id).toBe(CORE_PATH.endUnitId);
  });

  it("core path unit counts match UNITS metadata", () => {
    for (const band of CORE_PATH.bands) {
      const n = UNITS.filter((u) => u.level === band).length;
      expect(n).toBe(CORE_PATH.unitCounts[band]);
    }
    const coreTotal = CORE_PATH.bands.reduce(
      (sum, b) => sum + CORE_PATH.unitCounts[b],
      0,
    );
    expect(coreTotal).toBe(CORE_PATH.totalCoreUnits);
  });

  it("extension starts after B1", () => {
    expect(EXTENSION_PATH.startUnitId).toBe("unit-33");
    const firstB2 = UNITS.find((u) => u.level === "B2");
    expect(firstB2?.id).toBe(EXTENSION_PATH.startUnitId);
  });

  it("program phases: 4 core + B2 extension, B1 ends unit-32", () => {
    expect(getCorePhases()).toHaveLength(4);
    expect(PROGRAM_PHASES).toHaveLength(5);
    const b1 = PROGRAM_PHASES.find((p) => p.id === "P3");
    expect(b1?.endUnitId).toBe("unit-32");
    expect(b1?.gate).toBe("B1");
    const allB1Mods = B1_MODULES.flatMap((m) => m.unitIds);
    expect(allB1Mods).toHaveLength(14);
    expect(allB1Mods[0]).toBe("unit-19");
    expect(allB1Mods[13]).toBe("unit-32");
  });
});
