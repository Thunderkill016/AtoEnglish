// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  recordPilotEvent: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/app/actions/pilot-analytics", () => ({
  recordPilotEvent: mocks.recordPilotEvent,
}));

import {
  trackDaySevenReturnIfDue,
  trackPilotEventOnce,
  trackPilotEventPersistentlyOnce,
} from "./pilot-analytics-client";

const ANONYMOUS_ID = "71d6aa6e-9182-4a71-9945-d4895da6c1f2";

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  mocks.recordPilotEvent.mockClear();
  mocks.recordPilotEvent.mockResolvedValue({ success: true });
  vi.stubGlobal("crypto", { randomUUID: () => ANONYMOUS_ID });
});

describe("pilot analytics client", () => {
  it("deduplicates render-driven events within one browser session", async () => {
    trackPilotEventOnce("unit_started", "unit-a0-1", {
      source: "lesson",
      unitId: "unit-a0-1",
    });
    trackPilotEventOnce("unit_started", "unit-a0-1", {
      source: "lesson",
      unitId: "unit-a0-1",
    });

    await vi.waitFor(() => expect(mocks.recordPilotEvent).toHaveBeenCalledTimes(1));
  });

  it("deduplicates milestone events across browser sessions after persistence succeeds", async () => {
    trackPilotEventPersistentlyOnce("first_speaking_completed", "unit-a0-1", {
      source: "lesson",
      unitId: "unit-a0-1",
      score: 72,
      passed: true,
    });
    await vi.waitFor(() =>
      expect(
        window.localStorage.getItem(
          "ato_pilot_event_persistent_once:first_speaking_completed:unit-a0-1",
        ),
      ).toBe("1"),
    );

    window.sessionStorage.clear();
    trackPilotEventPersistentlyOnce("first_speaking_completed", "unit-a0-1", {
      source: "lesson",
      unitId: "unit-a0-1",
      score: 72,
      passed: true,
    });

    expect(mocks.recordPilotEvent).toHaveBeenCalledTimes(1);
  });

  it("does not permanently suppress a milestone when storage fails", async () => {
    mocks.recordPilotEvent.mockResolvedValueOnce({ success: false });

    trackPilotEventPersistentlyOnce("unit_completed", "unit-a0-1", {
      source: "lesson",
      unitId: "unit-a0-1",
      score: 80,
      starCount: 2,
      passed: true,
    });

    await vi.waitFor(() => expect(mocks.recordPilotEvent).toHaveBeenCalledTimes(1));
    expect(
      window.localStorage.getItem(
        "ato_pilot_event_persistent_once:unit_completed:unit-a0-1",
      ),
    ).toBeNull();
  });

  it("records the seven-day return only after seven full days", async () => {
    window.localStorage.setItem(
      "ato_pilot_started_at",
      String(Date.now() - 7 * 24 * 60 * 60 * 1000 - 1),
    );

    trackDaySevenReturnIfDue();
    trackDaySevenReturnIfDue();

    await vi.waitFor(() => expect(mocks.recordPilotEvent).toHaveBeenCalledTimes(1));
    expect(mocks.recordPilotEvent).toHaveBeenCalledWith({
      eventName: "day_7_returned",
      anonymousId: ANONYMOUS_ID,
      source: "app",
      dayNumber: 7,
    });
  });
});
