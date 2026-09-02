import { describe, expect, it } from "vitest";

import {
  ERROR_MEMORY_ATTEMPT_SELECT,
  actionableErrorTags,
  buildErrorMemory,
  type ErrorMemoryAttemptRow,
} from "@/lib/learning/error-memory";

function row(overrides: Partial<ErrorMemoryAttemptRow> = {}): ErrorMemoryAttemptRow {
  return {
    capability_id: "CAP-002",
    knowledge_item_id: null,
    correct: false,
    support_level: 0,
    lesson_id: "nep-first-meeting-v1",
    lesson_version: "1.0.0",
    action_id: "transfer",
    observed_response: true,
    error_tags: ["partial-target-coverage", "missing-target-group:1"],
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

  it("marks a recurring error repaired after a later independent success on the same action", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.repaired[0]).toMatchObject({
      status: "repaired",
      independentFailureCount: 2,
      independentFailuresSinceRepair: 0,
      repairedAt: "2026-09-02T12:00:00.000Z",
    });
  });

  it("requires recurrence again after repair instead of making the old pattern permanent", () => {
    const memory = buildErrorMemory([
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], created_at: "2026-09-02T12:00:00.000Z" }),
      row({ created_at: "2026-09-02T13:00:00.000Z" }),
    ]);

    expect(memory.recurring).toHaveLength(0);
    expect(memory.entries[0]).toMatchObject({
      status: "observed",
      independentFailureCount: 3,
      independentFailuresSinceRepair: 1,
      repairedAt: null,
    });
  });

  it("keeps different lesson versions and actions as separate error memories", () => {
    const memory = buildErrorMemory([
      row({ lesson_version: "1.0.0", action_id: "transfer" }),
      row({ lesson_version: "2.0.0", action_id: "transfer", created_at: "2026-09-02T11:00:00.000Z" }),
      row({ lesson_version: "1.0.0", action_id: "repair", created_at: "2026-09-02T12:00:00.000Z" }),
    ]);

    expect(memory.entries).toHaveLength(3);
    expect(memory.recurring).toHaveLength(0);
  });

  it("is deterministic even when rows arrive newest-first", () => {
    const chronological = [
      row({ created_at: "2026-09-02T10:00:00.000Z" }),
      row({ created_at: "2026-09-02T11:00:00.000Z" }),
      row({ correct: true, error_tags: [], created_at: "2026-09-02T12:00:00.000Z" }),
    ];

    expect(buildErrorMemory([...chronological].reverse())).toEqual(buildErrorMemory(chronological));
  });

  it("locks the read projection to derived metadata and excludes raw learner content", () => {
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("error_tags:metadata->errorSignals->errorTags");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).toContain("observed_response:metadata->errorSignals->observedResponse");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).not.toContain("response_text");
    expect(ERROR_MEMORY_ATTEMPT_SELECT).not.toMatch(/(^|,\s*)metadata($|,)/);
  });
});
