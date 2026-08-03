import { afterEach, describe, expect, it, vi } from "vitest";

import {
  experimentalYouTubeTimedTextSource,
  parseYouTubeTimedTextXml,
} from "@/features/real-talk/server/transcript-sources/youtube-timedtext-experimental";
import { privateYouTubeTranscriptSource } from "@/features/real-talk/server/transcript-sources/youtube-private";

const request = {
  sourceId: "abcdefghijk",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  requestedLanguage: "en",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("direct YouTube timed-text fallback", () => {
  it("parses both classic and srv3 caption XML without exposing markup", () => {
    expect(
      parseYouTubeTimedTextXml(
        '<transcript><text start="1.0" dur="1.2">Hello &amp; welcome</text><text start="2.4" dur="1.1">How are you?</text></transcript>',
      ),
    ).toEqual([
      { text: "Hello & welcome", offset: 1, duration: 1.2 },
      { text: "How are you?", offset: 2.4, duration: 1.1 },
    ]);

    expect(
      parseYouTubeTimedTextXml(
        '<timedtext><body><p t="1000" d="900"><s>Hello </s><s>there</s></p><p t="2100" d="1000"><s>Welcome</s></p></body></timedtext>',
      ),
    ).toEqual([
      { text: "Hello there", offset: 1, duration: 0.9 },
      { text: "Welcome", offset: 2.1, duration: 1 },
    ]);
  });

  it("tries bounded direct English tracks and returns the first readable one", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("", { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          '<transcript><text start="1.0" dur="1.0">First cue</text><text start="2.0" dur="1.0">Second cue</text></transcript>',
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await experimentalYouTubeTimedTextSource.acquire(request);

    expect(result.cues).toHaveLength(2);
    expect(result.metadata).toMatchObject({
      adapterId: "youtube-direct-timedtext-v1",
      provider: "youtube-direct-timedtext",
      trust: "experimental",
      reviewStatus: "unreviewed",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("composite adapter returns child evidence under its own verified identity", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }))
      .mockResolvedValueOnce(new Response("", { status: 200 }))
      .mockResolvedValueOnce(new Response("", { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          '<transcript><text start="3.0" dur="1.0">Hello</text><text start="4.0" dur="1.0">Again</text></transcript>',
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await privateYouTubeTranscriptSource.acquire(request);

    expect(result.cues).toHaveLength(2);
    expect(result.metadata.adapterId).toBe("youtube-private-composite-v1");
    expect(result.metadata.provider).toContain("youtube-direct-timedtext");
    expect(result.metadata.warnings.join(" ")).toContain(
      "Private composite adapter selected",
    );
  });
});
