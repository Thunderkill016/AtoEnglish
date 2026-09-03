import type { ErrorMemoryEntry } from "./error-memory";
import type { EvidenceType, LearnerSkillState } from "./evidence";
import { createEmptyLearnerSkillState } from "./evidence";
import {
  hasObservedLearnerDimension,
  readLearnerDimension,
} from "./learner-state-read";

export type PlannerCandidate = {
  id: string;
  targetId: string;
  evidenceType: EvidenceType;
  prerequisiteTargetIds?: string[];
  importance?: number;
  transferValue?: number;
  metadata?: Record<string, unknown>;
};

export type SessionPlannerConfig = {
  prerequisiteReadinessFloor: number;
  transferProductionFloor: number;
  maxPerTarget: number;
  recentTargetPenalty: number;
  recentCandidatePenalty: number;
  inSessionRepeatPenalty: number;
  recurringErrorRepairWeight: number;
  recurringErrorReprobeWeight: number;
};

export type SessionPlannerInput = {
  candidates: PlannerCandidate[];
  states: LearnerSkillState[];
  sessionSize: number;
  now?: string;
  recentTargetIds?: string[];
  recentCandidateIds?: string[];
  errorMemory?: ErrorMemoryEntry[];
  config?: Partial<SessionPlannerConfig>;
};

export type PlannerScoreBreakdown = {
  skillGap: number;
  coldStart: number;
  staleness: number;
  importance: number;
  transferValue: number;
  errorRepairPressure: number;
  errorReprobePressure: number;
  recentTargetPenalty: number;
  recentCandidatePenalty: number;
  inSessionRepeatPenalty: number;
  total: number;
};

export type PlannedOpportunity = {
  candidate: PlannerCandidate;
  score: number;
  breakdown: PlannerScoreBreakdown;
  reasons: string[];
};

export type BlockedOpportunity = {
  candidate: PlannerCandidate;
  reasons: string[];
};

export type SessionPlan = {
  opportunities: PlannedOpportunity[];
  blocked: BlockedOpportunity[];
  policy: "session-planner-v1";
};

export const DEFAULT_SESSION_PLANNER_CONFIG: SessionPlannerConfig = {
  prerequisiteReadinessFloor: 0.2,
  transferProductionFloor: 0.2,
  maxPerTarget: 2,
  recentTargetPenalty: 0.55,
  recentCandidatePenalty: 0.75,
  inSessionRepeatPenalty: 0.8,
  recurringErrorRepairWeight: 0.65,
  recurringErrorReprobeWeight: 0.6,
};

const COLD_START_BONUS: Record<EvidenceType, number> = {
  recognition: 0.4,
  retrieval: 0.32,
  listening: 0.26,
  production: 0.18,
  repair: 0.12,
  transfer: 0,
  retention: 0,
};

const EVIDENCE_TIE_ORDER: Record<EvidenceType, number> = {
  recognition: 0,
  retrieval: 1,
  listening: 2,
  production: 3,
  repair: 4,
  transfer: 5,
  retention: 6,
};

export function planSession(input: SessionPlannerInput): SessionPlan {
  const config = { ...DEFAULT_SESSION_PLANNER_CONFIG, ...input.config };
  const states = new Map(input.states.map((state) => [state.targetId, state]));
  const recognitionTargets = new Set(
    input.candidates
      .filter((candidate) => candidate.evidenceType === "recognition")
      .map((candidate) => candidate.targetId),
  );
  const now = parseTime(input.now) ?? Date.now();
  const recentTargetIds = input.recentTargetIds ?? [];
  const recentCandidateIds = input.recentCandidateIds ?? [];
  const errorMemory = input.errorMemory ?? [];
  const selected: PlannedOpportunity[] = [];
  const selectedIds = new Set<string>();
  const targetCounts = new Map<string, number>();
  const blocked = new Map<string, BlockedOpportunity>();
  const limit = Math.max(0, Math.floor(input.sessionSize));

  while (selected.length < limit) {
    const ranked: PlannedOpportunity[] = [];

    for (const candidate of input.candidates) {
      if (selectedIds.has(candidate.id)) continue;

      const selectedForTarget = targetCounts.get(candidate.targetId) ?? 0;
      if (selectedForTarget >= config.maxPerTarget) {
        blocked.set(candidate.id, { candidate, reasons: ["target-session-cap"] });
        continue;
      }

      const eligibility = checkEligibility(
        candidate,
        states,
        config,
        recognitionTargets.has(candidate.targetId),
      );
      if (!eligibility.eligible) {
        blocked.set(candidate.id, { candidate, reasons: eligibility.reasons });
        continue;
      }

      ranked.push(scoreCandidate({
        candidate,
        state: states.get(candidate.targetId) ?? createEmptyLearnerSkillState(candidate.targetId),
        now,
        recentTargetIds,
        recentCandidateIds,
        errorMemory,
        selectedForTarget,
        config,
      }));
    }

    ranked.sort(comparePlannedOpportunities);
    const next = ranked[0];
    if (!next) break;

    selected.push(next);
    selectedIds.add(next.candidate.id);
    targetCounts.set(next.candidate.targetId, (targetCounts.get(next.candidate.targetId) ?? 0) + 1);
    blocked.delete(next.candidate.id);
  }

  return {
    opportunities: selected,
    blocked: [...blocked.values()].sort((a, b) => a.candidate.id.localeCompare(b.candidate.id)),
    policy: "session-planner-v1",
  };
}

