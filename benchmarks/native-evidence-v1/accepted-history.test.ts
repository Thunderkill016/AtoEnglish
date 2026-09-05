import { describe, expect, it } from "vitest";

import { selectCausalAcceptedHistory } from "./features";
import { issueSyntheticPilotEvent } from "./synthetic";

describe("native pilot accepted-history parity", () => {
  it("excludes causally available evidence that the core projector rejects", () => {
    const firstTransfer = issueSyntheticPilotEvent({
      participantId: "p-history-parity",
      family: "near-transfer",
      eventId: "p-history-parity:transfer-first",
      occurredAt: "2026-09-01T08:00:00.000Z",
      availableAt: "2026-09-01T08:00:01.000Z",
      success: true,
    });

    const accepted = selectCausalAcceptedHistory(
      "p-history-parity",
      [firstTransfer],
      "2026-09-01T09:00:00.000Z",
    );

    expect(accepted).toEqual([]);
  });

  it("uses the same accepted ledger after a valid baseline makes transfer lawful", () => {
    const baseline = issueSyntheticPilotEvent({
      participantId: "p-history-parity",
      family: "free-recall",
      eventId: "p-history-parity:baseline",
      occurredAt: "2026-09-01T08:00:00.000Z",
      availableAt: "2026-09-01T08:00:01.000Z",
      success: true,
    });
    const transfer = issueSyntheticPilotEvent({
      participantId: "p-history-parity",
      family: "near-transfer",
      eventId: "p-history-parity:transfer",
      occurredAt: "2026-09-01T08:10:00.000Z",
      availableAt: "2026-09-01T08:10:01.000Z",
      success: true,
    });

    const accepted = selectCausalAcceptedHistory(
      "p-history-parity",
      [baseline, transfer],
      "2026-09-01T09:00:00.000Z",
    );

    expect(accepted.map((event) => event.evidence.eventId)).toEqual([
      "p-history-parity:baseline",
      "p-history-parity:transfer",
    ]);
  });
});
