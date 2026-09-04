import { describe, expect, it } from "vitest";
import { buildEnglishOntologyV1 } from "./ontology-seed";
import {
  LEARNER_STATE_CONTRACT_ID,
  LEARNER_STATE_CONTRACT_VERSION,
  createEmptyConstructProjection,
  createEmptyConstructStatistics,
  createEmptyLearnerStateProjection,
  validateAcceptedEvidenceRecord,
  projectConstruct,
  projectLearnerState,
  reduceLearnerState,
  computeReferenceBktBaseline,
  adaptLearnerStateToLegacyRead,
  type AcceptedEvidenceRecord,
} from "./learner-state";
import { readConstructFromLearnerState } from "@/lib/learning/learner-state-read";

const buildResult = buildEnglishOntologyV1();
if (!buildResult.ok) {
  throw new Error("Failed to build English ontology V1: " + JSON.stringify(buildResult.problems));
}
const ontology = buildResult.graph;

function makeValidReferenceRecord(overrides: Partial<AcceptedEvidenceRecord> = {}): AcceptedEvidenceRecord {
  return {
    eventId: "evt-001",
    targetId: "nep.en.v1.communication-activity.spoken-production",
    role: "controlled-production",
    activity: "spoken-production",
    responseModality: "speech",
    transferDistance: "same-context",
    contextId: "ctx-unit-1",
    supportLevel: 0,
    revealUsed: false,
    outcome: { kind: "binary", success: true },
    occurredAt: "2026-09-04T12:00:00.000Z",
    authorityScope: "repository-reference",
    provenance: {
      observationId: "obs-001",
      taskId: "task-001",
      calibrationBenchmarkId: null,
      modelFingerprint: "donor-pybkt-v1.4.3",
    },
    ...overrides,
  };
}

function makeValidDurableRecord(overrides: Partial<AcceptedEvidenceRecord> = {}): AcceptedEvidenceRecord {
  return makeValidReferenceRecord({
    authorityScope: "durable-assessment",
    provenance: {
      observationId: "obs-durable-001",
      taskId: "task-durable-001",
      calibrationBenchmarkId: "bench-core-pronunciation-v1",
      modelFingerprint: "openpronounce-acoustic-v1.2",
    },
    ...overrides,
  });
}

describe("Core Learner Model V1: Contract & Entity Basics", () => {
  it("exports stable contract constants", () => {
    expect(LEARNER_STATE_CONTRACT_ID).toBe("nep.learner-evidence-state.v1");
    expect(LEARNER_STATE_CONTRACT_VERSION).toBe(1);
  });

  it("creates empty construct statistics with zero counts and frozen structures", () => {
    const stats = createEmptyConstructStatistics();
    expect(stats.totalEvents).toBe(0);
    expect(stats.positiveCount).toBe(0);
    expect(stats.negativeCount).toBe(0);
    expect(stats.conflictedCount).toBe(0);
    expect(stats.firstObservedAt).toBeNull();
    expect(stats.lastObservedAt).toBeNull();
    expect(stats.supportDistribution.level0).toBe(0);
    expect(stats.revealUsedCount).toBe(0);
    expect(stats.durableEvidenceCount).toBe(0);
    expect(stats.referenceEvidenceCount).toBe(0);
    expect(Object.isFrozen(stats)).toBe(true);
    expect(Object.isFrozen(stats.byRole)).toBe(true);
    expect(Object.isFrozen(stats.transfer)).toBe(true);
  });

  it("creates empty construct projection with maximal uncertainty and null score", () => {
    const proj = createEmptyConstructProjection("nep.en.v1.communication-activity.spoken-production");
    expect(proj.constructKey.ontologyNodeId).toBe("nep.en.v1.communication-activity.spoken-production");
    expect(proj.constructKey.contractVersion).toBe(1);
    expect(proj.status).toBe("unknown");
    expect(proj.provisionalRoutingScore).toBeNull();
    expect(proj.uncertainty).toBe("maximal");
    expect(proj.decisionScope).toBe("routing-only");
    expect((proj as Record<string, unknown>).mastered).toBeUndefined();
  });

  it("creates empty learner state projection with empty or populated ontology nodes", () => {
    const emptyState = createEmptyLearnerStateProjection();
    expect(emptyState.contractId).toBe(LEARNER_STATE_CONTRACT_ID);
    expect(emptyState.totalEventsProcessed).toBe(0);
    expect(Object.keys(emptyState.constructs)).toHaveLength(0);

    const populatedState = createEmptyLearnerStateProjection(ontology, { populateAllOntologyNodes: true });
    expect(Object.keys(populatedState.constructs)).toHaveLength(ontology.nodes.length);
    expect(populatedState.constructs["nep.en.v1.communication-activity.spoken-production"]).toBeDefined();
    expect(populatedState.constructs["nep.en.v1.communication-activity.spoken-production"].status).toBe("unknown");
  });
});

