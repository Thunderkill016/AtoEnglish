import { afterEach, describe, expect, it, vi } from "vitest";

import { createGeminiYouTubeVideoTranscriptSource } from "@/features/real-talk/server/transcript-sources/gemini-youtube-video";

const request = {
  sourceId: "abcdefghijk",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  requestedLanguage: "en",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

function interactionResponse(output: unknown) {
  return new Response(
    JSON.stringify({
      id: "interaction-video-1",
      model: "gemini-3.5-flash",
      status: "completed",
      steps: [
        {
          type: "model_output",
          content: [{ type: "text", text: JSON.stringify(output) }],
        },
      ],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("Gemini direct YouTube transcript source", () => {
  it("returns bounded machine-checked timed cues for a private draft", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      interactionResponse({
        supported: true,
        unsupportedReason: "",
        language: "en-US",
        selectedStartSeconds: 12,
        selectedEndSeconds: 20,
        cues: [
          { text: "Hi, how are you?", offset: 12, duration: 2 },
          { text: "I'm good, thanks.", offset: 15, duration: 2 },
        ],
        warnings: ["Speaker identity is uncertain."],
      }),
    );
    const source = createGeminiYouTubeVideoTranscriptSource({
      apiKey: "test-key",
      models: ["gemini-3.5-flash"],
      fetchImpl: fetchMock,
      endpoint: "https://example.test/v1beta/interactions",
    });

    const result = await source.acquire(request);

    expect(result.cues).toEqual([
      { text: "Hi, how are you?", offset: 12, duration: 2 },
      { text: "I'm good, thanks.", offset: 15, duration: 2 },
    ]);
    expect(result.metadata).toMatchObject({
      adapterId: "gemini-youtube-video-preview-v1",
      provider: "gemini-interactions-youtube:gemini-3.5-flash",
      acquisitionMode: "experimental_unofficial",
      trust: "experimental",
      reviewStatus: "machine_checked",
      language: "en-US",
    });
    expect(result.metadata.warnings.join(" ")).toContain("store=false");

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const body = JSON.parse(String(init?.body)) as {
      input: Array<Record<string, unknown>>;
      store: boolean;
    };
    expect(body.input[0]).toEqual({ type: "video", uri: request.sourceUrl });
    expect(body.store).toBe(false);
  });

  it("fails honestly when the public video has no suitable English interaction", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      interactionResponse({
        supported: false,
        unsupportedReason: "No spoken English interaction was found.",
        language: "unknown",
        selectedStartSeconds: 0,
        selectedEndSeconds: 0,
        cues: [],
        warnings: [],
      }),
    );
    const source = createGeminiYouTubeVideoTranscriptSource({
      apiKey: "test-key",
      models: ["gemini-3.5-flash"],
      fetchImpl: fetchMock,
    });

    await expect(source.acquire(request)).rejects.toMatchObject({
      code: "transcript_not_available",
      retryable: false,
      message: "No spoken English interaction was found.",
    });
  });

  it("rejects model cues outside the selected 180-second window", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
      interactionResponse({
        supported: true,
        unsupportedReason: "",
        language: "en",
        selectedStartSeconds: 10,
        selectedEndSeconds: 20,
        cues: [
          { text: "First", offset: 10, duration: 1 },
          { text: "Outside", offset: 30, duration: 1 },
        ],
        warnings: [],
      }),
    );
    const source = createGeminiYouTubeVideoTranscriptSource({
      apiKey: "test-key",
      models: ["gemini-3.5-flash"],
      fetchImpl: fetchMock,
    });

    await expect(source.acquire(request)).rejects.toMatchObject({
      code: "transcript_provider_error",
      retryable: false,
    });
  });
});
