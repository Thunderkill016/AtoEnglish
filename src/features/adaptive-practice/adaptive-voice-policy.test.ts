import { describe, expect, it } from "vitest";

import { adaptiveVoiceModeForPractice } from "./adaptive-voice-policy";

describe("adaptive voice policy V1", () => {
  it("uses guarded conversation only for produce speech", () => {
    expect(adaptiveVoiceModeForPractice({ kind: "produce", modality: "speech" })).toBe("conversation");
  });

  it("keeps retrieve speech capture-only", () => {
    expect(adaptiveVoiceModeForPractice({ kind: "retrieve", modality: "speech" })).toBe("capture");
  });

  it("does not expand repair or transfer conversation in this slice", () => {
    expect(adaptiveVoiceModeForPractice({ kind: "repair", modality: "speech" })).toBe("capture");
    expect(adaptiveVoiceModeForPractice({ kind: "transfer", modality: "speech" })).toBe("capture");
  });

  it("returns no voice mode for non-speech practice", () => {
    expect(adaptiveVoiceModeForPractice({ kind: "retrieve", modality: "choice" })).toBeNull();
  });
});
