import { describe, expect, it } from "vitest";

import {
  MAX_REALTIME_SDP_BYTES,
  OPENAI_REALTIME_MODEL,
  buildOpenAIRealtimeSessionConfig,
  isPlausibleRealtimeSdpOffer,
} from "@/lib/realtime/openai-session";

describe("realtime session policy", () => {
  it("uses semantic VAD and keeps mastery authority outside the voice model", () => {
    const config = buildOpenAIRealtimeSessionConfig();

    expect(config.model).toBe(OPENAI_REALTIME_MODEL);
    expect(config.audio.input.turn_detection).toEqual({
      type: "semantic_vad",
      eagerness: "low",
      create_response: true,
      interrupt_response: true,
    });
    expect(config.instructions).toContain("Do not grade, score, declare mastery");
    expect(config.instructions).toContain("trusted server evaluates learning evidence separately");
  });

  it("accepts a normal audio SDP offer", () => {
    expect(
      isPlausibleRealtimeSdpOffer(
        [
          "v=0",
          "o=- 1 1 IN IP4 127.0.0.1",
          "s=-",
          "t=0 0",
          "m=audio 9 UDP/TLS/RTP/SAVPF 111",
        ].join("\r\n"),
      ),
    ).toBe(true);
  });

  it("rejects malformed and oversized SDP", () => {
    expect(isPlausibleRealtimeSdpOffer("hello")).toBe(false);
    expect(
      isPlausibleRealtimeSdpOffer(
        `v=0\nm=audio 9 UDP/TLS/RTP/SAVPF 111\n${"x".repeat(MAX_REALTIME_SDP_BYTES)}`,
      ),
    ).toBe(false);
  });
});
