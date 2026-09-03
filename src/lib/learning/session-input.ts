import {
  EVIDENCE_TYPES,
  type EvidenceCoverage,
  type EvidenceType,
  type LearnerSkillState,
} from "./evidence";
import type { PlannerCandidate } from "./session-planner";

export const PLANNER_SKILL_STATE_SELECT =
  "target_id, recognition, retrieval, listening, production, repair, transfer, retention, evidence_count, last_evidence_at";

export const PLANNER_RECENT_ATTEMPT_SELECT =
  "capability_id, knowledge_item_id, prompt_id, lesson_id:metadata->>lessonId, action_id:metadata->>actionId, created_at";

export type LearnerSkillStateRow = {
  target_id: string;
  recognition: number;
  retrieval: number;
  listening: number;
  production: number;
  repair: number;
  transfer: number;
  retention: number;
  evidence_count: number;
  last_evidence_at: string | null;
};

export type LearnerEvidenceCoverageRow = {
  target_id: string;
  evidence_type: string;
  evidence_count: number | string;
};

export type RecentLearningAttemptRow = {
  capability_id: string | null;
  knowledge_item_id: string | null;
  prompt_id: string | null;
  lesson_id: string | null;
  action_id: string | null;
  created_at: string;
};

export type RecentPlannerHistory = {
  recentTargetIds: string[];
  recentCandidateIds: string[];
};

export function mapLearnerSkillStateRow(
  row: LearnerSkillStateRow,
  evidenceByType?: EvidenceCoverage,
): LearnerSkillState {
  return {
    targetId: row.target_id,
    recognition: clamp01(row.recognition),
    retrieval: clamp01(row.retrieval),
    listening: clamp01(row.listening),
    production: clamp01(row.production),
    repair: clamp01(row.repair),
    transfer: clamp01(row.transfer),
    retention: clamp01(row.retention),
    evidenceCount: Math.max(0, Math.floor(row.evidence_count)),
    evidenceByType,
    lastEvidenceAt: row.last_evidence_at,
  };
}

export function buildLearnerEvidenceCoverage(rows: LearnerEvidenceCoverageRow[]) {
  const coverageByTarget = new Map<string, EvidenceCoverage>();

  for (const row of rows) {
    if (!isEvidenceType(row.evidence_type)) continue;
    const evidenceCount = normalizeCount(row.evidence_count);
    if (evidenceCount === 0) continue;

    const coverage = coverageByTarget.get(row.target_id) ?? {};
    coverage[row.evidence_type] = evidenceCount;
    coverageByTarget.set(row.target_id, coverage);
  }

  return coverageByTarget;
}

export function collectPlannerTargetIds(candidates: PlannerCandidate[]): string[] {
  const ids = new Set<string>();
  for (const candidate of candidates) {
    ids.add(candidate.targetId);
    for (const prerequisite of candidate.prerequisiteTargetIds ?? []) ids.add(prerequisite);
  }
  return [...ids].sort();
}

/**
 * Recent attempts are exposure history, not mastery evidence. An attempt that failed,
 * used support, or produced no evidence still counts for anti-repetition.
 */
export function deriveRecentPlannerHistory(rows: RecentLearningAttemptRow[]): RecentPlannerHistory {
  const recentTargetIds: string[] = [];
  const recentCandidateIds: string[] = [];

  for (const row of rows) {
    const targetId = row.capability_id ?? row.knowledge_item_id;
    if (targetId) recentTargetIds.push(targetId);

    const lessonId = asNonEmptyString(row.lesson_id);
    const actionId = asNonEmptyString(row.action_id) ?? asNonEmptyString(row.prompt_id);
    if (lessonId && actionId) recentCandidateIds.push(`${lessonId}:${actionId}`);
  }

  return { recentTargetIds, recentCandidateIds };
}

export function normalizeSessionSize(value: number | undefined, fallback = 5) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(12, Math.max(1, Math.floor(value)));
}

function isEvidenceType(value: string): value is EvidenceType {
  return (EVIDENCE_TYPES as readonly string[]).includes(value);
}

function normalizeCount(value: number | string) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
}

function asNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
