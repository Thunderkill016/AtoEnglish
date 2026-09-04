import { describe, expect, it } from "vitest";

import { certifyCoreEvidence } from "./certified-evidence";
import type { CoreObservation } from "./observation";
import { estimateThetaEap } from "./psychometrics";
import type { CoreTaskSpec } from "./task";

describe("pure core reference flow", () => {
  it("moves only an in-scope calibrated observation into certified evidence and measurement", () => {
    const task: CoreTaskSpec = {
      id: "task-minimal-pair-1",
      version: 1,
      targetIds: ["listen-ih-vs-iy"],
      activity: "listening-reception",
      responseModality: "choice",
      allowedEvidenceRoles: ["receptive-discrimination"],
      support: { level: 0, revealAllowed: false },
      transferDistance: "same-context",
      contextTags: ["minimal-pair", "mobile"],
      timeConstraintMs: 3000,
      scoringContractId: "binary-discrimination-v1",
      sources: [],
    };

    const observation: CoreObservation = {
      observationId: "obs-1",
      targetId: "listen-ih-vs-iy",
      activity: "listening-reception",
      payload: {
        kind: "comprehension",
        taskId: task.id,
        responseCorrect: true,
        responseLatencyMs: 820,
        supportLevel: 0,
        targetedConstructs: ["listen-ih-vs-iy"],
      },
      confidence: 1,
      calibration: {
        validationState: "human-validated",
        decision: "assessment",
        benchmarkId: "vi-adult-minpair-v1",
        modelFingerprint: "deterministic-choice@v1",
        scope: {
          activity: "listening-reception",
          construct: "listen-ih-vs-iy",
          requiredPopulationTags: ["l1-vi", "adult"],
        },
        metrics: {
          sampleSize: 300,
          precision: 0.99,
          precisionLowerBound: 0.97,
          recall: 0.99,
        },
      },
      authority: "assessment-candidate",
      provenance: {
        evaluator: "binary-answer-key",
        evaluatorKind: "deterministic",
      },
      context: {
        populationTags: ["l1-vi", "adult", "a1"],
        construct: "listen-ih-vs-iy",
      },
      contextId: "minimal-pair-set-a",
      createdAt: "2026-09-04T00:00:00.000Z",
    };

    const certified = certifyCoreEvidence(task, observation, {
      eventId: "ev-1",
      taskId: task.id,
      targetId: "listen-ih-vs-iy",
      role: "receptive-discrimination",
      observationId: observation.observationId,
      outcome: { kind: "binary", success: true },
      evaluatorConfidence: 1,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 820,
        responseModality: "choice",
        contextId: "minimal-pair-set-a",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    });

    expect(certified.ok).toBe(true);
    if (!certified.ok) return;

    const theta = estimateThetaEap([
      {
        item: { id: task.id, difficulty: 0.4, discrimination: 1.1 },
        correct: certified.evidence.outcome.kind === "binary" && certified.evidence.outcome.success,
      },
    ]);

    expect(theta.responseCount).toBe(1);
    expect(theta.theta).toBeGreaterThan(0);
  });

  it("fails closed before evidence when calibration population does not match", () => {
    const task: CoreTaskSpec = {
      id: "task-1",
      version: 1,
      targetIds: ["target-1"],
      activity: "reading-reception",
      responseModality: "choice",
      allowedEvidenceRoles: ["meaning-recognition"],
      support: { level: 0, revealAllowed: false },
      transferDistance: "same-context",
      contextTags: [],
      timeConstraintMs: null,
      scoringContractId: "binary-v1",
      sources: [],
    };

    const observation: CoreObservation = {
      observationId: "obs-2",
      targetId: "target-1",
      activity: "reading-reception",
      payload: {
        kind: "comprehension",
        taskId: "task-1",
        responseCorrect: true,
        responseLatencyMs: null,
        supportLevel: 0,
        targetedConstructs: ["target-1"],
      },
      confidence: 1,
      calibration: {
        validationState: "benchmarked",
        decision: "assessment",
        benchmarkId: "bench-1",
        modelFingerprint: "deterministic@v1",
        scope: {
          activity: "reading-reception",
          construct: "target-1",
          requiredPopulationTags: ["l1-vi"],
        },
        metrics: { sampleSize: 100 },
      },
      authority: "assessment-candidate",
      provenance: { evaluator: "test", evaluatorKind: "deterministic" },
      context: {
        populationTags: ["l1-ja"],
        construct: "target-1",
      },
      contextId: "ctx",
      createdAt: "2026-09-04T00:00:00.000Z",
    };

    const result = certifyCoreEvidence(task, observation, {
      eventId: "ev-2",
      taskId: "task-1",
      targetId: "target-1",
      role: "meaning-recognition",
      observationId: "obs-2",
      outcome: { kind: "binary", success: true },
      evaluatorConfidence: 1,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: null,
        responseModality: "choice",
        contextId: "ctx",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    });

    expect(result).toMatchObject({
      ok: false,
      problems: expect.arrayContaining([{ type: "observation-not-authoritative" }]),
    });
  });
});
