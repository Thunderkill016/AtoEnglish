import { describe, expect, it } from "vitest";

import { resolveRealtimeConversationInstructions } from "@/lib/realtime/session-task";

function headersFor(actionId: string) {
  return new Headers({
    "X-AtoEnglish-Lesson-Id": "LESSON-CAP002-FIRST-MEETING-V1",
    "X-AtoEnglish-Lesson-Version": "1",
    "X-AtoEnglish-Action-Id": actionId,
  });
}

describe("realtime canonical task resolution", () => {
  it("resolves an eligible speech roleplay from the canonical Nếp registry", () => {
    const instructions = resolveRealtimeConversationInstructions(headersFor("produce"));

    expect(instructions).toContain("Current interaction type: produce");
    expect(instructions).toContain("Hi, I'm Maya. What's your name?");
    expect(instructions).toContain("conversation partner");
  });

  it("rejects retrieval so conversation cannot assist independent recall", () => {
    expect(resolveRealtimeConversationInstructions(headersFor("retrieve"))).toBeNull();
  });

  it("rejects stale, malformed and incomplete task identities", () => {
    expect(
      resolveRealtimeConversationInstructions(
        new Headers({
          "X-AtoEnglish-Lesson-Id": "LESSON-CAP002-FIRST-MEETING-V1",
          "X-AtoEnglish-Lesson-Version": "999",
          "X-AtoEnglish-Action-Id": "produce",
        }),
      ),
    ).toBeNull();
    expect(
      resolveRealtimeConversationInstructions(
        new Headers({
          "X-AtoEnglish-Lesson-Id": "LESSON-CAP002-FIRST-MEETING-V1",
          "X-AtoEnglish-Lesson-Version": "not-a-number",
          "X-AtoEnglish-Action-Id": "produce",
        }),
      ),
    ).toBeNull();
    expect(resolveRealtimeConversationInstructions(new Headers())).toBeNull();
  });

  it("does not leak canonical evaluator internals into model instructions", () => {
    const instructions = resolveRealtimeConversationInstructions(headersFor("transfer"));

    expect(instructions).not.toContain("targetSignals");
    expect(instructions).not.toContain("requiredSignalGroups");
    expect(instructions).not.toContain("evidenceType");
    expect(instructions).not.toContain("nep-target-signal-v1");
  });
});
