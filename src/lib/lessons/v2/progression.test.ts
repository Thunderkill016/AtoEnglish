import { describe, expect, it } from "vitest";

import { LEVEL_DESIGN_BUDGETS, type CefrLevel } from "./schema";
import {
  LEVEL_PROGRESSION_PROFILES,
  getLevelProgressionProfile,
} from "./level-progression";
import {
  EXPECTED_SCOPE_SEQUENCE_COUNT,
  MISSION_SCOPE_SEQUENCE,
  getCheckpointMissions,
  getLevelScope,
} from "./scope-sequence";
import {
  calculateLevelProgress,
  deriveMissionMastery,
  type MissionAttemptEvidence,
} from "./progress-evidence";

const LEVELS: CefrLevel[] = ["PRE_A1", "A1", "A2", "B1", "B2"];

describe("level progression profiles", () => {
  it("defines a complete profile for every product level", () => {
    expect(Object.keys(LEVEL_PROGRESSION_PROFILES).sort()).toEqual(
      [...LEVELS].sort(),
    );
  });

  it("keeps lesson time and target budgets aligned with the lesson schema", () => {
    for (const level of LEVELS) {
      const profile = getLevelProgressionProfile(level);
      const budget = LEVEL_DESIGN_BUDGETS[level];

      expect(profile.learningDesign.lessonMinutes).toEqual([
        budget.minMinutes,
        budget.maxMinutes,
      ]);
      expect(profile.learningDesign.newCoreTargets).toEqual([
        budget.minCoreTargets,
        budget.maxCoreTargets,
      ]);
    }
  });

  it("requires meaningful performance and visible progression at every level", () => {
    for (const level of LEVELS) {
      const profile = getLevelProgressionProfile(level);

      expect(profile.learningDesign.meaningfulProductionRequired).toBe(true);
      expect(profile.assessment.requiredEvidence.length).toBeGreaterThan(0);
      expect(profile.assessment.delayedTransferDays.length).toBeGreaterThan(0);
      expect(profile.visibleProgressMarkersVi.length).toBeGreaterThanOrEqual(3);
      expect(profile.pronunciationVi.notRequired).toContain("accent bản ngữ");
    }
  });

  it("raises performance length and recycling demands across levels", () => {
    for (let index = 1; index < LEVELS.length; index += 1) {
      const previous = getLevelProgressionProfile(LEVELS[index - 1]);
      const current = getLevelProgressionProfile(LEVELS[index]);

      expect(current.assessment.finalPerformanceSeconds).toBeGreaterThan(
        previous.assessment.finalPerformanceSeconds,
      );
      expect(
        current.learningDesign.recycledTargetRatio[0],
      ).toBeGreaterThanOrEqual(
        previous.learningDesign.recycledTargetRatio[0],
      );
    }
  });
});

describe("50-mission scope and sequence", () => {
  it("covers exactly 50 unique legacy routes", () => {
    expect(MISSION_SCOPE_SEQUENCE).toHaveLength(
      EXPECTED_SCOPE_SEQUENCE_COUNT,
    );
    expect(
      new Set(MISSION_SCOPE_SEQUENCE.map((mission) => mission.legacyUnitId))
        .size,
    ).toBe(EXPECTED_SCOPE_SEQUENCE_COUNT);
  });

  it("contains one checkpoint for every level", () => {
    const checkpoints = getCheckpointMissions();
    expect(checkpoints).toHaveLength(LEVELS.length);

    for (const level of LEVELS) {
      expect(
        checkpoints.filter((mission) => mission.level === level),
      ).toHaveLength(1);
    }
  });

  it("moves foundation → expansion → integration → checkpoint within each level", () => {
    const order = {
      foundation: 0,
      expansion: 1,
      integration: 2,
      checkpoint: 3,
    } as const;

    for (const level of LEVELS) {
      const missions = getLevelScope(level);
      let previousStage = -1;

      for (const mission of missions) {
        const currentStage = order[mission.stage];
        expect(currentStage).toBeGreaterThanOrEqual(previousStage);
        previousStage = currentStage;
      }
    }
  });

  it("only recycles missions that were introduced earlier", () => {
    const seen = new Set<string>();

    for (const mission of MISSION_SCOPE_SEQUENCE) {
      for (const recycledId of mission.recyclesMissionIds) {
        expect(seen.has(recycledId)).toBe(true);
      }
      seen.add(mission.legacyUnitId);
    }
  });

  it("defines complete content and performance scope for every mission", () => {
    for (const mission of MISSION_SCOPE_SEQUENCE) {
      expect(mission.communicativeFunctions.length).toBeGreaterThan(0);
      expect(mission.corePatterns.length).toBeGreaterThan(0);
      expect(mission.lexicalFields.length).toBeGreaterThan(0);
      expect(mission.pronunciationFocus.length).toBeGreaterThan(0);
      expect(mission.discourseAndStrategyFocus.length).toBeGreaterThan(0);
      expect(mission.performanceEvidenceVi.length).toBeGreaterThan(15);

      if (mission.stage === "checkpoint") {
        expect(mission.recyclesMissionIds.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe("visible mastery evidence", () => {
  const missionId = "unit-1";

  const evidence: MissionAttemptEvidence[] = [
    {
      missionId,
      moment: "guided_attempt",
      recordedAt: "2026-07-22T00:00:00Z",
      completed: true,
      supportUsed: true,
      scores: {
        task_achievement: 2,
        comprehensibility: 2,
      },
    },
    {
      missionId,
      moment: "repaired_attempt",
      recordedAt: "2026-07-22T00:10:00Z",
      completed: true,
      supportUsed: false,
      scores: {
        task_achievement: 2,
        comprehensibility: 2,
        language_control: 2,
      },
    },
    {
      missionId,
      moment: "delayed_recall",
      recordedAt: "2026-07-29T00:00:00Z",
      completed: true,
      supportUsed: false,
      scores: {
        task_achievement: 3,
        comprehensibility: 2,
        language_control: 2,
      },
    },
  ];

  it("does not treat immediate supported completion as durable mastery", () => {
    const supportedOnly = deriveMissionMastery(missionId, [evidence[0]]);
    expect(supportedOnly.band).toBe("supported");
  });

  it("recognises independent and delayed retained performance", () => {
    const independent = deriveMissionMastery(missionId, evidence.slice(0, 2));
    expect(independent.band).toBe("independent");

    const retained = deriveMissionMastery(missionId, evidence);
    expect(retained.band).toBe("retained");
    expect(retained.strongestMoment).toBe("delayed_recall");
  });

  it("calculates level progress from mastery rather than raw completion", () => {
    const progress = calculateLevelProgress(
      [missionId, "unit-2"],
      evidence,
    );

    expect(progress.completedMissions).toBe(1);
    expect(progress.independentMissions).toBe(1);
    expect(progress.retainedMissions).toBe(1);
    expect(progress.transferMissions).toBe(0);
    expect(progress.progressPercent).toBe(38);
  });
});
