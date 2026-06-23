import { describe, it, expect, vi } from "vitest";
import { calcSpeechScore } from "@/lib/utils/speech";
import { SpeechRecognitionFallback } from "@/lib/utils/speech-fallback";

describe("calcSpeechScore", () => {
  it("perfect match returns 100", () => {
    expect(calcSpeechScore("hello world", "hello world")).toBe(100);
  });

  it("empty spoken returns 0", () => {
    expect(calcSpeechScore("hello world", "")).toBe(0);
  });

  it("empty target returns 100 (nothing to match)", () => {
    expect(calcSpeechScore("", "anything")).toBe(100);
  });

  it("partial match returns correct percentage", () => {
    // target: 4 words, spoken: 2 match → 50%
    expect(calcSpeechScore("the quick brown fox", "the brown")).toBe(50);
  });

  it("case-insensitive matching", () => {
    expect(calcSpeechScore("Hello World", "hello world")).toBe(100);
    expect(calcSpeechScore("HELLO WORLD", "Hello World")).toBe(100);
  });

  it("ignores punctuation in comparison", () => {
    expect(calcSpeechScore("hello, world!", "hello world")).toBe(100);
  });

  it("extra words in spoken don't reduce score", () => {
    // target: "hello" → all target words found → 100%
    expect(calcSpeechScore("hello", "oh hello there")).toBe(100);
  });

  it("completely wrong spoken returns 0", () => {
    expect(calcSpeechScore("hello world", "foo bar baz")).toBe(0);
  });

  it("single word match", () => {
    expect(calcSpeechScore("hello", "hello")).toBe(100);
  });

  it("handles multiple spaces correctly", () => {
    expect(calcSpeechScore("hello world", "hello  world")).toBe(100);
  });
});

describe("SpeechRecognitionFallback", () => {
  it("should trigger onstart when start is called", async () => {
    const recognition = new SpeechRecognitionFallback();
    const onstartSpy = vi.fn();
    recognition.onstart = onstartSpy;

    recognition.start();

    // Wait for the async setTimeout to trigger
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onstartSpy).toHaveBeenCalled();
  });

  it("should trigger onresult and onend with expected transcript when stop is called", async () => {
    SpeechRecognitionFallback.activeTranscript = "hello fallback world";
    const recognition = new SpeechRecognitionFallback();
    const onresultSpy = vi.fn();
    const onendSpy = vi.fn();

    recognition.onresult = onresultSpy;
    recognition.onend = onendSpy;

    recognition.start();
    recognition.stop();

    // Wait for the 1 second simulated processing
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(onresultSpy).toHaveBeenCalled();
    const event = onresultSpy.mock.calls[0][0];
    expect(event.results[0][0].transcript).toBe("hello fallback world");
    expect(onendSpy).toHaveBeenCalled();
  });

  it("should support fallback default transcript if activeTranscript is not set", async () => {
    SpeechRecognitionFallback.activeTranscript = "";
    const recognition = new SpeechRecognitionFallback();
    const onresultSpy = vi.fn();

    recognition.onresult = onresultSpy;

    recognition.start();
    recognition.stop();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(onresultSpy).toHaveBeenCalled();
    const event = onresultSpy.mock.calls[0][0];
    expect(event.results[0][0].transcript).toContain("I would like to describe my day today");
  });
});