describe("P1: Real Certified & Reference Evidence Acceptance Boundary", () => {
  it("accepts authentic durable assessment evidence with non-empty benchmark and fingerprint", () => {
    const record = makeValidDurableRecord({ eventId: "evt-durable-valid" });
    const validation = validateAcceptedEvidenceRecord(record, ontology);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.record.authorityScope).toBe("durable-assessment");
      expect(validation.record.provenance.calibrationBenchmarkId).toBe("bench-core-pronunciation-v1");
      expect(validation.record.provenance.modelFingerprint).toBe("openpronounce-acoustic-v1.2");
    }
  });

  it("accepts authentic repository reference evidence with null benchmark and non-empty fingerprint", () => {
    const record = makeValidReferenceRecord({ eventId: "evt-ref-valid" });
    const validation = validateAcceptedEvidenceRecord(record, ontology);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.record.authorityScope).toBe("repository-reference");
      expect(validation.record.provenance.calibrationBenchmarkId).toBeNull();
    }
  });

  it("fails closed on durable assessment evidence with null or missing calibrationBenchmarkId", () => {
    const forgedDurable = makeValidReferenceRecord({
      eventId: "evt-forged-durable-1",
      authorityScope: "durable-assessment",
      provenance: {
        observationId: "obs-01",
        taskId: "task-01",
        calibrationBenchmarkId: null,
        modelFingerprint: "fingerprint-1",
      },
    });

    const validation = validateAcceptedEvidenceRecord(forgedDurable, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unvalidated-evidence-rejected");
      expect(validation.audit.message).toMatch(/calibrationBenchmarkId/);
    }
  });

  it("fails closed on repository reference evidence asserting a calibrationBenchmarkId", () => {
    const forgedReference = makeValidReferenceRecord({
      eventId: "evt-forged-ref-1",
      authorityScope: "repository-reference",
      provenance: {
        observationId: "obs-01",
        taskId: "task-01",
        calibrationBenchmarkId: "bench-fake-id",
        modelFingerprint: "fingerprint-1",
      },
    });

    const validation = validateAcceptedEvidenceRecord(forgedReference, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unvalidated-evidence-rejected");
      expect(validation.audit.message).toMatch(/cannot declare a calibrationBenchmarkId/);
    }
  });

  it("fails closed when modelFingerprint is missing, empty, or 'unknown'", () => {
    const badFingerprints = ["", "   ", "unknown", "UNKNOWN"];
    for (const fp of badFingerprints) {
      const bad = makeValidReferenceRecord({
        eventId: `evt-fp-${fp}`,
        provenance: {
          observationId: "obs-01",
          taskId: "task-01",
          calibrationBenchmarkId: null,
          modelFingerprint: fp,
        },
      });
      const validation = validateAcceptedEvidenceRecord(bad, ontology);
      expect(validation.ok).toBe(false);
      if (!validation.ok) {
        expect(validation.audit.code).toBe("unvalidated-evidence-rejected");
      }
    }
  });

  it("fails closed on raw uncertified observations passing calibration envelope directly", () => {
    const rawObservation = {
      observationId: "obs-raw-001",
      calibration: {
        benchmarkId: "bench-1",
        decision: "shadow",
        modelFingerprint: "model-1",
        validationState: "unvalidated",
      },
      channel: "microphone",
    };

    const validation = validateAcceptedEvidenceRecord(rawObservation, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unvalidated-evidence-rejected");
      expect(validation.audit.message).toMatch(/Raw observation cannot update learner state/);
    }
  });

  it("fails closed on self-asserted invalid authorityScope", () => {
    const selfAsserted = {
      ...makeValidReferenceRecord({ eventId: "evt-self-auth" }),
      authorityScope: "self-certified-root",
    };
    const validation = validateAcceptedEvidenceRecord(selfAsserted, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unvalidated-evidence-rejected");
    }
  });
});

