export const ERROR_MEMORY_ATTEMPT_SELECT = [
  "capability_id",
  "knowledge_item_id",
  "correct",
  "support_level",
  "reveal_used",
  "lesson_id:metadata->>lessonId",
  "lesson_version:metadata->>lessonVersion",
  "action_id:metadata->>actionId",
  "observed_response:metadata->errorSignals->observedResponse",
  "error_tags:metadata->errorSignals->errorTags",
  "remediation_hints:metadata->errorSignals->remediationHints",
  "created_at",
].join(", ");

export type ErrorMemoryAttemptRow = {
  capability_id: string | null;
  knowledge_item_id: string | null;
  correct: boolean | null;
  support_level: number;
  reveal_used: boolean;
  lesson_id: string | null;
  lesson_version: string | null;
  action_id: string | null;
  observed_response: unknown;
  error_tags: unknown;
  remediation_hints: unknown;
  created_at: string;
};

export type ActionableErrorTag = "incorrect-choice" | `missing-target-group:${number}`;
export type ErrorMemoryStatus = "supported-only" | "observed" | "recurring" | "repaired";

export type ErrorMemoryEntry = {
  key: string;
  targetId: string;
  lessonId: string;
  lessonVersion: string;
  actionId: string;
  errorTag: ActionableErrorTag;
  remediationCandidateIds: string[];
  status: ErrorMemoryStatus;
  independentFailureCount: number;
  supportedFailureCount: number;
  independentFailuresSinceRepair: number;
  firstSeenAt: string;
  lastSeenAt: string;
  repairedAt: string | null;
};

export type ErrorMemorySnapshot = {
  entries: ErrorMemoryEntry[];
  recurring: ErrorMemoryEntry[];
  observed: ErrorMemoryEntry[];
  repaired: ErrorMemoryEntry[];
};

type MutableEntry = ErrorMemoryEntry;

/**
 * Error Memory V1 turns repeated, independent task-coverage failures into a temporary pattern.
 * One failure is only an observation. Assisted failures (support or answer reveal) do not promote
 * recurrence. A later independent success on the same versioned action repairs all active tags.
 */
export function buildErrorMemory(rows: ErrorMemoryAttemptRow[]): ErrorMemorySnapshot {
  const entries = new Map<string, MutableEntry>();
  const ordered = [...rows].sort((a, b) => {
    const time = Date.parse(a.created_at) - Date.parse(b.created_at);
    if (time !== 0) return time;
    return rowIdentity(a).localeCompare(rowIdentity(b));
  });

  for (const row of ordered) {
    const targetId = row.capability_id ?? row.knowledge_item_id;
    const lessonId = nonEmpty(row.lesson_id);
    const lessonVersion = nonEmpty(row.lesson_version);
    const actionId = nonEmpty(row.action_id);
    if (!targetId || !lessonId || !lessonVersion || !actionId) continue;

    const observedResponse = row.observed_response === true;
    const assisted = (Number.isFinite(row.support_level) && row.support_level > 0) || row.reveal_used === true;

    if (row.correct === true && observedResponse && !assisted) {
      repairActionEntries(entries, targetId, lessonId, lessonVersion, actionId, row.created_at);
      continue;
    }

    if (row.correct !== false || !observedResponse) continue;

    for (const errorTag of actionableErrorTags(row.error_tags)) {
      const key = memoryKey(targetId, lessonId, lessonVersion, actionId, errorTag);
      const remediationCandidateIds = remediationCandidateIdsForTag(row.remediation_hints, errorTag);
      const existing = entries.get(key);
      if (!existing) {
        entries.set(key, {
          key,
          targetId,
          lessonId,
          lessonVersion,
          actionId,
          errorTag,
          remediationCandidateIds,
          status: assisted ? "supported-only" : "observed",
          independentFailureCount: assisted ? 0 : 1,
          supportedFailureCount: assisted ? 1 : 0,
          independentFailuresSinceRepair: assisted ? 0 : 1,
          firstSeenAt: row.created_at,
          lastSeenAt: row.created_at,
          repairedAt: null,
        });
        continue;
      }

      existing.lastSeenAt = row.created_at;
      existing.remediationCandidateIds = mergeCandidateIds(
        existing.remediationCandidateIds,
        remediationCandidateIds,
      );
      if (assisted) {
        existing.supportedFailureCount += 1;
      } else {
        existing.independentFailureCount += 1;
        existing.independentFailuresSinceRepair += 1;
        existing.repairedAt = null;
      }
      existing.status = statusFor(existing);
    }
  }

  const allEntries = [...entries.values()]
    .map((entry) => ({
      ...entry,
      remediationCandidateIds: [...entry.remediationCandidateIds].sort(),
      status: statusFor(entry),
    }))
    .sort(compareEntries);

  return {
    entries: allEntries,
    recurring: allEntries.filter((entry) => entry.status === "recurring"),
    observed: allEntries.filter((entry) => entry.status === "observed" || entry.status === "supported-only"),
    repaired: allEntries.filter((entry) => entry.status === "repaired"),
  };
}

