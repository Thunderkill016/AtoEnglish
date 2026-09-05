import { describe, expect, it } from "vitest";

import {
  buildBlindPredictionFeatureRow,
  buildFrozenNativeSplitProtocol,
  selectAuthorizedTrainPrefixEvents,
} from "./protocol";
import { buildPilotTaskDefinition } from "./task-matrix";
import { buildSyntheticTrace, issueSyntheticPilotEvent } from "./synthetic";

function makeProtocol() {
  return buildFrozenNativeSplitProtocol({
    frozenAt: "2026-09-01T08:00:00.000Z",
    fitCutoff: "2026-09-01T09:15:00.000Z",
    fitCompletedAt: "2026-09-01T09:16:00.000Z",
    trainingParticipantIds: ["p-train"],
    heldOutParticipantIds: ["p-heldout"],
    trainPrefixEventIdsByParticipant: {
      "p-train": ["p-train:e01", "p-train:e02", "p-train:e03"],
      "p-heldout": [],
    },
    blindTargetEventIds: [
      "p-train:e04",
      "p-train:e05",
      "p-heldout:cold-target",
    ],
    blindTargetParticipantIdByEventId: {
      "p-train:e04": "p-train",
      "p-train:e05": "p-train",
      "p-heldout:cold-target": "p-heldout",
    },
  });
}

function rowPayload(row: ReturnType<typeof buildBlindPredictionFeatureRow>): string {
  return JSON.stringify({
    acceptedHistoryEventIds: row.acceptedHistoryEventIds,
    b2: row.b2,
    b2Basis: row.b2Basis,
    b3: row.b3,
  });
}