describe("P1: Replay-Safe Incremental Reduction & Duplicate Idempotency", () => {
  it("detects and rejects duplicates of ALREADY-ACCEPTED events in reduceLearnerState", () => {
    const event1 = makeValidReferenceRecord({
      eventId: "evt-dup-target",
      occurredAt: "2026-09-04T10:00:00.000Z",
    });

    let state = createEmptyLearnerStateProjection();
    state = reduceLearnerState(state, event1, ontology);
    expect(state.totalEventsProcessed).toBe(1);
    expect(state.acceptedEvents).toHaveLength(1);
    expect(state.rejectedEvents).toHaveLength(0);

    const reducedAgain = reduceLearnerState(state, event1, ontology);
    expect(reducedAgain.totalEventsProcessed).toBe(2);
    expect(reducedAgain.acceptedEvents).toHaveLength(1);
    expect(reducedAgain.rejectedEvents).toHaveLength(1);
    expect(reducedAgain.rejectedEvents[0].code).toBe("duplicate-event-id");
    expect(reducedAgain.constructs["nep.en.v1.communication-activity.spoken-production"].statistics.totalEvents).toBe(1);
  });

  it("guarantees incremental reduction matches batch projection byte-for-byte even under reverse arrival order", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-seq-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-seq-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidReferenceRecord({ eventId: "evt-seq-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
    ];

    const batchState = projectLearnerState(ontology, events);

    let incrementalReverse = createEmptyLearnerStateProjection();
    for (const ev of [...events].reverse()) {
      incrementalReverse = reduceLearnerState(incrementalReverse, ev, ontology);
    }

    expect(JSON.stringify(incrementalReverse)).toBe(JSON.stringify(batchState));
  });

  it("handles duplicate conflicting records with equal (occurredAt, eventId) deterministically", () => {
    const eventA = makeValidReferenceRecord({
      eventId: "evt-collision",
      occurredAt: "2026-09-04T10:00:00.000Z",
      outcome: { kind: "binary", success: true },
    });
    const eventB = makeValidReferenceRecord({
      eventId: "evt-collision",
      occurredAt: "2026-09-04T10:00:00.000Z",
      outcome: { kind: "binary", success: false },
    });

    const state1 = projectLearnerState(ontology, [eventA, eventB]);
    const state2 = projectLearnerState(ontology, [eventB, eventA]);

    expect(JSON.stringify(state1)).toBe(JSON.stringify(state2));
  });
});

