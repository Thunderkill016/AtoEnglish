import { describe, expect, it } from "vitest";

import {
  ERROR_MEMORY_ATTEMPT_SELECT,
  actionableErrorTags,
  buildErrorMemory,
  remediationCandidateIdsForTag,
  type ErrorMemoryAttemptRow,
} from "@/lib/learning/error-memory";

function row(overrides: Partial<ErrorMemoryAttemptRow> = {}): ErrorMemoryAttemptRow {
  return {
    capability_id: "CAP-002",
    knowledge_item_id: null,
    correct: false,
    response_modality: "speech",
    support_level: 0,
    reveal_used: false,
    lesson_id: "nep-first-meeting-v1",
    lesson_version: "1.0.0",
    action_id: "transfer",
    action_kind: "transfer",
    observed_response: true,
    error_tags: ["partial-target-coverage", "missing-target-group:1"],
    remediation_hints: [{
      errorTag: "missing-target-group:1",
      candidateId: "nep-first-meeting-v1:produce",
    }],
    created_at: "2026-09-02T10:00:00.000Z",
    ...overrides,
  };
}

describe("Error Memory V1", () => {
  it("keeps one independent failure as an observation, not a recurring learner pattern", () => {
    const memory = buildErrorMemory([row()]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      errorTag: "missing-target-group:1",
      remediationCandidateIds: ["nep-first-meeting-v1:produce"],
      remediationSatisfiedAt: null,
      status: "observed",
      independentFailureCount: 1,
      independentFailuresSinceRepair: 1,
    });
  });

  it("promotes the same actionable error only after a second independent failure", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(1);
    expect(memory.recurring[0]).toMatchObject({
      errorTag: "missing-target-group:1",
      status: "recurring",
      independentFailureCount: 2,
      independentFailuresSinceRepair: 2,
    });
  });

  it("does not let supported failures manufacture recurrence", () => {
    const memory = buildErrorMemory([
      row({ support_level: 1, created_at: "2026-09-02T10:00:00.000Z" }),
      row({ support_level: 1, created_at: "2026-09-02T11:00:00.000Z" }),
      row({ support_level: 0, created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      status: "observed",
      independentFailureCount: 1,
      supportedFailureCount: 2,
    });
  });

  it("does not let a failure after answer reveal manufacture recurrence", () => {
    const memory = buildErrorMemory([
      row({ reveal_used: true, created_at: "2026-09-02T10:00:00.000Z" }),
      row({ reveal_used: true, created_at: "2026-09-02T11:00:00.000Z" }),
      row({ reveal_used: false, created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      status: "observed",
      independentFailureCount: 1,
      supportedFailureCount: 2,
    });
  });

  it("does not let typed fallback manufacture recurring speaking errors", () => {
    const memory = buildErrorMemory([
      row({ response_modality: "text", created_at: "2026-09-02T10:00:00.000Z" }),
      row({ response_modality: "text", created_at: "2026-09-02T11:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      status: "supported-only",
      independentFailureCount: 0,
      supportedFailureCount: 2,
    });
  });

  it("does not let typed fallback success repair a recurring speaking error", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({
        correct: true,
        response_modality: "text",
        error_tags: [],
        remediation_hints: [],
        created_at: "2026-09-02T12:00:00.000Z",
      }),
    ]);

    expect(memory.recurring).toHaveLength(1);
    expect(memory.recurring[0]).toMatchObject({ repairedAt: null, remediationSatisfiedAt: null });
  });

  it("ignores no-response and broad partial-coverage tags as persistent error patterns", () => {
    const memory = buildErrorMemory([
      row({ observed_response: false, error_tags: ["no-response", "missing-target-group:1"] }),
      row({ error_tags: ["partial-target-coverage"] }),
    ]);

    expect(memory.entries).toEqual([]);
    expect(actionableErrorTags(["no-response", "partial-target-coverage", "incorrect-choice"])).toEqual([
      "incorrect-choice",
    ]);
  });

  it("keeps only remediation hints that belong to the exact actionable error tag", () => {
    const hints = [
      { errorTag: "missing-target-group:1", candidateId: "lesson:produce" },
      { errorTag: "missing-target-group:0", candidateId: "lesson:repair" },
      { errorTag: "missing-target-group:1", candidateId: "lesson:produce" },
      { errorTag: "missing-target-group:1", candidateId: "" },
      { bad: true },
    ];

    expect(remediationCandidateIdsForTag(hints, "missing-target-group:1")).toEqual(["lesson:produce"]);
  });

  it("merges remediation candidate hints across compatible historical rows", () => {
    const memory = buildErrorMemory([
      row({ remediation_hints: [], created_at: "2026-09-02T10:00:00.000Z" }),
      row({
        remediation_hints: [{
          errorTag: "missing-target-group:1",
          candidateId: "nep-first-meeting-v1:produce",
        }],
        created_at: "2026-09-02T11:00:00.000Z",
      }),
    ]);

    expect(memory.recurring[0]?.remediationCandidateIds).toEqual(["nep-first-meeting-v1:produce"]);
  });

  it("marks a recurring error repaired after a later independent success on the same action", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], remediation_hints: [], created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.repaired[0]).toMatchObject({
      status: "repaired",
      independentFailureCount: 2,
      independentFailuresSinceRepair: 0,
      repairedAt: "2026-09-02T12:00:00.000Z",
      remediationSatisfiedAt: null,
    });
  });

  it("marks explicit remediation satisfied without pretending the source error is repaired", () => {
    const repairHint = [{
      errorTag: "missing-target-group:0",
      candidateId: "nep-first-meeting-v1:repair",
    }];
    const sourceFailure = {
      error_tags: ["missing-target-group:0"],
      remediation_hints: repairHint,
    };
    const memory = buildErrorMemory([
      row({ ...sourceFailure, created_at: "2026-09-02T10:00:00.000Z" }),
      row({ ...sourceFailure, created_at: "2026-09-02T11:00:00.000Z" }),
      row({
        capability_id: "CAP-003",
        correct: true,
        action_id: "repair",
        action_kind: "repair",
        error_tags: [],
        remediation_hints: [],
        created_at: "2026-09-02T12:00:00.000Z",
      }),
    ]);

    expect(memory.recurring).toHaveLength(1);
    expect(memory.recurring[0]).toMatchObject({
      actionId: "transfer",
      status: "recurring",
      repairedAt: null,
      remediationSatisfiedAt: "2026-09-02T12:00:00.000Z",
    });
  });

  it("does not satisfy remediation from an assisted remediation success", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({
        correct: true,
        action_id: "produce",
        action_kind: "produce",
        support_level: 1,
        error_tags: [],
        remediation_hints: [],
        created_at: "2026-09-02T12:00:00.000Z",
      }),
    ]);

    expect(memory.recurring[0]?.remediationSatisfiedAt).toBeNull();
  });

  it("reopens remediation after the source re-probe fails independently", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({
        correct: true,
        action_id: "produce",
        action_kind: "produce",
        error_tags: [],
        remediation_hints: [],
        created_at: "2026-09-02T12:00:00.000Z",
      }),
      row({ created_at: "2026-09-02T13:00:00.000Z" }),
    ]);

    expect(memory.recurring[0]).toMatchObject({
      status: "recurring",
      independentFailureCount: 3,
      independentFailuresSinceRepair: 3,
      remediationSatisfiedAt: null,
    });
  });

  it("requires recurrence again after direct source repair instead of making the old pattern permanent", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], remediation_hints: [], created_at: "2026-09-02T12:00:00.000Z" }),
      row({ created_at: "2026-09-02T13:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      status: "observed",
      independentFailureCount: 3,
      independentFailuresSinceRepair: 1,
      repairedAt: null,
      remediationSatisfiedAt: null,
    });
  });

  it("keeps different lesson versions and actions as separate error memories", () => {
    const memory = buildErrorMemory([
      row({ lesson_version: "1.0.0", action_id: "transfer" }),
      row({ lesson_version: "2.0.0", action_id: "transfer", created_at: "2026-09-02T11:00:00.000Z" }),
      row({ lesson_version: "1.0.0", action_id: "repair", action_kind: "repair", created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.entries).toHaveLength(3);
    expect(memory.recurring).toHaveLength(0);
  });

  it("safely handles numeric lesson_version from attempt rows as string identity", () => {
    const memory = buildErrorMemory([
      row({ lesson_version: 1 as unknown as string }),
    ]);

    expect(memory.entries).toHaveLength(1);
    expect(memory.entries[0]?.lessonVersion).toBe("1");
    expect(memory.entries[0]?.key).toContain("|1|");
  });

  it("is deterministic even when rows arrive newest-first", () => {
    const chronological = [
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], remediation_hints: [], created_at: "2026-09-02T12:00:00.000Z" }),
    ];

    expect(buildErrorMemory([...chronological].reverse())).toEqual(buildErrorMemory(chronological));
  });

  it("locks the read projection to derived metadata and observation-eligibility fields", () => {
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("error_tags:metadata->errorSignals->errorTags");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("observed_response:metadata->errorSignals->observedResponse");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("remediation_hints:metadata->errorSignals->remediationHints");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("action_kind:metadata->>actionKind");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("response_modality");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("reveal_used");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).not.toContain("response_text");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).not.toMatch(/(^|,\s*)metadata($|,)/);
  });
});