describe("native pilot frozen split and blind block", () => {
  it("selects only frozen TRAIN-prefix labels available before the global fit cutoff", () => {
    const protocol = makeProtocol();
    const trace = buildSyntheticTrace("p-train");
    const selected = selectAuthorizedTrainPrefixEvents(protocol, trace);

    expect(selected.map((event) => event.evidence.eventId)).toEqual([
      "p-train:e01",
      "p-train:e02",
      "p-train:e03",
    ]);

    const latePrefix = issueSyntheticPilotEvent({
      participantId: "p-train",
      family: "recognition-independent",
      eventId: "p-train:e03",
      occurredAt: "2026-09-01T09:10:00.000Z",
      availableAt: "2026-09-01T09:15:00.000Z",
      success: true,
    });
    const replaced = [trace[0], trace[1], latePrefix, ...trace.slice(3)].filter(
      (event): event is NonNullable<typeof event> => event !== undefined,
    );
    expect(() => selectAuthorizedTrainPrefixEvents(protocol, replaced)).toThrow(
      /not causally available by fitCutoff/,
    );
  });

  it("rejects duplicate frozen TRAIN-prefix evidence instead of last-write-wins", () => {
    const protocol = makeProtocol();
    const trace = buildSyntheticTrace("p-train");
    const duplicate = issueSyntheticPilotEvent({
      participantId: "p-train",
      family: "recognition-supported",
      eventId: "p-train:e02",
      occurredAt: "2026-09-01T09:05:00.000Z",
      availableAt: "2026-09-01T09:05:02.000Z",
      success: true,
      responseLatencyMs: 900,
    });

    expect(() => selectAuthorizedTrainPrefixEvents(protocol, [...trace, duplicate])).toThrow(
      /ambiguous due to duplicate eventId: p-train:e02/,
    );

    expect(() =>
      buildBlindPredictionFeatureRow({
        protocol,
        participantId: "p-train",
        targetEventId: "p-train:e05",
        predictionTimestamp: "2026-09-02T09:00:00.000Z",
        currentTask: buildPilotTaskDefinition("delayed-free-recall"),
        history: [...trace, duplicate],
      }),
    ).toThrow(/duplicate prefix eventId: p-train:e02/);
  });

  it("binds every blind target to the prospectively frozen participant", () => {
    const protocol = makeProtocol();

    expect(() =>
      buildBlindPredictionFeatureRow({
        protocol,
        participantId: "p-train",
        targetEventId: "p-heldout:cold-target",
        predictionTimestamp: "2026-09-02T10:00:00.000Z",
        currentTask: buildPilotTaskDefinition("free-recall"),
        history: buildSyntheticTrace("p-train"),
      }),
    ).toThrow(/frozen to participant p-heldout: p-heldout:cold-target/);

    expect(() =>
      buildFrozenNativeSplitProtocol({
        frozenAt: "2026-09-01T08:00:00.000Z",
        fitCutoff: "2026-09-01T09:15:00.000Z",
        fitCompletedAt: "2026-09-01T09:16:00.000Z",
        trainingParticipantIds: ["p-train"],
        heldOutParticipantIds: ["p-heldout"],
        trainPrefixEventIdsByParticipant: { "p-train": [], "p-heldout": [] },
        blindTargetEventIds: ["target-a"],
        blindTargetParticipantIdByEventId: {},
      }),
    ).toThrow(/missing frozen participant binding: target-a/);

    expect(() =>
      buildFrozenNativeSplitProtocol({
        frozenAt: "2026-09-01T08:00:00.000Z",
        fitCutoff: "2026-09-01T09:15:00.000Z",
        fitCompletedAt: "2026-09-01T09:16:00.000Z",
        trainingParticipantIds: ["p-train"],
        heldOutParticipantIds: [],
        trainPrefixEventIdsByParticipant: { "p-train": [] },
        blindTargetEventIds: ["target-a"],
        blindTargetParticipantIdByEventId: {
          "target-a": "p-train",
          "target-extra": "p-train",
        },
      }),
    ).toThrow(/participant binding references unknown target: target-extra/);

    expect(() =>
      buildFrozenNativeSplitProtocol({
        frozenAt: "2026-09-01T08:00:00.000Z",
        fitCutoff: "2026-09-01T09:15:00.000Z",
        fitCompletedAt: "2026-09-01T09:16:00.000Z",
        trainingParticipantIds: ["p-train"],
        heldOutParticipantIds: [],
        trainPrefixEventIdsByParticipant: { "p-train": [] },
        blindTargetEventIds: ["target-a"],
        blindTargetParticipantIdByEventId: { "target-a": "not-allocated" },
      }),
    ).toThrow(/blind target references unallocated participant: target-a:not-allocated/);
  });

  it("never feeds an earlier blind-block outcome into a later blind-block prediction", () => {
    const protocol = makeProtocol();
    const original = buildSyntheticTrace("p-train");
    const currentTask = buildPilotTaskDefinition("delayed-free-recall");

    const rowA = buildBlindPredictionFeatureRow({
      protocol,
      participantId: "p-train",
      targetEventId: "p-train:e05",
      predictionTimestamp: "2026-09-02T09:00:00.000Z",
      currentTask,
      history: original,
    });

    const mutatedEarlierBlindOutcome = [
      ...original.slice(0, 3),
      issueSyntheticPilotEvent({
        participantId: "p-train",
        family: "free-recall",
        eventId: "p-train:e04",
        occurredAt: "2026-09-01T09:20:00.000Z",
        availableAt: "2026-09-01T09:20:01.000Z",
        success: true,
      }),
      ...original.slice(4),
    ];
    const rowB = buildBlindPredictionFeatureRow({
      protocol,
      participantId: "p-train",
      targetEventId: "p-train:e05",
      predictionTimestamp: "2026-09-02T09:00:00.000Z",
      currentTask,
      history: mutatedEarlierBlindOutcome,
    });

    expect(rowA.acceptedHistoryEventIds).toEqual([
      "p-train:e01",
      "p-train:e02",
      "p-train:e03",
    ]);
    expect(rowPayload(rowA)).toBe(rowPayload(rowB));
  });

  it("keeps a held-out participant at cold start even when their labeled history is supplied", () => {
    const protocol = makeProtocol();
    const row = buildBlindPredictionFeatureRow({
      protocol,
      participantId: "p-heldout",
      targetEventId: "p-heldout:cold-target",
      predictionTimestamp: "2026-09-02T10:00:00.000Z",
      currentTask: buildPilotTaskDefinition("free-recall"),
      history: buildSyntheticTrace("p-heldout"),
    });

    expect(row.acceptedHistoryEventIds).toEqual([]);
    expect(row.b2.prior_eligible_attempt_count).toBe(0);
    expect(row.b2.prior_success_rate).toBeNull();
    expect(row.b3.nep_status).toBe("unknown");
    expect(row.b3.nep_uncertainty).toBe("maximal");
  });

  it("rejects held-out TRAIN contribution and fitting that completes at prediction time", () => {
    expect(() =>
      buildFrozenNativeSplitProtocol({
        frozenAt: "2026-09-01T08:00:00.000Z",
        fitCutoff: "2026-09-01T09:15:00.000Z",
        fitCompletedAt: "2026-09-01T09:16:00.000Z",
        trainingParticipantIds: ["p-train"],
        heldOutParticipantIds: ["p-heldout"],
        trainPrefixEventIdsByParticipant: {
          "p-train": [],
          "p-heldout": ["p-heldout:e01"],
        },
        blindTargetEventIds: ["target"],
        blindTargetParticipantIdByEventId: { target: "p-train" },
      }),
    ).toThrow(/held-out participant cannot contribute TRAIN prefix events/);

    const protocol = buildFrozenNativeSplitProtocol({
      frozenAt: "2026-09-01T08:00:00.000Z",
      fitCutoff: "2026-09-01T09:15:00.000Z",
      fitCompletedAt: "2026-09-01T09:20:00.000Z",
      trainingParticipantIds: ["p-train"],
      heldOutParticipantIds: [],
      trainPrefixEventIdsByParticipant: { "p-train": [] },
      blindTargetEventIds: ["target"],
      blindTargetParticipantIdByEventId: { target: "p-train" },
    });

    expect(() =>
      buildBlindPredictionFeatureRow({
        protocol,
        participantId: "p-train",
        targetEventId: "target",
        predictionTimestamp: "2026-09-01T09:20:00.000Z",
        currentTask: buildPilotTaskDefinition("free-recall"),
        history: [],
      }),
    ).toThrow(/fitCompletedAt must strictly precede predictionTimestamp/);
  });
});
