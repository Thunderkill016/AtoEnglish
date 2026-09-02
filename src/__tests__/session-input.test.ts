import { describe, expect, it } from "vitest";

import {
  collectPlannerTargetIds,
  deriveRecentPlannerHistory,
  mapLearnerSkillStateRow,
  normalizeSessionSize,
  PLANNER_RECENT_ATTEMPT_SELECT,
  PLANNER_SKILL_STATE_SELECT,
  type LearnerSkillStateRow,
  type RecentLearningAttemptRow,
} from "@/lib/learning/session-input";
import type { PlannerCandidate } from "@/lib/learning/session-planner";

function stateRow(overrides: Partial<LearnerSkillStateRow> = {}): LearnerSkillStateRow {
  return {
    target_id: "CAP-002",
    recognition: 0.2,
    retrieval: 0.3,
    listening: 0.4,
    production: 0.5,
    repair: 0.1,
    transfer: 0.05,
    retention: 0.25,
    evidence_count: 3,
    last_evidence_at: "2026-09-02T12:00:00.000Z",
    ...overrides,
  };
}

function recentRow(overrides: Partial<RecentLearningAttemptRow> = {}): RecentLearningAttemptRow {
  return {
    capability_id: "CAP-002",
    knowledge_item_id: null,
    prompt_id: "produce",
    lesson_id: "LESSON-CAP002-FIRST-MEETING-V1",
    action_id: "produce",
    created_at: "2026-09-02T12:00:00.000Z",
    ...overrides,
  };
}

describe("Session Planner read-model adapters", () => {
  it("maps DB learner state to the planner shape and clamps malformed values", () => {
    const mapped = mapLearnerSkillStateRow(stateRow({
      recognition: 1.4,
      retrieval: -0.2,
      evidence_count: -3,
    }));

    expect(mapped).toMatchObject({
      targetId: "CAP-002",
      recognition: 1,
      retrieval: 0,
      evidenceCount: 0,
      lastEvidenceAt: "2026-09-02T12:00:00.000Z",
    });
  });

  it("collects both candidate targets and prerequisite targets exactly once", () => {
    const candidates: PlannerCandidate[] = [
      {
        id: "a",
        targetId: "CAP-002",
        evidenceType: "production",
        prerequisiteTargetIds: ["CAP-001"],
      },
      {
        id: "b",
        targetId: "CAP-003",
        evidenceType: "repair",
        prerequisiteTargetIds: ["CAP-001"],
      },
    ];

    expect(collectPlannerTargetIds(candidates)).toEqual(["CAP-001", "CAP-002", "CAP-003"]);
  });

  it("derives anti-repetition history from attempts even though they are not mastery evidence", () => {
    const history = deriveRecentPlannerHistory([
      recentRow(),
      recentRow({
        capability_id: "CAP-003",
        prompt_id: "repair",
        action_id: "repair",
      }),
    ]);

    expect(history.recentTargetIds).toEqual(["CAP-002", "CAP-003"]);
    expect(history.recentCandidateIds).toEqual([
      "LESSON-CAP002-FIRST-MEETING-V1:produce",
      "LESSON-CAP002-FIRST-MEETING-V1:repair",
    ]);
  });

  it("falls back to prompt_id when projected action_id is absent", () => {
    const history = deriveRecentPlannerHistory([
      recentRow({ action_id: null, prompt_id: "transfer" }),
    ]);

    expect(history.recentCandidateIds).toEqual([
      "LESSON-CAP002-FIRST-MEETING-V1:transfer",
    ]);
  });

  it("supports knowledge-item history without inventing a candidate id", () => {
    const history = deriveRecentPlannerHistory([
      recentRow({
        capability_id: null,
        knowledge_item_id: "word:borrow",
        lesson_id: null,
        action_id: null,
      }),
    ]);

    expect(history.recentTargetIds).toEqual(["word:borrow"]);
    expect(history.recentCandidateIds).toEqual([]);
  });

  it("clamps requested session size to a small bounded range", () => {
    expect(normalizeSessionSize(undefined)).toBe(5);
    expect(normalizeSessionSize(0)).toBe(1);
    expect(normalizeSessionSize(3.9)).toBe(3);
    expect(normalizeSessionSize(99)).toBe(12);
    expect(normalizeSessionSize(Number.NaN, 4)).toBe(4);
  });

  it("locks the planner projections to non-sensitive fields", () => {
    expect(PLANNER_SKILL_STATE_SELECT).not.toContain("user_id");
    expect(PLANNER_RECENT_ATTEMPT_SELECT).not.toContain("response_text");
    expect(PLANNER_RECENT_ATTEMPT_SELECT).not.toMatch(/(?:^|,)\s*metadata\s*(?:,|$)/);
    expect(PLANNER_RECENT_ATTEMPT_SELECT).toContain("lesson_id:metadata->>lessonId");
    expect(PLANNER_RECENT_ATTEMPT_SELECT).toContain("action_id:metadata->>actionId");
  });
});