function checkEligibility(
  candidate: PlannerCandidate,
  states: Map<string, LearnerSkillState>,
  config: SessionPlannerConfig,
  targetHasRecognitionCandidate: boolean,
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  for (const prerequisiteTargetId of candidate.prerequisiteTargetIds ?? []) {
    const state = states.get(prerequisiteTargetId) ?? createEmptyLearnerSkillState(prerequisiteTargetId);
    if (readiness(state) < config.prerequisiteReadinessFloor) {
      reasons.push(`prerequisite-not-ready:${prerequisiteTargetId}`);
    }
  }

  const targetState = states.get(candidate.targetId) ?? createEmptyLearnerSkillState(candidate.targetId);
  if (
    targetHasRecognitionCandidate
    && targetState.evidenceCount === 0
    && candidate.evidenceType !== "recognition"
  ) {
    reasons.push("cold-start-needs-recognition");
  }
  if (candidate.evidenceType === "transfer") {
    const production = readLearnerDimension(targetState, "production");
    if (production.status === "unknown") {
      reasons.push("transfer-needs-observed-production");
    } else if ((production.estimate ?? 0) < config.transferProductionFloor) {
      reasons.push("transfer-needs-prior-production");
    }
  }
  if (candidate.evidenceType === "retention" && targetState.evidenceCount === 0) {
    reasons.push("retention-needs-prior-evidence");
  }

  return { eligible: reasons.length === 0, reasons };
}

function scoreCandidate(input: {
  candidate: PlannerCandidate;
  state: LearnerSkillState;
  now: number;
  recentTargetIds: string[];
  recentCandidateIds: string[];
  errorMemory: ErrorMemoryEntry[];
  selectedForTarget: number;
  config: SessionPlannerConfig;
}): PlannedOpportunity {
  const {
    candidate,
    state,
    now,
    recentTargetIds,
    recentCandidateIds,
    errorMemory,
    selectedForTarget,
    config,
  } = input;
  const dimension = readLearnerDimension(state, candidate.evidenceType);
  const skillGap = dimension.estimate === null ? 0 : 1 - clamp01(dimension.estimate);
  const coldStart = dimension.status === "unknown" ? COLD_START_BONUS[candidate.evidenceType] : 0;
  const staleness = calculateStaleness(state.lastEvidenceAt, now);
  const importance = clamp01(candidate.importance ?? 0.5);
  const transferValue = clamp01(candidate.transferValue ?? 0);
  const recurringErrorCount = matchingRecurringErrorCount(candidate, errorMemory);
  const recurringReprobeCount = matchingRecurringReprobeCount(candidate, errorMemory);
  const errorRepairPressure = recurringErrorCount > 0 ? 1 : 0;
  const errorReprobePressure = recurringReprobeCount > 0 ? 1 : 0;
  const recentTargetPenalty = countMatches(recentTargetIds, candidate.targetId) * config.recentTargetPenalty;
  const recentCandidatePenalty = countMatches(recentCandidateIds, candidate.id) * config.recentCandidatePenalty;
  const inSessionRepeatPenalty = selectedForTarget * config.inSessionRepeatPenalty;

  const total =
    skillGap * 1.35
    + coldStart
    + staleness * 0.35
    + importance * 0.45
    + transferValue * 0.25
    + errorRepairPressure * config.recurringErrorRepairWeight
    + errorReprobePressure * config.recurringErrorReprobeWeight
    - recentTargetPenalty
    - recentCandidatePenalty
    - inSessionRepeatPenalty;

  const reasons = [
    dimension.status === "unknown"
      ? `evidence-unknown:${candidate.evidenceType}`
      : `skill-gap:${round(skillGap)}`,
    `importance:${round(importance)}`,
  ];
  if (coldStart > 0) reasons.push(`cold-start:${candidate.evidenceType}`);
  if (staleness > 0) reasons.push(`staleness:${round(staleness)}`);
  if (transferValue > 0) reasons.push(`transfer-value:${round(transferValue)}`);
  if (errorRepairPressure > 0) reasons.push(`recurring-error-repair:${recurringErrorCount}`);
  if (errorReprobePressure > 0) reasons.push(`recurring-error-reprobe:${recurringReprobeCount}`);
  if (recentTargetPenalty > 0 || recentCandidatePenalty > 0) reasons.push("recent-practice-penalty");
  if (inSessionRepeatPenalty > 0) reasons.push("in-session-diversity-penalty");

  return {
    candidate,
    score: total,
    breakdown: {
      skillGap,
      coldStart,
      staleness,
      importance,
      transferValue,
      errorRepairPressure,
      errorReprobePressure,
      recentTargetPenalty,
      recentCandidatePenalty,
      inSessionRepeatPenalty,
      total,
    },
    reasons,
  };
}

