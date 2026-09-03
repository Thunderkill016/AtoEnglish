import { describe, expect, it } from "vitest";

import {
  initialRealtimeSidebandBudgetState,
  inspectRealtimeSidebandEvent,
  REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS,
  realtimeCallIdFromLocation,
} from "@/lib/realtime/sideband-policy";

describe("realtime sideband policy", () => {
  it("extracts only OpenAI WebRTC call identities from Location", () => {
    expect(realtimeCallIdFromLocation("/v1/realtime/calls/rtc_abc123")).toBe("rtc_abc123");
    expect(
      realtimeCallIdFromLocation("https://api.openai.com/v1/realtime/calls/rtc_safe-123"),
    ).toBe("rtc_safe-123");

    expect(realtimeCallIdFromLocation(null)).toBeNull();
    expect(realtimeCallIdFromLocation("/v1/realtime/calls/call_abc123")).toBeNull();
    expect(realtimeCallIdFromLocation("/v1/realtime/calls/rtc_abc123?x=1")).toBeNull();
    expect(
      realtimeCallIdFromLocation("https://example.com/v1/realtime/calls/rtc_abc123"),
    ).toBeNull();
  });

  it("allows exactly two assistant responses", () => {
    const initial = initialRealtimeSidebandBudgetState();
    const first = inspectRealtimeSidebandEvent(initial, {
      type: "response.created",
      response: { max_output_tokens: REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS },
    });
    expect(first).toEqual({ action: "continue", state: { responseCount: 1 } });

    const second = inspectRealtimeSidebandEvent(first.state, {
      type: "response.created",
      response: { max_output_tokens: REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS },
    });
    expect(second).toEqual({ action: "continue", state: { responseCount: 2 } });

    const third = inspectRealtimeSidebandEvent(second.state, {
      type: "response.created",
      response: { max_output_tokens: REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS },
    });
    expect(third).toEqual({
      action: "hangup",
      reason: "response_budget_exceeded",
      state: { responseCount: 3 },
    });
  });

  it("hangs up a response that overrides the session output cap", () => {
    const tooLarge = inspectRealtimeSidebandEvent(initialRealtimeSidebandBudgetState(), {
      type: "response.created",
      response: { max_output_tokens: REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS + 1 },
    });
    expect(tooLarge.action).toBe("hangup");
    if (tooLarge.action === "hangup") {
      expect(tooLarge.reason).toBe("response_token_cap_exceeded");
    }

    const infinite = inspectRealtimeSidebandEvent(initialRealtimeSidebandBudgetState(), {
      type: "response.created",
      response: { max_output_tokens: "inf" },
    });
    expect(infinite.action).toBe("hangup");
    if (infinite.action === "hangup") {
      expect(infinite.reason).toBe("response_token_cap_exceeded");
    }
  });

  it("ends the provider call when the second response is complete", () => {
    const state = { responseCount: 2 };
    expect(inspectRealtimeSidebandEvent(state, { type: "response.done" })).toEqual({
      action: "hangup",
      reason: "expected_turn_complete",
      state,
    });
  });

  it("ignores unrelated or malformed server events", () => {
    const state = { responseCount: 1 };
    expect(inspectRealtimeSidebandEvent(state, { type: "input_audio_buffer.speech_started" })).toEqual(
      { action: "continue", state },
    );
    expect(inspectRealtimeSidebandEvent(state, null)).toEqual({ action: "continue", state });
  });
});
