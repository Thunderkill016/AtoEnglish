import { afterEach, describe, expect, it, vi } from "vitest";

import { TranscriptSourceError } from "@/features/real-talk/domain/transcript-source";
import {
  experimentalYouTubeTranscriptSource,
  normalizeExperimentalYouTubeTranscriptItems,
} from "@/features/real-talk/server/transcript-sources/youtube-experimental";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("experimental YouTube transcript adapter", () => {
  it("normalizes millisecond caption items into bounded timed cues", () => {
    expect(
      normalizeExperimentalYouTubeTranscriptItems([
        { text: "<b>Hello</b> &amp; welcome", offset: 1_500, duration: 900 },
        { text: "  How are you?  ", offset: 2_500, duration: 1_200 },
      ]),
    ).toEqual([
      { text: "Hello & welcome", offset: 1.5, duration: 0.9 },
      { text: "How are you?", offset: 2.5, duration: 1.2 },
    ]);
  });

  it("acquires an English caption track through the bounded fetch adapter", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            captions: {
              playerCaptionsTracklistRenderer: {
                captionTracks: [
                  {
                    languageCode: "en",
                    baseUrl: "https://www.youtube.com/api/timedtext?v=abcdefghijk&lang=en",
                  },
                ],
              },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          '<transcript><text start="1.0" dur="1.2">Hello there</text><text start="2.4" dur="1.1">How are you?</text></transcript>',
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await experimentalYouTubeTranscriptSource.acquire({
      sourceId: "abcdefghijk",
      sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
      requestedLanguage: "en",
    });

    expect(result.cues).toEqual([
      { text: "Hello there", offset: 1, duration: 1.2 },
      { text: "How are you?", offset: 2.4, duration: 1.1 },
    ]);
    expect(result.metadata).toMatchObject({
      trust: "experimental",
      acquisitionMode: "experimental_unofficial",
      reviewStatus: "unreviewed",
      language: "en",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects a caption URL outside YouTube hosts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            captions: {
              playerCaptionsTracklistRenderer: {
                captionTracks: [
                  {
                    languageCode: "en",
                    baseUrl: "https://attacker.example/captions.xml",
                  },
                ],
              },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    await expect(
      experimentalYouTubeTranscriptSource.acquire({
        sourceId: "abcdefghijk",
        sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
        requestedLanguage: "en",
      }),
    ).rejects.toMatchObject<Partial<TranscriptSourceError>>({
      code: "transcript_provider_error",
      retryable: false,
    });
  });
});