/**
 * Explicit remediation hints override same-action fallback. Repair pressure stays active only until
 * an independent successful attempt on one of the declared remediation candidates has occurred.
 * At that point the source task receives re-probe pressure instead.
 */
function matchingRecurringErrorCount(candidate: PlannerCandidate, entries: ErrorMemoryEntry[]) {
  const lessonId = metadataString(candidate.metadata, "lessonId");
  const lessonVersion = metadataLessonVersion(candidate.metadata);
  const actionId = metadataString(candidate.metadata, "actionId");

  return entries.reduce((count, entry) => {
    if (entry.status !== "recurring" || entry.remediationSatisfiedAt) return count;

    if (entry.remediationCandidateIds.length > 0) {
      return count + (entry.remediationCandidateIds.includes(candidate.id) ? 1 : 0);
    }

    if (!lessonId || !lessonVersion || !actionId) return count;
    const legacySameActionMatch = entry.targetId === candidate.targetId
      && entry.lessonId === lessonId
      && entry.lessonVersion === lessonVersion
      && entry.actionId === actionId;
    return count + (legacySameActionMatch ? 1 : 0);
  }, 0);
}

function matchingRecurringReprobeCount(candidate: PlannerCandidate, entries: ErrorMemoryEntry[]) {
  const lessonId = metadataString(candidate.metadata, "lessonId");
  const lessonVersion = metadataLessonVersion(candidate.metadata);
  const actionId = metadataString(candidate.metadata, "actionId");
  if (!lessonId || !lessonVersion || !actionId) return 0;

  return entries.reduce((count, entry) => {
    const matchesSource = entry.status === "recurring"
      && entry.remediationSatisfiedAt !== null
      && entry.targetId === candidate.targetId
      && entry.lessonId === lessonId
      && entry.lessonVersion === lessonVersion
      && entry.actionId === actionId;
    return count + (matchesSource ? 1 : 0);
  }, 0);
}

function metadataString(metadata: Record<string, unknown> | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function metadataLessonVersion(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.lessonVersion;
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return String(value);
  }
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readiness(state: LearnerSkillState) {
  const observed = (["retrieval", "production", "transfer", "retention"] as const)
    .flatMap((type) => {
      const dimension = readLearnerDimension(state, type);
      return dimension.estimate === null ? [] : [dimension.estimate];
    });
  const recognition = readLearnerDimension(state, "recognition");
  const listening = readLearnerDimension(state, "listening");
  if (recognition.estimate !== null) observed.push(recognition.estimate * 0.5);
  if (listening.estimate !== null) observed.push(listening.estimate * 0.5);
  return observed.length > 0 ? Math.max(...observed) : 0;
}

function calculateStaleness(lastEvidenceAt: string | null, now: number) {
  if (!lastEvidenceAt) return 0;
  const last = parseTime(lastEvidenceAt);
  if (last === null || last >= now) return 0;
  const ageDays = (now - last) / 86_400_000;
  return clamp01(ageDays / 14);
}

function parseTime(value?: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function countMatches(values: string[], needle: string) {
  return values.reduce((count, value) => count + (value === needle ? 1 : 0), 0);
}

function comparePlannedOpportunities(a: PlannedOpportunity, b: PlannedOpportunity) {
  const scoreDifference = b.score - a.score;
  if (Math.abs(scoreDifference) > 1e-9) return scoreDifference;

  const evidenceDifference = EVIDENCE_TIE_ORDER[a.candidate.evidenceType] - EVIDENCE_TIE_ORDER[b.candidate.evidenceType];
  if (evidenceDifference !== 0) return evidenceDifference;

  return a.candidate.id.localeCompare(b.candidate.id);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