describe("P1: Transfer Semantics & Epistemic Boundaries", () => {
  it("does NOT grant transfer support to a first-ever event labeled near-transfer without prior context", () => {
    const firstEvent = makeValidReferenceRecord({
      eventId: "evt-first-transfer",
      role: "near-transfer",
      transferDistance: "near-transfer",
      contextId: "ctx-first",
      outcome: { kind: "binary", success: true },
    });

    const state = projectLearnerState(ontology, [firstEvent]);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.statistics.transfer.nearTransferCount).toBe(0);
    expect(construct.statistics.transfer.sameContextCount).toBe(1);
  });

  it("rejects receptive or non-transfer roles claiming near/far transfer distance", () => {
    const receptiveTransfer = makeValidReferenceRecord({
      eventId: "evt-receptive-transfer",
      targetId: "nep.en.v1.communication-activity.listening-reception",
      activity: "listening-reception",
      role: "receptive-discrimination",
      responseModality: "choice",
      transferDistance: "near-transfer",
      contextId: "ctx-2",
    });

    const validation = validateAcceptedEvidenceRecord(receptiveTransfer, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("incompatible-evidence-role");
    }
  });

  it("rejects ordinary controlled-production claiming near-transfer distance without transfer role", () => {
    const controlledNear = makeValidReferenceRecord({
      eventId: "evt-ctrl-near",
      role: "controlled-production",
      transferDistance: "near-transfer",
      contextId: "ctx-2",
    });

    const validation = validateAcceptedEvidenceRecord(controlledNear, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("incompatible-evidence-role");
    }
  });

  it("records failed near-transfer as nearTransferFailedCount, NOT as sameContextCount", () => {
    const events = [
      makeValidReferenceRecord({
        eventId: "evt-base-1",
        occurredAt: "2026-09-04T10:00:00.000Z",
        contextId: "ctx-1",
        transferDistance: "same-context",
        role: "controlled-production",
      }),
      makeValidReferenceRecord({
        eventId: "evt-fail-transfer",
        occurredAt: "2026-09-04T10:01:00.000Z",
        contextId: "ctx-2",
        transferDistance: "near-transfer",
        role: "near-transfer",
        outcome: { kind: "binary", success: false },
      }),
    ];

    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.statistics.transfer.sameContextCount).toBe(1);
    expect(construct.statistics.transfer.nearTransferCount).toBe(0);
    expect(construct.statistics.transfer.nearTransferFailedCount).toBe(1);
  });

  it("increments nearTransferCount on success with verified prior distinct context", () => {
    const events = [
      makeValidReferenceRecord({
        eventId: "evt-base",
        occurredAt: "2026-09-04T10:00:00.000Z",
        contextId: "ctx-1",
        transferDistance: "same-context",
        role: "controlled-production",
      }),
      makeValidReferenceRecord({
        eventId: "evt-success-transfer",
        occurredAt: "2026-09-04T10:01:00.000Z",
        contextId: "ctx-2",
        transferDistance: "near-transfer",
        role: "near-transfer",
        outcome: { kind: "binary", success: true },
      }),
    ];

    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.statistics.transfer.sameContextCount).toBe(1);
    expect(construct.statistics.transfer.nearTransferCount).toBe(1);
    expect(construct.statistics.transfer.nearTransferFailedCount).toBe(0);
  });
});

