import type { RubricDimension } from "./schema";

export type EvidenceMoment =
  | "baseline"
  | "guided_attempt"
  | "repaired_attempt"
  | "delayed_recall"
  | "transfer_task";

export type MasteryBand =
  | "introduced"
  | "supported"
  | "independent"
  | "retained"
  | "transfer";

export type RubricScore = 0 | 1 | 2 | 3;

export interface MissionAttemptEvidence {
  missionId: string;
  moment: EvidenceMoment;
  recordedAt: string;
  scores: Partial<Record<RubricDimension, RubricScore>>;
  completed: boolean;
  supportUsed: boolean;
  promptVariantId?: string;
}

export interface MissionMasterySnapshot {
  missionId: string;
  band: MasteryBand;
  strongestMoment?: EvidenceMoment;
  taskAchievement: RubricScore;
  comprehensibility: RubricScore;
  averageScore: number;
  evidenceCount: number;
}

export interface LevelProgressSnapshot {
  completedMissions: number;
  independentMissions: number;
  retainedMissions: number;
  transferMissions: number;
  progressPercent: number;
  dimensionAverages: Partial<Record<RubricDimension, number>>;
}

const BAND_VALUE: Record<MasteryBand, number> = {
  introduced: 0,
  supported: 1,
  independent: 2,
  retained: 3,
  transfer: 4,
};

const MOMENT_PRIORITY: Record<EvidenceMoment, number> = {
  baseline: 0,
  guided_attempt: 1,
  repaired_attempt: 2,
  delayed_recall: 3,
  transfer_task: 4,
};

function scoreOf(
  evidence: MissionAttemptEvidence,
  dimension: RubricDimension,
): RubricScore {
  return evidence.scores[dimension] ?? 0;
}

function averageEvidenceScore(evidence: MissionAttemptEvidence): number {
  const values = Object.values(evidence.scores);
  if (values.length === 0) return 0;
  return values.reduce<number>((sum, value) => sum + value, 0) / values.length;
}

function passesCorePerformance(evidence: MissionAttemptEvidence): boolean {
  return (
    evidence.completed &&
    scoreOf(evidence, "task_achievement") >= 2 &&
    scoreOf(evidence, "comprehensibility") >= 2
  );
}

function classifyEvidence(evidence: MissionAttemptEvidence): MasteryBand {
  if (!evidence.completed) return "introduced";

  if (
    evidence.moment === "transfer_task" &&
    !evidence.supportUsed &&
    passesCorePerformance(evidence)
  ) {
    return "transfer";
  }

  if (
    evidence.moment === "delayed_recall" &&
    !evidence.supportUsed &&
    passesCorePerformance(evidence)
  ) {
    return "retained";
  }

  if (
    (evidence.moment === "repaired_attempt" ||
      evidence.moment === "guided_attempt") &&
    !evidence.supportUsed &&
    passesCorePerformance(evidence)
  ) {
    return "independent";
  }

  if (evidence.completed) return "supported";
  return "introduced";
}

/**
 * Mastery is based on observable task evidence, not XP or quiz completion.
 *
 * A learner only reaches retained/transfer after a later independent
 * performance. Repeating the same model immediately can improve a lesson
 * score but cannot by itself prove durable learning.
 */
export function deriveMissionMastery(
  missionId: string,
  evidence: MissionAttemptEvidence[],
): MissionMasterySnapshot {
  const relevant = evidence.filter((item) => item.missionId === missionId);

  let bestBand: MasteryBand = "introduced";
  let strongest: MissionAttemptEvidence | undefined;

  for (const item of relevant) {
    const band = classifyEvidence(item);
    const isHigherBand = BAND_VALUE[band] > BAND_VALUE[bestBand];
    const isSameBandButLater =
      BAND_VALUE[band] === BAND_VALUE[bestBand] &&
      (!strongest ||
        MOMENT_PRIORITY[item.moment] > MOMENT_PRIORITY[strongest.moment]);

    if (isHigherBand || isSameBandButLater) {
      bestBand = band;
      strongest = item;
    }
  }

  return {
    missionId,
    band: bestBand,
    strongestMoment: strongest?.moment,
    taskAchievement: strongest
      ? scoreOf(strongest, "task_achievement")
      : 0,
    comprehensibility: strongest
      ? scoreOf(strongest, "comprehensibility")
      : 0,
    averageScore: strongest
      ? Math.round(averageEvidenceScore(strongest) * 100) / 100
      : 0,
    evidenceCount: relevant.length,
  };
}

export function calculateLevelProgress(
  missionIds: string[],
  evidence: MissionAttemptEvidence[],
): LevelProgressSnapshot {
  if (missionIds.length === 0) {
    return {
      completedMissions: 0,
      independentMissions: 0,
      retainedMissions: 0,
      transferMissions: 0,
      progressPercent: 0,
      dimensionAverages: {},
    };
  }

  const snapshots = missionIds.map((missionId) =>
    deriveMissionMastery(missionId, evidence),
  );

  const completedMissions = snapshots.filter(
    (snapshot) => snapshot.band !== "introduced",
  ).length;
  const independentMissions = snapshots.filter(
    (snapshot) => BAND_VALUE[snapshot.band] >= BAND_VALUE.independent,
  ).length;
  const retainedMissions = snapshots.filter(
    (snapshot) => BAND_VALUE[snapshot.band] >= BAND_VALUE.retained,
  ).length;
  const transferMissions = snapshots.filter(
    (snapshot) => snapshot.band === "transfer",
  ).length;

  const maxPoints = missionIds.length * BAND_VALUE.transfer;
  const earnedPoints = snapshots.reduce(
    (sum, snapshot) => sum + BAND_VALUE[snapshot.band],
    0,
  );

  const dimensionTotals = new Map<
    RubricDimension,
    { total: number; count: number }
  >();

  for (const item of evidence) {
    if (!missionIds.includes(item.missionId)) continue;
    for (const [dimension, score] of Object.entries(item.scores) as Array<
      [RubricDimension, RubricScore]
    >) {
      const current = dimensionTotals.get(dimension) ?? {
        total: 0,
        count: 0,
      };
      current.total += score;
      current.count += 1;
      dimensionTotals.set(dimension, current);
    }
  }

  const dimensionAverages: Partial<Record<RubricDimension, number>> = {};
  for (const [dimension, value] of dimensionTotals) {
    dimensionAverages[dimension] =
      Math.round((value.total / value.count) * 100) / 100;
  }

  return {
    completedMissions,
    independentMissions,
    retainedMissions,
    transferMissions,
    progressPercent: Math.round((earnedPoints / maxPoints) * 100),
    dimensionAverages,
  };
}
