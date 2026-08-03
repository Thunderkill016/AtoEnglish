import { afterEach, describe, expect, it, vi } from "vitest";

import { requestGeminiInteraction } from "@/features/real-talk/server/gemini-interactions-provider";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=abcdefghijk";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Gemini Interactions client", () => {
  it("sends a public YouTube URL as video input with stateless structured output", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: "interaction-123",
          model: "gemini-3.5-flash",
          status: "completed",
          steps: [
            {
              type: "model_output",
              content: [{ type: "text", text: '{"supported":true}' }],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await requestGeminiInteraction({
      apiKey: "test-key",
      model: "gemini-3.5-flash",
      input: [
        { type: "video", uri: YOUTUBE_URL },
        { type: "text", text: "Extract timed English cues." },
      ],
      responseJsonSchema: {
        type: "object",
        properties: { supported: { type: "boolean" } },
        required: ["supported"],
      },
      fetchImpl: fetchMock,
      endpoint: "https://example.test/v1beta/interactions",
    });

    expect(result).toEqual({
      success: true,
      text: '{"supported":true}',
      model: "gemini-3.5-flash",
      interactionId: "interaction-123",
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = init?.headers as Record<string, string>;
    const body = JSON.parse(String(init?.body)) as {
      input: unknown[];
      store: boolean;
      response_format: unknown;
      generation_config: unknown;
    };

    expect(headers["x-goog-api-key"]).toBe("test-key");
    expect(headers["Api-Revision"]).toBe("2026-05-20");
    expect(body.input).toEqual([
      { type: "video", uri: YOUTUBE_URL },
      { type: "text", text: "Extract timed English cues." },
    ]);
    expect(body.store).toBe(false);
    expect(body.response_format).toMatchObject({
      type: "text",
      mime_type: "application/json",
    });
    expect(body.generation_config).toMatchObject({
      thinking_level: "low",
      thinking_summaries: "none",
    });
  });

  it("maps rate limits without leaking provider response bodies", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      new Response("secret provider detail", { status: 429 }),
    );

    const result = await requestGeminiInteraction({
      apiKey: "test-key",
      model: "gemini-3.5-flash",
      input: [{ type: "video", uri: YOUTUBE_URL }],
      fetchImpl: fetchMock,
    });

    expect(result).toMatchObject({
      success: false,
      retryable: true,
      status: 429,
      failure: {
        code: "MODEL_RATE_LIMITED",
        retryAfterSeconds: 60,
      },
    });
    if (!result.success) {
      expect(result.failure.error).not.toContain("secret provider detail");
    }
  });
});