describe("P1: Activity Compatibility, Lineage Metadata & Legacy Adapter", () => {
  it("enforces activity compatibility between event and communication-activity target node", () => {
    const mismatchedActivity = makeValidReferenceRecord({
      eventId: "evt-act-mismatch",
      targetId: "nep.en.v1.communication-activity.spoken-production",
      activity: "listening-reception",
    });

    const validation = validateAcceptedEvidenceRecord(mismatchedActivity, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("incompatible-activity");
      expect(validation.audit.message).toMatch(/does not match target node communication activity/);
    }
  });

  it("preserves accepted event lineage, support distribution, and reveal tracking in projection", () => {
    const events = [
      makeValidReferenceRecord({
        eventId: "evt-audit-1",
        occurredAt: "2026-09-04T10:00:00.000Z",
        supportLevel: 0,
        revealUsed: false,
      }),
      makeValidDurableRecord({
        eventId: "evt-audit-2",
        occurredAt: "2026-09-04T10:01:00.000Z",
        supportLevel: 2,
        revealUsed: true,
      }),
    ];

    const state = projectLearnerState(ontology, events);
    expect(state.acceptedEvents).toHaveLength(2);
    expect(state.acceptedEvents[0].eventId).toBe("evt-audit-1");
    expect(state.acceptedEvents[0].authorityScope).toBe("repository-reference");
    expect(state.acceptedEvents[1].eventId).toBe("evt-audit-2");
    expect(state.acceptedEvents[1].authorityScope).toBe("durable-assessment");

    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];
    expect(construct.statistics.supportDistribution.level0).toBe(1);
    expect(construct.statistics.supportDistribution.level2Plus).toBe(1);
    expect(construct.statistics.revealUsedCount).toBe(1);
    expect(construct.statistics.durableEvidenceCount).toBe(1);
    expect(construct.statistics.referenceEvidenceCount).toBe(1);
  });

  it("adapts V1 state projection to legacy read format without turning unknown into zero or mastery", () => {
    const emptyState = createEmptyLearnerStateProjection();
    const unknownRead = readConstructFromLearnerState(
      emptyState,
      "nep.en.v1.communication-activity.spoken-production"
    );

    expect(unknownRead.status).toBe("unknown");
    expect(unknownRead.estimate).toBeNull();
    expect(unknownRead.evidenceCount).toBe(0);
    expect(unknownRead.decisionScope).toBe("routing");

    const events = [
      makeValidReferenceRecord({ eventId: "evt-leg-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidReferenceRecord({ eventId: "evt-leg-2", occurredAt: "2026-09-04T10:01:00.000Z" }),
    ];
    const observedState = projectLearnerState(ontology, events);
    const observedRead = readConstructFromLearnerState(
      observedState,
      "nep.en.v1.communication-activity.spoken-production"
    );

    expect(observedRead.status).toBe("observed");
    expect(observedRead.estimate).toBe(1);
    expect(observedRead.evidenceCount).toBe(2);
    expect(observedRead.decisionScope).toBe("routing");
  });
});

describe("User Story 1: Depend on Ontology-Bound Construct Evidence", () => {
  it("rejects arbitrary unvalidated string target with unknown-ontology-node", () => {
    const raw = makeValidReferenceRecord({
      eventId: "evt-fake-01",
      targetId: "random-vocab-123",
    });

    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unknown-ontology-node");
    }

    const state = projectLearnerState(ontology, [raw]);
    expect(state.totalEventsProcessed).toBe(1);
    expect(state.rejectedEvents).toHaveLength(1);
    expect(state.rejectedEvents[0].code).toBe("unknown-ontology-node");
    expect(Object.keys(state.constructs)).toHaveLength(0);
  });

  it("rejects non-existent node matching regex format with unknown-ontology-node", () => {
    const raw = makeValidReferenceRecord({
      eventId: "evt-nonexistent-01",
      targetId: "nep.en.v1.language-system.nonexistent-node",
    });

    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("unknown-ontology-node");
    }
  });
});

