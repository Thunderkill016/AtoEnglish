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
  type AcceptedEvidenceRecord,
} from "./learner-state";

const buildResult = buildEnglishOntologyV1();
if (!buildResult.ok) {
  throw new Error("Failed to build English ontology V1: " + JSON.stringify(buildResult.problems));
}
const ontology = buildResult.graph;

function makeValidRecord(overrides: Partial<AcceptedEvidenceRecord> = {}): AcceptedEvidenceRecord {
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

describe("User Story 1: Depend on Ontology-Bound Construct Evidence", () => {
  it("accepts evidence targeting canonical ontology nodes", () => {
    const record = makeValidRecord({
      eventId: "evt-valid-01",
      targetId: "nep.en.v1.communication-activity.spoken-production",
    });

    const validation = validateAcceptedEvidenceRecord(record, ontology);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.record.targetId).toBe("nep.en.v1.communication-activity.spoken-production");
    }

    const state = projectLearnerState(ontology, [record]);
    expect(state.totalEventsProcessed).toBe(1);
    expect(state.rejectedEvents).toHaveLength(0);
    expect(state.constructs["nep.en.v1.communication-activity.spoken-production"]).toBeDefined();
  });

  it("rejects arbitrary unvalidated string target with unknown-ontology-node", () => {
    const raw = makeValidRecord({
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
    const raw = makeValidRecord({
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
    const event = makeValidRecord({ eventId: "evt-single" });
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
      makeValidRecord({ eventId: "evt-pos-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidRecord({ eventId: "evt-pos-2", occurredAt: "2026-09-04T10:01:00.000Z" }),
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
      makeValidRecord({ eventId: `evt-pos-${i}`, occurredAt: `2026-09-04T10:0${i}:00.000Z` })
    );
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("provisional-support");
    expect(construct.provisionalRoutingScore).toBe(1);
    expect(construct.uncertainty).toBe("low");
  });

  it("evaluates 2 consistent negative events to provisional-weakness with score 0", () => {
    const events = [
      makeValidRecord({ eventId: "evt-neg-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidRecord({ eventId: "evt-neg-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
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
      makeValidRecord({ eventId: "evt-mix-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-mix-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidRecord({ eventId: "evt-mix-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-mix-4", occurredAt: "2026-09-04T10:03:00.000Z", outcome: { kind: "binary", success: false } }),
    ];
    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.status).toBe("conflicted-support");
    expect(construct.provisionalRoutingScore).toBeNull(); // Suppressed to prevent misleading neutral average
    expect(construct.uncertainty).toBe("high");
    expect(construct.statistics.conflictedCount).toBe(2);
    expect(construct.statistics.positiveCount).toBe(2);
    expect(construct.statistics.negativeCount).toBe(2);
  });
});

describe("User Story 3: Enforce Role, Modality, and Context-Transfer Boundaries", () => {
  it("tracks role evidence separately and prevents recognition from manufacturing production", () => {
    // node: listening-reception allows receptive-discrimination and meaning-recognition
    const record = makeValidRecord({
      eventId: "evt-rec-1",
      targetId: "nep.en.v1.communication-activity.listening-reception",
      activity: "listening-reception",
      role: "receptive-discrimination",
      responseModality: "choice",
    });

    const state = projectLearnerState(ontology, [record]);
    const construct = state.constructs["nep.en.v1.communication-activity.listening-reception"];

    expect(construct.statistics.byRole["receptive-discrimination"].positive).toBe(1);
    expect(construct.statistics.byRole["free-production"].positive).toBe(0);
    expect(construct.statistics.transfer.nearTransferCount).toBe(0);
  });

  it("prevents same-context production repetition from manufacturing transfer evidence", () => {
    const events = [
      makeValidRecord({ eventId: "evt-sc-1", occurredAt: "2026-09-04T10:00:00.000Z", contextId: "ctx-1", transferDistance: "same-context" }),
      makeValidRecord({ eventId: "evt-sc-2", occurredAt: "2026-09-04T10:01:00.000Z", contextId: "ctx-1", transferDistance: "same-context" }),
      makeValidRecord({ eventId: "evt-sc-3", occurredAt: "2026-09-04T10:02:00.000Z", contextId: "ctx-1", transferDistance: "same-context" }),
    ];

    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.statistics.transfer.sameContextCount).toBe(3);
    expect(construct.statistics.transfer.nearTransferCount).toBe(0);
    expect(construct.statistics.transfer.farTransferCount).toBe(0);
    expect(construct.statistics.distinctContextCount).toBe(1);
  });

  it("increments near-transfer only when distinct context is verified", () => {
    const events = [
      makeValidRecord({ eventId: "evt-tr-1", occurredAt: "2026-09-04T10:00:00.000Z", contextId: "ctx-1", transferDistance: "same-context" }),
      makeValidRecord({ eventId: "evt-tr-2", occurredAt: "2026-09-04T10:01:00.000Z", contextId: "ctx-2", transferDistance: "near-transfer" }),
    ];

    const state = projectLearnerState(ontology, events);
    const construct = state.constructs["nep.en.v1.communication-activity.spoken-production"];

    expect(construct.statistics.transfer.sameContextCount).toBe(1);
    expect(construct.statistics.transfer.nearTransferCount).toBe(1);
    expect(construct.statistics.distinctContextCount).toBe(2);
  });

  it("rejects near-transfer with null contextId fail-closed with invalid-transfer-distance", () => {
    const raw = makeValidRecord({
      eventId: "evt-bad-transfer",
      transferDistance: "near-transfer",
      contextId: null,
    });

    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("invalid-transfer-distance");
    }
  });

  it("rejects incompatible evidence role fail-closed", () => {
    // listening-reception only allows receptive-discrimination and meaning-recognition
    const raw = makeValidRecord({
      eventId: "evt-incompat-role",
      targetId: "nep.en.v1.communication-activity.listening-reception",
      activity: "listening-reception",
      role: "free-production",
      responseModality: "choice",
    });

    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("incompatible-evidence-role");
    }
  });

  it("rejects incompatible response modality fail-closed", () => {
    // reading-reception has text-input modality; speech response is incompatible
    const raw = makeValidRecord({
      eventId: "evt-incompat-mod",
      targetId: "nep.en.v1.communication-activity.reading-reception",
      activity: "reading-reception",
      role: "receptive-discrimination",
      responseModality: "speech",
    });

    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("incompatible-modality");
    }
  });
});

describe("Epistemic & Adversarial Invariants", () => {
  it("rejects raw non-object or null attempts with unvalidated-evidence-rejected", () => {
    expect(validateAcceptedEvidenceRecord(null, ontology).ok).toBe(false);
    expect(validateAcceptedEvidenceRecord("not-an-object", ontology).ok).toBe(false);
    expect(validateAcceptedEvidenceRecord([1, 2, 3], ontology).ok).toBe(false);
  });

  it("rejects empty or missing eventId with invalid-event-id", () => {
    const raw = makeValidRecord({ eventId: "   " });
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
        ...makeValidRecord({ eventId: `evt-hostile-${key}` }),
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
      ...makeValidRecord({ eventId: "evt-nested-hostile" }),
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
    const raw = makeValidRecord({ eventId: "evt-bad-time", occurredAt: "yesterday afternoon" });
    const validation = validateAcceptedEvidenceRecord(raw, ontology);
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.audit.code).toBe("invalid-timestamp");
    }
  });

  it("rejects timestamps from the future relative to evaluationTimestamp", () => {
    const raw = makeValidRecord({
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
      makeValidRecord({ eventId: "evt-dup-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidRecord({ eventId: "evt-dup-1", occurredAt: "2026-09-04T10:01:00.000Z" }),
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
      makeValidRecord({ eventId: "evt-order-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-order-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: false } }),
      makeValidRecord({ eventId: "evt-order-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-order-4", occurredAt: "2026-09-04T10:03:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-order-5", occurredAt: "2026-09-04T10:04:00.000Z", outcome: { kind: "binary", success: false } }),
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

  it("guarantees incremental reduction matches batch projection byte-for-byte", () => {
    const events = [
      makeValidRecord({ eventId: "evt-seq-1", occurredAt: "2026-09-04T10:00:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-seq-2", occurredAt: "2026-09-04T10:01:00.000Z", outcome: { kind: "binary", success: true } }),
      makeValidRecord({ eventId: "evt-seq-3", occurredAt: "2026-09-04T10:02:00.000Z", outcome: { kind: "binary", success: true } }),
    ];

    const batchState = projectLearnerState(ontology, events);

    let incrementalState = createEmptyLearnerStateProjection();
    for (const event of events) {
      incrementalState = reduceLearnerState(incrementalState, event, ontology);
    }

    expect(JSON.stringify(incrementalState)).toBe(JSON.stringify(batchState));
  });
});

describe("User Story 5: Scoped Authority & No Boolean Mastery", () => {
  it("ensures all construct projections declare routing-only and contain no boolean mastered field", () => {
    const events = [
      makeValidRecord({ eventId: "evt-m-1", occurredAt: "2026-09-04T10:00:00.000Z" }),
      makeValidRecord({ eventId: "evt-m-2", occurredAt: "2026-09-04T10:01:00.000Z" }),
      makeValidRecord({ eventId: "evt-m-3", occurredAt: "2026-09-04T10:02:00.000Z" }),
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
    // 3 consecutive successes from prior pL0=0.1
    const baseline = computeReferenceBktBaseline([true, true, true]);

    expect(baseline.modelDonor).toBe("CAHLR/pyBKT");
    expect(baseline.donorVersion).toBe("1.4.3");
    expect(baseline.donorCommit).toBe("06fc180ae72c117458acc527f8ec90cc8e0581c1");
    expect(baseline.license).toBe("MIT");
    expect(baseline.role).toBe("reference-baseline-donor");
    expect(baseline.historySteps).toHaveLength(4); // initial pL0 + 3 steps
    expect(baseline.historySteps[0]).toBe(0.1); // P(L_0)
    expect(baseline.finalPKnown).toBeGreaterThan(0.7); // Increases monotonically on success
    expect(baseline.limitations.length).toBeGreaterThanOrEqual(4);

    // Contrasting BKT with Nếp epistemic unknown:
    // BKT step 0 has P(L_0) = 0.1 (assigns knowledge probability to zero evidence)
    // Nếp Core V1 evaluates zero evidence strictly to status: "unknown" and provisionalRoutingScore: null
    const zeroHistoryBkt = computeReferenceBktBaseline([]);
    expect(zeroHistoryBkt.finalPKnown).toBe(0.1); // BKT prior assumption

    const nepZeroStats = createEmptyConstructStatistics();
    const nepZeroProj = projectConstruct("nep.en.v1.communication-activity.spoken-production", nepZeroStats);
    expect(nepZeroProj.status).toBe("unknown");
    expect(nepZeroProj.provisionalRoutingScore).toBeNull(); // Nếp avoids BKT false prior
  });
});
