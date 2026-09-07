import { describe, expect, it } from "vitest";

import { evaluateSpeakingTask } from "@/lib/lessons/speaking-task-evaluation";
import { getSpeakingInteraction } from "@/lib/lessons/speaking-interactions";

describe("A0 English Life speaking interaction", () => {
  it("authors a changed-context transfer turn without a language hint", () => {
    const interaction = getSpeakingInteraction("unit-a0-1");

    expect(interaction).toBeDefined();
    expect(interaction?.title).toBe("Episode 1 · Meet Alex");
    expect(interaction?.turns.at(-1)).toMatchObject({
      speaker: "Receptionist",
      phase: "transfer",
      hint: undefined,
    });
  });

  it("passes when the learner communicates every authored target", () => {
    const result = evaluateSpeakingTask(
      "unit-a0-1",
      "Hello, my name is Minh. M I N H. I don't understand. Can you say that again, please? I'm from Vietnam. Nice to meet you too."
    );

    expect(result).toMatchObject({
      unitId: "unit-a0-1",
      accomplished: true,
      evidenceKind: "practice-task-feedback",
    });
    expect(result?.metCount).toBe(result?.total);
  });

  it("does not pass when the repair strategy is missing", () => {
    const result = evaluateSpeakingTask(
      "unit-a0-1",
      "Hello, my name is Minh. M I N H. I'm from Vietnam. Nice to meet you too."
    );

    expect(result?.accomplished).toBe(false);
    expect(result?.criteria.find((criterion) => criterion.id === "repair")?.met).toBe(false);
  });

  it("does not invent a rubric for an unauthored unit", () => {
    expect(evaluateSpeakingTask("unit-a0-99", "Hello")).toBeUndefined();
  });
});
