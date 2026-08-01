import { describe, expect, it, vi } from "vitest";

import {
  buildTranslateTtsUrl,
  splitTextForTts,
  synthesizeMp3,
} from "./translate-tts";

describe("translate TTS adapter", () => {
  it("splits normalized text into bounded chunks", () => {
    const chunks = splitTextForTts(
      "  Hello   there. This is a compact text-to-speech test.  ",
      18,
    );

    expect(chunks.every((chunk) => chunk.length <= 18)).toBe(true);
    expect(chunks.join(" ")).toBe(
      "Hello there. This is a compact text-to-speech test.",
    );
  });

  it("splits a single overlong token without exceeding the limit", () => {
    expect(splitTextForTts("abcdefghij", 4)).toEqual(["abcd", "efgh", "ij"]);
  });

  it("rejects empty text and invalid limits", () => {
    expect(() => splitTextForTts("   ")).toThrow("must not be empty");
    expect(() => splitTextForTts("hello", 0)).toThrow(
      "positive integer",
    );
  });

  it("builds an encoded translate speech URL", () => {
    const url = buildTranslateTtsUrl("What's your name?", "en-GB");

    expect(url.origin).toBe("https://translate.google.com");
    expect(url.pathname).toBe("/translate_tts");
    expect(url.searchParams.get("client")).toBe("tw-ob");
    expect(url.searchParams.get("tl")).toBe("en-GB");
    expect(url.searchParams.get("q")).toBe("What's your name?");
  });

  it("retries transient failures and concatenates chunk audio", async () => {
    const requests: string[] = [];
    let shouldFailFirstRequest = true;

    const fetchImpl = vi.fn(async (input: URL | RequestInfo) => {
      const url = new URL(
        input instanceof URL
          ? input.toString()
          : typeof input === "string"
            ? input
            : input.url,
      );
      const text = url.searchParams.get("q") ?? "";
      requests.push(text);

      if (text === "alpha beta" && shouldFailFirstRequest) {
        shouldFailFirstRequest = false;
        throw new Error("temporary network failure");
      }

      const bytes = text === "alpha beta" ? [1, 2] : [3, 4];
      return new Response(Uint8Array.from(bytes), {
        status: 200,
        headers: { "content-type": "audio/mpeg" },
      });
    }) as unknown as typeof fetch;

    const audio = await synthesizeMp3("alpha beta gamma", {
      fetchImpl,
      maxChars: 10,
      retries: 1,
      retryDelayMs: 0,
      timeoutMs: 1_000,
    });

    expect([...audio]).toEqual([1, 2, 3, 4]);
    expect(requests).toEqual(["alpha beta", "alpha beta", "gamma"]);
  });

  it("rejects non-audio responses", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response("blocked", {
        status: 200,
        headers: { "content-type": "text/html" },
      }),
    ) as unknown as typeof fetch;

    await expect(
      synthesizeMp3("hello", {
        fetchImpl,
        retries: 0,
        timeoutMs: 1_000,
      }),
    ).rejects.toThrow("unexpected content type");
  });
});
