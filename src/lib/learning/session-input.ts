import type { LearnerSkillState } from "./evidence";
import type { PlannerCandidate } from "./session-planner";

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

export type RecentLearningAttemptRow = {
  capability_id: string | null;
  knowledge_item_id: string | null;
  prompt_id: string | null;
  metadata: unknown;
  created_at: string;
};

export type RecentPlannerHistory = {
  recentTargetIds: string[];
  recentCandidateIds: string[];
};

export function mapLearnerSkillStateRow(row: LearnerSkillStateRow): LearnerSkillState {
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
    lastEvidenceAt: row.last_evidence_at,
  };
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

    const metadata = asRecord(row.metadata);
    const lessonId = asNonEmptyString(metadata?.lessonId);
    const actionId = asNonEmptyString(metadata?.actionId) ?? asNonEmptyString(row.prompt_id);
    if (lessonId && actionId) recentCandidateIds.push(`${lessonId}:${actionId}`);
  }

  return { recentTargetIds, recentCandidateIds };
}

export function normalizeSessionSize(value: number | undefined, fallback = 5) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(12, Math.max(1, Math.floor(value)));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