describe("User Story 2: Represent Uncertainty and Distinguish Unknown from Failure", () => {
  it("evaluates 0 events to status unknown, null score, and maximal uncertainty", () => {
    const stats = createEmptyConstructStatistics();
    const proj = projectConstruct("nep.en.v1.communication-activity.spoken-production", stats);

    expect(proj.status).toBe("unknown");
    expect(proj.provisionalRoutingScore).toBeNull();
    expect(proj.uncertainty).toBe("maximal");
    expect(proj.statistics.totalEvents).toBe(0);
  });

  it("evaluates 1 event to insufficient-support, null score, and high uncertainty", () => {
    const event = makeValidReferenceRecord({ eventId: "evt-single" });
    const state = projectLearnerState(ontology, [event]);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("insufficient-support");
    expect(construct.provisionalRoutingScore).toBeNull();
    expect(construct.uncertainty).toBe("high");
    expect(construct.statistics.totalEvents).toBe(1);
    expect(construct.statistics.positiveCount).toBe(1);
  });

  it("evaluates 2 consistent positive events to provisional-support with moderate uncertainty", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-pos-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidReferenceRecord({ eventId: "evt-pos-2", occurredAt: "2026-09-04T10:01:00.000Z" }),
    ];
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("provisional-support");
    expect(construct.provisionalRoutingScore).toBe(1);
    expect(construct.uncertainty).toBe("moderate");
    expect(construct.statistics.positiveCount).toBe(2);
  });

  it("evaluates 5 consistent positive events to provisional-support with low uncertainty", () => {
    const events = [1, 2, 3, 4, 5].map((i) =>
      makeValidReferenceRecord({ eventId: `evt-pos-${i}`, occurredAt: `2026-09-04T10:0${i}:00.000Z` })
    );
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("provisional-support");
    expect(construct.provisionalRoutingScore).toBe(1);
    expect(construct.uncertainty).toBe("low");
  });

  it("evaluates 2 consistent negative events to provisional-weakness with score 0", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-neg-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidReferenceRecord({ eventId: "evt-neg-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
    ];
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("provisional-weakness");
    expect(construct.provisionalRoutingScore).toBe(0);
    expect(construct.uncertainty).toBe("moderate");
    expect(construct.statistics.negativeCount).toBe(2);
  });

  it("evaluates mixed positive and negative events to conflicted-support with suppressed score", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-mix-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-mix-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidReferenceRecord({ eventId: "evt-mix-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-mix-4", occurredAt: "2026-09-04T10:03:00.000Z", outcome: { kind: "binary", success: false } }),
    ];
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("conflicted-support");
    expect(construct.provisionalRoutingScore).toBeNull();
    expect(construct.uncertainty).toBe("high");
    expect(construct.statistics.conflictedCount).toBe(2);
  });
});

describe("Epistemic & Adversarial Invariants", () => {
  it("rejects raw non-object or null attempts with unvalidated-evidence-rejected", () => {
    expect(validateAcceptedEvidenceRecord(null, ontology).ok).toBe(false);
    expect(validateAcceptedEvidenceRecord("not-an-object", ontology).ok).toBe(false);
    expect(validateAcceptedEvidenceRecord([1, 2, 3], ontology).ok).toBe(false);
  });

  it("rejects empty or missing eventId with invalid-event-id", () => {
    const raw = makeValidReferenceRecord({ eventId: "   " });
    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("invalid-event-id");
    }
  });

  it("rejects hostile injection of forbidden authority and mastery fields", () => {
    const forbiddenKeys = [
      "mastery",
      "mastered",
      "theta",
      "cefrLevel",
      "calibrationGrant",
      "authority",
      "promotion",
      "certified",
      "validationState",
      "durableAuthority",
      "canAffectDurableAssessment",
      "canBecomeMasteryCandidate",
    ];

    for (const key of forbiddenKeys) {
      const hostileRaw = {
        ...makeValidReferenceRecord({ eventId: `evt-hostile-${key}` }),
        [key]: true,
      };
      const validation = validateAcceptedEvidenceRecord(hostileRaw, ontology);
      expect(validation.ok).toBe(false);
      if (!validation.ok) {
        expect(validation.audit.code).toBe("forbidden-authority-field");
      }
    }
  });

  it("rejects hostile injection of forbidden fields inside nested attempt object", () => {
    const hostileNested = {
      ...makeValidReferenceRecord({ eventId: "evt-nested-hostile" }),
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 1200,
        responseModality: "speech",
        contextId: "ctx-1",
        mastery: 0.99,
      },
    };
    const validation = validateAcceptedEvidenceRecord(hostileNested, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("forbidden-authority-field");
    }
  });

  it("rejects invalid non-ISO timestamps with invalid-timestamp", () => {
    const raw = makeValidReferenceRecord({ eventId: "evt-bad-time", occurredAt: "yesterday afternoon" });
    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("invalid-timestamp");
    }
  });

  it("rejects timestamps from the future relative to evaluationTimestamp", () => {
    const raw = makeValidReferenceRecord({
      eventId: "evt-future",
      occurredAt: "2026-09-05T12:00:00.000Z",
    });
    const validation = validateAcceptedEvidenceRecord(raw, ontology, "2026-09-04T12:00:00.000Z");
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("invalid-timestamp");
    }
  });

  it("detects and rejects duplicate event IDs within ledger batch", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-dup-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidReferenceRecord({ eventId: "evt-dup-1", occurredAt: "2026-09-04T10:01:00.000Z" }),
    ];

    const state = projectLearnerState(ontology, events);
    expect(state.totalEventsProcessed).toBe(2);
    expect(state.rejectedEvents).toHaveLength(1);
    expect(state.rejectedEvents[0].code).toBe("duplicate-event-id");
    expect(state.constructs["nep.en.v1.communication-activity.spoken-production"].statistics.totalEvents).toBe(1);
  });
});

