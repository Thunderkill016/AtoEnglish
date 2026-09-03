export const REALTIME_CONVERSATION_MAX_RESPONSES = 2;
export const REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS = 128;
export const REALTIME_CONVERSATION_MAX_CALL_MS = 50_000;

const OPENAI_ORIGIN = "https://api.openai.com";
const REALTIME_CALL_ID_PATTERN = /^rtc_[A-Za-z0-9_-]{3,128}$/;

type SidebandEventRecord = Record<string, unknown>;

export interface RealtimeSidebandBudgetState {
  responseCount: number;
}

export type RealtimeSidebandDecision =
  | {
      action: "continue";
      state: RealtimeSidebandBudgetState;
    }
  | {
      action: "hangup";
      reason:
        | "response_budget_exceeded"
        | "response_token_cap_exceeded"
        | "expected_turn_complete";
      state: RealtimeSidebandBudgetState;
    };

export function initialRealtimeSidebandBudgetState(): RealtimeSidebandBudgetState {
  return { responseCount: 0 };
}

export function realtimeCallIdFromLocation(location: string | null): string | null {
  if (!location) return null;

  let url: URL;
  try {
    url = new URL(location, OPENAI_ORIGIN);
  } catch {
    return null;
  }

  if (url.origin !== OPENAI_ORIGIN || url.search || url.hash) return null;

  const prefix = "/v1/realtime/calls/";
  if (!url.pathname.startsWith(prefix)) return null;

  const callId = url.pathname.slice(prefix.length);
  if (!REALTIME_CALL_ID_PATTERN.test(callId)) return null;
  return callId;
}

function asRecord(value: unknown): SidebandEventRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as SidebandEventRecord;
}

function exceedsResponseTokenCap(response: unknown): boolean {
  const record = asRecord(response);
  if (!record) return false;

  const maxOutputTokens = record.max_output_tokens;
  if (maxOutputTokens === "inf") return true;
  return (
    typeof maxOutputTokens === "number" &&
    Number.isFinite(maxOutputTokens) &&
    maxOutputTokens > REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS
  );
}

/**
 * Pure budget reducer for the server-side Realtime sideband monitor.
 *
 * The current V1 tutor contract allows exactly two assistant responses:
 * 1) the opening partner cue;
 * 2) the response to the learner's first spoken turn.
 *
 * The second `response.done` is terminal by design, so the server can hang up the provider call
 * without trusting the browser to close its WebRTC connection.
 */
export function inspectRealtimeSidebandEvent(
  state: RealtimeSidebandBudgetState,
  event: unknown,
): RealtimeSidebandDecision {
  const record = asRecord(event);
  if (!record || typeof record.type !== "string") {
    return { action: "continue", state };
  }

  if (record.type === "response.created") {
    const nextState = { responseCount: state.responseCount + 1 };

    if (nextState.responseCount > REALTIME_CONVERSATION_MAX_RESPONSES) {
      return {
        action: "hangup",
        reason: "response_budget_exceeded",
        state: nextState,
      };
    }

    if (exceedsResponseTokenCap(record.response)) {
      return {
        action: "hangup",
        reason: "response_token_cap_exceeded",
        state: nextState,
      };
    }

    return { action: "continue", state: nextState };
  }

  if (
    record.type === "response.done" &&
    state.responseCount >= REALTIME_CONVERSATION_MAX_RESPONSES
  ) {
    return {
      action: "hangup",
      reason: "expected_turn_complete",
      state,
    };
  }

  return { action: "continue", state };
}