export function actionableErrorTags(value: unknown): ActionableErrorTag[] {
  if (!Array.isArray(value)) return [];
  const tags = new Set<ActionableErrorTag>();
  for (const item of value) {
    if (item === "incorrect-choice") {
      tags.add(item);
      continue;
    }
    if (typeof item !== "string") continue;
    const match = /^missing-target-group:(\d+)$/.exec(item);
    if (!match) continue;
    tags.add(`missing-target-group:${Number(match[1])}`);
  }
  return [...tags].sort();
}

export function remediationCandidateIdsForTag(value: unknown, errorTag: ActionableErrorTag) {
  if (!Array.isArray(value)) return [];
  const candidateIds = new Set<string>();

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const hint = item as Record<string, unknown>;
    if (hint.errorTag !== errorTag) continue;
    const candidateId = typeof hint.candidateId === "string" ? hint.candidateId.trim() : "";
    if (candidateId) candidateIds.add(candidateId);
  }

  return [...candidateIds].sort();
}

function repairActionEntries(
  entries: Map<string, MutableEntry>,
  targetId: string,
  lessonId: string,
  lessonVersion: string,
  actionId: string,
  repairedAt: string,
) {
  for (const entry of entries.values()) {
    if (
      entry.targetId !== targetId
      || entry.lessonId !== lessonId
      || entry.lessonVersion !== lessonVersion
      || entry.actionId !== actionId
    ) {
      continue;
    }
    if (entry.independentFailureCount === 0) continue;
    entry.independentFailuresSinceRepair = 0;
    entry.repairedAt = repairedAt;
    entry.status = "repaired";
  }
}

function statusFor(entry: ErrorMemoryEntry): ErrorMemoryStatus {
  if (entry.repairedAt && entry.independentFailuresSinceRepair === 0) return "repaired";
  if (entry.independentFailuresSinceRepair >= 2) return "recurring";
  if (entry.independentFailuresSinceRepair === 1) return "observed";
  return "supported-only";
}

function memoryKey(
  targetId: string,
  lessonId: string,
  lessonVersion: string,
  actionId: string,
  errorTag: ActionableErrorTag,
) {
  return [targetId, lessonId, lessonVersion, actionId, errorTag].join("|");
}

function rowIdentity(row: ErrorMemoryAttemptRow) {
  return [
    row.capability_id ?? row.knowledge_item_id ?? "",
    row.lesson_id ?? "",
    row.lesson_version ?? "",
    row.action_id ?? "",
    String(row.correct),
    String(row.support_level),
    String(row.reveal_used),
    JSON.stringify(row.error_tags),
    JSON.stringify(row.remediation_hints),
  ].join("|");
}

function compareEntries(a: ErrorMemoryEntry, b: ErrorMemoryEntry) {
  const statusRank: Record<ErrorMemoryStatus, number> = {
    recurring: 0,
    observed: 1,
    "supported-only": 2,
    repaired: 3,
  };
  return statusRank[a.status] - statusRank[b.status]
    || b.independentFailuresSinceRepair - a.independentFailuresSinceRepair
    || Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt)
    || a.key.localeCompare(b.key);
}

function mergeCandidateIds(first: string[], second: string[]) {
  return [...new Set([...first, ...second])].sort();
}

function nonEmpty(value: string | null) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}
