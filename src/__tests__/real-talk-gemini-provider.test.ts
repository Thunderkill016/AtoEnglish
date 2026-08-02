import { describe, expect, it, vi } from "vitest";

import {
  generateEvidenceBoundLessonWithGemini,
  parseEvidenceBoundLessonText,
  requestGeminiText,
  sanitizeGeminiJsonSchema,
} from "@/features/real-talk/server/gemini-lesson-provider";
import type { GeneratedLessonDraft } from "@/lib/real-talk/generation-contract";

const source = [
  { text: "Hi, I'm Maya.", offset: 100, duration: 2 },
  { text: "Nice to meet you. I'm Alex.", offset: 102, duration: 3 },
  { text: "Sorry, could you repeat that again?", offset: 105, duration: 3 },
  { text: "Sure. I said I'm Alex.", offset: 108, duration: 3 },
];

const metadata = {
  title: "Meeting someone new",
  channelName: "Fixture channel",
  channelUrl: "https://example.com/source",
};

const fakeDraft = {} as GeneratedLessonDraft;

function successfulResponse(text = "{}") {
  return new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ text }] } }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("Gemini lesson provider", () => {
  it("fails before transport when the API key is absent", async () => {
    const fetchImpl = vi.fn();
    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      { apiKey: "", fetchImpl: fetchImpl as unknown as typeof fetch },
    );

    expect(result).toMatchObject({ success: false, code: "MODEL_UNAVAILABLE" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("keeps the API key out of the URL and sends it through the Google header", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const headers = new Headers(init?.headers);
      expect(url).not.toContain("secret-live-key");
      expect(url).not.toContain("?key=");
      expect(headers.get("x-goog-api-key")).toBe("secret-live-key");
      return successfulResponse();
    }) as unknown as typeof fetch;
    const parseText = vi.fn(() => ({ success: true as const, draft: fakeDraft }));

    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      {
        apiKey: "secret-live-key",
        models: ["gemini-test"],
        attemptsPerModel: 1,
        fetchImpl,
        parseText,
      },
    );

    expect(result).toEqual({
      success: true,
      draft: fakeDraft,
      model: "gemini-test",
    });
    expect(parseText).toHaveBeenCalledOnce();
  });

  it("removes unsupported Gemini JSON Schema keywords while preserving property schemas", () => {
    const sanitized = sanitizeGeminiJsonSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      minLength: 1,
      properties: {
        phrase: {
          type: "string",
          pattern: "^[a-z]+$",
          minLength: 2,
          description: "Source-backed phrase",
        },
        score: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 10,
        },
      },
      required: ["phrase", "score"],
      additionalProperties: false,
    });

    expect(sanitized).toEqual({
      type: "object",
      properties: {
        phrase: {
          type: "string",
          description: "Source-backed phrase",
        },
        score: {
          type: "number",
          maximum: 10,
        },
      },
      required: ["phrase", "score"],
      additionalProperties: false,
    });
  });

  it("retries a 429 once and then accepts a valid response", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("quota", { status: 429 }))
      .mockResolvedValueOnce(successfulResponse()) as unknown as typeof fetch;
    const sleep = vi.fn(async () => undefined);

    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      {
        apiKey: "test-key",
        models: ["gemini-test"],
        attemptsPerModel: 2,
        fetchImpl,
        sleep,
        parseText: () => ({ success: true, draft: fakeDraft }),
      },
    );

    expect(result).toMatchObject({ success: true, model: "gemini-test" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(1_500);
  });

  it("falls back to the next model after a non-retryable provider response", async () => {
    const requestedModels: string[] = [];
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      requestedModels.push(
        decodeURIComponent(url.match(/models\/([^:]+):generateContent/)?.[1] ?? ""),
      );
      return requestedModels.length === 1
        ? new Response("missing model", { status: 404 })
        : successfulResponse();
    }) as unknown as typeof fetch;

    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      {
        apiKey: "test-key",
        models: ["gemini-missing", "gemini-working"],
        attemptsPerModel: 1,
        fetchImpl,
        parseText: () => ({ success: true, draft: fakeDraft }),
      },
    );

    expect(result).toMatchObject({ success: true, model: "gemini-working" });
    expect(requestedModels).toEqual(["gemini-missing", "gemini-working"]);
  });

  it("maps a missing candidate to a bounded invalid-output failure", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ candidates: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      {
        apiKey: "test-key",
        models: ["gemini-test"],
        attemptsPerModel: 1,
        fetchImpl,
      },
    );

    expect(result).toMatchObject({
      success: false,
      code: "MODEL_OUTPUT_INVALID",
    });
  });

  it("rejects malformed model text before schema or evidence acceptance", () => {
    const result = parseEvidenceBoundLessonText("NOT_JSON", source);
    expect(result).toMatchObject({
      success: false,
      code: "MODEL_OUTPUT_INVALID",
    });
  });

  it("rejects instruction-induced top-level fields instead of silently stripping them", () => {
    const result = parseEvidenceBoundLessonText(
      JSON.stringify({ hacked: true }),
      source,
    );
    expect(result).toMatchObject({
      success: false,
      code: "MODEL_OUTPUT_INVALID",
    });
  });

  it("maps transport exceptions to a bounded retryable provider failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("socket detail and secret-live-key");
    }) as unknown as typeof fetch;

    const result = await generateEvidenceBoundLessonWithGemini(
      { source, metadata, level: "A1" },
      {
        apiKey: "secret-live-key",
        models: ["gemini-test"],
        attemptsPerModel: 1,
        fetchImpl,
      },
    );

    expect(result).toMatchObject({
      success: false,
      code: "MODEL_UNAVAILABLE",
      retryAfterSeconds: 30,
    });
    if (result.success) throw new Error("Expected provider failure");
    expect(result.error).not.toContain("secret-live-key");
    expect(result.error).not.toContain("socket detail");
  });

  it("exposes a typed 429 transport result without reading or logging the body", async () => {
    const result = await requestGeminiText({
      apiKey: "test-key",
      model: "gemini-test",
      prompt: "fixture",
      fetchImpl: vi.fn(async () =>
        new Response("untrusted quota body", { status: 429 }),
      ) as unknown as typeof fetch,
    });

    expect(result).toMatchObject({
      success: false,
      retryable: true,
      status: 429,
      failure: {
        success: false,
        code: "MODEL_RATE_LIMITED",
        retryAfterSeconds: 60,
      },
    });
  });
});
