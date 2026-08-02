import { describe, expect, it, vi } from "vitest";

import { buildAuthorizedListeningLessonDraft } from "@/features/media-ingestion/domain/lesson-draft";
import { parseTimedText } from "@/features/media-ingestion/domain/timed-text";
import {
  extractYouTubeVideoId,
  fetchYouTubeCompanionMetadata,
} from "@/features/media-ingestion/domain/youtube-companion-demo";

describe("YouTube companion demo", () => {
  it.each([
    ["dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ?t=10", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
  ])("extracts video ID from %s", (input, expected) => {
    expect(extractYouTubeVideoId(input)).toBe(expected);
  });

  it("rejects non-YouTube URLs", () => {
    expect(() => extractYouTubeVideoId("https://example.com/video/123")).toThrow(
      "Chỉ chấp nhận URL",
    );
  });

  it("loads public metadata through the official Data API shape", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              id: "dQw4w9WgXcQ",
              snippet: {
                title: "Natural conversation",
                channelTitle: "Example Creator",
                publishedAt: "2026-01-01T00:00:00Z",
                thumbnails: { high: { url: "https://img.example/video.jpg" } },
              },
              status: { embeddable: true, license: "youtube" },
              contentDetails: { duration: "PT2M15S" },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const metadata = await fetchYouTubeCompanionMetadata(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "test-api-key",
      fetchMock,
    );

    expect(metadata).toMatchObject({
      sourceMode: "youtube_companion",
      videoId: "dQw4w9WgXcQ",
      title: "Natural conversation",
      embeddable: true,
      license: "youtube",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe("authorized caption lesson demo", () => {
  const vtt = `WEBVTT

00:00:01.000 --> 00:00:03.500
Hi, I'm Maya.

00:00:04.000 --> 00:00:06.000
Nice to meet you.
`;

  it("parses WebVTT and builds an editor draft", () => {
    const parsed = parseTimedText(vtt, { durationMs: 10_000 });
    const lesson = buildAuthorizedListeningLessonDraft(
      {
        sourceMode: "youtube_companion",
        videoId: "dQw4w9WgXcQ",
        title: "Natural conversation",
        channelTitle: "Example Creator",
        publishedAt: "2026-01-01T00:00:00Z",
        durationIso8601: "PT10S",
        embeddable: true,
        license: "creativeCommon",
        watchUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: null,
      },
      parsed.cues,
      {
        canStoreTranscript: true,
        canCreateDerivedLesson: true,
        evidenceReference: "creator-upload-record-123",
      },
    );

    expect(parsed.format).toBe("vtt");
    expect(parsed.cues).toHaveLength(2);
    expect(lesson.status).toBe("editor_draft");
    expect(lesson.transcriptCues[0]?.text).toBe("Hi, I'm Maya.");
    expect(lesson.publicationBlocks.length).toBeGreaterThan(0);
  });

  it("rejects overlapping captions", () => {
    expect(() =>
      parseTimedText(`WEBVTT

00:00:01.000 --> 00:00:04.000
First.

00:00:03.500 --> 00:00:05.000
Second.
`),
    ).toThrow("chồng lấn");
  });
});
