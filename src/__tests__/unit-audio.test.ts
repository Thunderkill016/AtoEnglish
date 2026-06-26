import { describe, it, expect, vi, beforeEach } from "vitest";
import { playUnitAudio, stopUnitAudio } from "@/lib/utils/unit-audio";

describe("playUnitAudio", () => {
  beforeEach(() => {
    stopUnitAudio();
  });

  it("falls back to TTS when no src provided", async () => {
    const playTTS = vi.fn();
    const used = await playUnitAudio({ text: "hello" }, playTTS);
    expect(used).toBe(false);
    expect(playTTS).toHaveBeenCalledWith("hello", undefined);
  });

  it("falls back to TTS when audio probe fails", async () => {
    const playTTS = vi.fn();
    class MockAudio {
      preload = "";
      src = "";
      addEventListener(event: string, handler: () => void) {
        if (event === "error") queueMicrotask(handler);
      }
      removeEventListener() {}
    }
    vi.stubGlobal("Audio", MockAudio as unknown as typeof Audio);

    const used = await playUnitAudio(
      { src: "/audio/missing.mp3", text: "hello" },
      playTTS
    );
    expect(used).toBe(false);
    expect(playTTS).toHaveBeenCalledWith("hello", undefined);
    vi.unstubAllGlobals();
  });
});