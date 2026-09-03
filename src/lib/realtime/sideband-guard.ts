import WebSocket, { type RawData } from "ws";

import {
  initialRealtimeSidebandBudgetState,
  inspectRealtimeSidebandEvent,
  REALTIME_CONVERSATION_MAX_CALL_MS,
} from "@/lib/realtime/sideband-policy";

const OPENAI_REALTIME_SIDEBAND_URL = "wss://api.openai.com/v1/realtime";
const OPENAI_REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";
const SIDEBAND_HANDSHAKE_TIMEOUT_MS = 5_000;
const HANGUP_TIMEOUT_MS = 5_000;

export interface RealtimeConversationGuard {
  done: Promise<void>;
}

type GuardReason =
  | "response_budget_exceeded"
  | "response_token_cap_exceeded"
  | "expected_turn_complete"
  | "duration_budget_exceeded"
  | "sideband_closed"
  | "sideband_error";

function decodeSidebandMessage(data: RawData): unknown {
  try {
    const text = Array.isArray(data)
      ? Buffer.concat(data).toString("utf8")
      : data instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(data)).toString("utf8")
        : data.toString("utf8");
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function hangupRealtimeCall(callId: string, apiKey: string, reason: GuardReason) {
  try {
    const response = await fetch(`${OPENAI_REALTIME_CALLS_URL}/${encodeURIComponent(callId)}/hangup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(HANGUP_TIMEOUT_MS),
    });

    if (!response.ok && response.status !== 404) {
      console.error("OpenAI realtime hangup failed", {
        callId,
        reason,
        status: response.status,
        requestId: response.headers.get("x-request-id"),
      });
    }
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error("OpenAI realtime hangup request failed", {
      callId,
      reason,
      failure: timedOut ? "timeout" : "network",
    });
  }
}

/**
 * Attach a trusted server-side sideband monitor to an existing WebRTC Realtime call.
 *
 * The function resolves only after the sideband WebSocket is open. If attachment fails, the call
 * is hung up and the caller must not return the SDP answer to the browser. Once attached, `done`
 * remains pending until the call is deliberately ended or the monitor fails closed.
 */
export async function startRealtimeConversationGuard({
  callId,
  apiKey,
  maxDurationMs = REALTIME_CONVERSATION_MAX_CALL_MS,
}: {
  callId: string;
  apiKey: string;
  maxDurationMs?: number;
}): Promise<RealtimeConversationGuard> {
  const sidebandUrl = new URL(OPENAI_REALTIME_SIDEBAND_URL);
  sidebandUrl.searchParams.set("call_id", callId);

  const socket = new WebSocket(sidebandUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
    handshakeTimeout: SIDEBAND_HANDSHAKE_TIMEOUT_MS,
  });

  try {
    await new Promise<void>((resolve, reject) => {
      const handleOpen = () => {
        cleanup();
        resolve();
      };
      const handleError = (error: Error) => {
        cleanup();
        reject(error);
      };
      const handleClose = () => {
        cleanup();
        reject(new Error("Realtime sideband closed before guard attachment."));
      };
      const cleanup = () => {
        socket.off("open", handleOpen);
        socket.off("error", handleError);
        socket.off("close", handleClose);
      };

      socket.once("open", handleOpen);
      socket.once("error", handleError);
      socket.once("close", handleClose);
    });
  } catch (error) {
    socket.terminate();
    await hangupRealtimeCall(callId, apiKey, "sideband_error");
    throw new Error("Không gắn được realtime server guard.", { cause: error });
  }

  const done = new Promise<void>((resolve) => {
    let state = initialRealtimeSidebandBudgetState();
    let terminating = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(durationTimer);
      socket.removeAllListeners();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      resolve();
    };

    const terminate = (reason: GuardReason) => {
      if (terminating || finished) return;
      terminating = true;
      void hangupRealtimeCall(callId, apiKey, reason).finally(finish);
    };

    const durationTimer = setTimeout(
      () => terminate("duration_budget_exceeded"),
      Math.max(1_000, maxDurationMs),
    );

    socket.on("message", (data) => {
      const event = decodeSidebandMessage(data);
      const decision = inspectRealtimeSidebandEvent(state, event);
      state = decision.state;
      if (decision.action === "hangup") terminate(decision.reason);
    });

    socket.on("error", () => terminate("sideband_error"));
    socket.on("close", () => terminate("sideband_closed"));
  });

  return { done };
}
