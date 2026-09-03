import { describe, expect, it } from "vitest";

import { parseOpenAIRealtimeServerEvent } from "@/lib/realtime/events";

describe("parseOpenAIRealtimeServerEvent", () => {
  it("maps learner transcription without inventing a score", () => {
    expect(
      parseOpenAIRealtimeServerEvent({
        type: "conversation.item.input_audio_transcription.completed",
        item_id: "item-1",
        transcript: "  Could you say that again?  ",
      }),
    ).toEqual({
      kind: "learner-transcript",
      itemId: "item-1",
      transcript: "Could you say that again?",
    });
  });

  it("maps completed assistant audio transcript", () => {
    expect(
      parseOpenAIRealtimeServerEvent({
        type: "response.output_audio_transcript.done",
        item_id: "assistant-item",
        response_id: "response-1",
        transcript: "Sure. What do you do for work?",
      }),
    ).toEqual({
      kind: "assistant-transcript",
      itemId: "assistant-item",
      responseId: "response-1",
      transcript: "Sure. What do you do for work?",
    });
  });

  it("maps provider errors without throwing", () => {
    expect(
      parseOpenAIRealtimeServerEvent({
        type: "error",
        error: { code: "invalid_request", message: "Bad event" },
      }),
    ).toEqual({
      kind: "provider-error",
      code: "invalid_request",
      message: "Bad event",
    });
  });

  it("accepts serialized events and ignores irrelevant or malformed input", () => {
    expect(
      parseOpenAIRealtimeServerEvent(
        JSON.stringify({ type: "session.created", session: { id: "sess-1" } }),
      ),
    ).toEqual({ kind: "session-ready", sessionId: "sess-1" });

    expect(parseOpenAIRealtimeServerEvent("not-json")).toBeNull();
    expect(parseOpenAIRealtimeServerEvent({ type: "rate_limits.updated" })).toBeNull();
  });
});
