import type { EvidenceEvent, EvidenceType, LearnerSkillState } from "./evidence";
import { applyEvidenceToSkillState, createEmptyLearnerSkillState } from "./evidence";

export const SKILL_STATE_FIELDS: readonly EvidenceType[] = [
  "recognition",
  "retrieval",
  "listening",
  "production",
  "repair",
  "transfer",
  "retention",
];

/**
 * Rebuild a planner-friendly snapshot from immutable evidence events.
 * This is intentionally deterministic so production snapshots can be audited/rebuilt.
 */
export function reduceEvidenceHistory(
  targetId: string,
  events: Array<{ event: EvidenceEvent; occurredAt: string }>
): LearnerSkillState {
  return events.reduce(
    (state, item) => applyEvidenceToSkillState(state, item.event, item.occurredAt),
    createEmptyLearnerSkillState(targetId)
  );
}