describe("User Story 4: Deterministic Replay and Incremental Reducer Equivalence", () => {
  it("guarantees byte-identical JSON projection under arbitrary event array shuffling", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-order-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-order-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidReferenceRecord({ eventId: "evt-order-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-order-4", occurredAt: "2026-09-04T10:03:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidReferenceRecord({ eventId: "evt-order-5", occurredAt: "2026-09-04T10:04:00.000Z", outcome: { kind: "binary", success: false } }),
    ];

    const state1 = projectLearnerState(ontology, events);
    const state2 = projectLearnerState(ontology, [...events].reverse());
    const state3 = projectLearnerState(ontology, [events[2], events[0], events[4], events[1], events[3]]);

    const json1 = JSON.stringify(state1);
    const json2 = JSON.stringify(state2);
    const json3 = JSON.stringify(state3);

    expect(json1).toBe(json2);
    expect(json1).toBe(json3);
  });
});

describe("User Story 5: Scoped Authority & No Boolean Mastery", () => {
  it("ensures all construct projections declare routing-only and contain no boolean mastered field", () => {
    const events = [
      makeValidReferenceRecord({ eventId: "evt-m-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidReferenceRecord({ eventId: "evt-m-2", occurredAt: "2026-09-04T10:01:00.000Z" }),
      makeValidReferenceRecord({ eventId: "evt-m-3", occurredAt: "2026-09-04T10:02:00.000Z" }),
    ];

    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.decisionScope).toBe("routing-only");
    expect((construct as Record<string, unknown>).mastered).toBeUndefined();
    expect((construct as Record<string, unknown>).theta).toBeUndefined();
    expect((construct as Record<string, unknown>).cefrLevel).toBeUndefined();
  });
});

describe("Comparative pyBKT Baseline Donor (CAHLR/pyBKT MIT Tag 1.4.3)", () => {
  it("computes reference BKT belief progression and exposes explicit psychometric limitations", () => {
    const baseline = computeReferenceBktBaseline([true, true, true]);

    expect(baseline.modelDonor).toBe("CAHLR/pyBKT");
    expect(baseline.donorVersion).toBe("1.4.3");
    expect(baseline.donorCommit).toBe("06fc180ae72c117458acc527f8ec90cc8e0581c1");
    expect(baseline.license).toBe("MIT");
    expect(baseline.role).toBe("reference-baseline-donor");
    expect(baseline.historySteps).toHaveLength(4);
    expect(baseline.historySteps[0]).toBe(0.1);
    expect(baseline.finalPKnown).toBeGreaterThan(0.7);
    expect(baseline.limitations.length).toBeGreaterThanOrEqual(4);

    const zeroHistoryBkt = computeReferenceBktBaseline([]);
    expect(zeroHistoryBkt.finalPKnown).toBe(0.1);

    const nepZeroStats = createEmptyConstructStatistics();
    const nepZeroProj = projectConstruct("nep.en.v1.communication-activity.spoken-production", nepZeroStats);
    expect(nepZeroProj.status).toBe("unknown");
    expect(nepZeroProj.provisionalRoutingScore).toBeNull();
  });
});
