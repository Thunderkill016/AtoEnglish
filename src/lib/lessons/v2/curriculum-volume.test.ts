import { describe, expect, it } from "vitest";

import {
  LEVEL_CURRICULUM_VOLUME,
  REQUIRED_LESSON_COUNT_BY_LEVEL,
  TOTAL_REQUIRED_LESSONS,
  calculateLearnerLessonLoad,
} from "./curriculum-volume";
import {
  EXERCISE_DOSAGE_BY_LEVEL,
  isTargetDosageComplete,
  summarizeTargetDosage,
  type TargetEncounterRecord,
} from "./exercise-dosage";
import type { CefrLevel } from "./schema";

const LEVELS: CefrLevel[] = ["PRE_A1", "A1", "A2", "B1", "B2"];

describe("Curriculum V2 volume", () => {
  it("requires 264 fixed lessons before adaptive remediation", () => {
    expect(REQUIRED_LESSON_COUNT_BY_LEVEL).toEqual({
      PRE_A1: 26,
      A1: 51,
      A2: 51,
      B1: 68,
      B2: 68,
    });
    expect(TOTAL_REQUIRED_LESSONS).toBe(264);
  });

  it("places a checkpoint after every four mission modules", () => {
    for (const level of LEVELS) {
      const volume = LEVEL_CURRICULUM_VOLUME[level];
      expect(volume.checkpointCount).toBe(
        Math.ceil(volume.missionModuleCount / 4),
      );
    }
  });

  it("separates encounter, communication and retention at every level", () => {
    for (const level of LEVELS) {
      const kinds = LEVEL_CURRICULUM_VOLUME[level].moduleLessonKinds;
      expect(kinds).toContain("encounter");
      expect(kinds).toContain("communicate");
      expect(kinds).toContain("retain_transfer");
    }
  });

  it("adds adaptive review without changing the fixed curriculum count", () => {
    expect(calculateLearnerLessonLoad("A2", 7.9)).toEqual({
      requiredLessons: 51,
      adaptiveReviewLessons: 7,
      totalAssignedLessons: 58,
    });
  });
});

describe("Exercise dosage by level", () => {
  it("requires delayed recall and transfer for every level", () => {
    for (const level of LEVELS) {
      const profile = EXERCISE_DOSAGE_BY_LEVEL[level];
      expect(profile.requiredEncounterKinds).toContain("delayed_recall");
      expect(profile.requiredEncounterKinds).toContain("transfer_use");
      expect(profile.requiredPerformanceAttempts).toBeGreaterThanOrEqual(2);
      expect(profile.maximumImmediateRetrievalsPerTarget).toBe(3);
    }
  });

  it("raises context variation and module practice demands", () => {
    const contextCounts = LEVELS.map(
      (level) =>
        EXERCISE_DOSAGE_BY_LEVEL[level].minimumDistinctContextsPerCoreTarget,
    );
    const minimumOpportunities = LEVELS.map(
      (level) =>
        EXERCISE_DOSAGE_BY_LEVEL[level]
          .practiceOpportunitiesPerMissionModule[0],
    );

    expect(contextCounts).toEqual([2, 2, 3, 3, 4]);
    expect(minimumOpportunities).toEqual([14, 20, 24, 28, 30]);
  });

  it("does not mark massed same-session practice as complete learning", () => {
    const records: TargetEncounterRecord[] = [
      "model_exposure",
      "noticing",
      "successful_retrieval",
      "successful_retrieval",
      "successful_retrieval",
      "guided_use",
      "independent_performance",
    ].map((kind, index) => ({
      targetId: "name",
      kind: kind as TargetEncounterRecord["kind"],
      contextId: `same-session-${Math.min(index, 1)}`,
      successful: true,
      delayed: false,
    }));

    const snapshot = summarizeTargetDosage("name", records);
    expect(isTargetDosageComplete("PRE_A1", snapshot)).toBe(false);
  });

  it("marks a target complete only after successful delayed recall and transfer", () => {
    const records: TargetEncounterRecord[] = [
      { kind: "model_exposure", contextId: "reception", delayed: false },
      { kind: "noticing", contextId: "reception", delayed: false },
      { kind: "recognition", contextId: "practice", delayed: false },
      { kind: "successful_retrieval", contextId: "practice", delayed: false },
      { kind: "successful_retrieval", contextId: "practice", delayed: false },
      { kind: "successful_retrieval", contextId: "guided-task", delayed: false },
      { kind: "successful_retrieval", contextId: "guided-task", delayed: false },
      { kind: "guided_use", contextId: "guided-task", delayed: false },
      {
        kind: "independent_performance",
        contextId: "performance",
        delayed: false,
      },
      { kind: "delayed_recall", contextId: "day-1", delayed: true },
      { kind: "transfer_use", contextId: "new-scenario", delayed: true },
    ].map((record) => ({
      targetId: "name",
      successful: true,
      ...record,
    }));

    const snapshot = summarizeTargetDosage("name", records);
    expect(isTargetDosageComplete("PRE_A1", snapshot)).toBe(true);
  });
});
