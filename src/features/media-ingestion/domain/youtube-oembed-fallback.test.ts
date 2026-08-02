import { describe, expect, it, vi } from "vitest";

import { fetchYouTubeCompanionMetadata } from "@/features/media-ingestion/domain/youtube-companion-demo";

describe("YouTube oEmbed metadata fallback", () => {
  it("loads basic embeddable metadata without an API key", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "video",
          title: "A natural conversation",
          author_name: "Example Creator",
          author_url: "https://www.youtube.com/@example",
          thumbnail_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          html:
            '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const metadata = await fetchYouTubeCompanionMetadata(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "",
      fetchMock,
    );

    expect(metadata).toMatchObject({
      metadataSource: "youtube_oembed",
      videoId: "dQw4w9WgXcQ",
      title: "A natural conversation",
      channelTitle: "Example Creator",
      authorUrl: "https://www.youtube.com/@example",
      publishedAt: "",
      durationIso8601: "",
      embeddable: true,
      license: "unknown",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestUrl.origin).toBe("https://www.youtube.com");
    expect(requestUrl.pathname).toBe("/oembed");
    expect(requestUrl.searchParams.get("format")).toBe("json");
    expect(requestUrl.searchParams.get("url")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
  });

  it("rejects an oEmbed response without an official embed representation", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "video",
          title: "Unavailable video",
          author_name: "Example Creator",
          html: "",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(
      fetchYouTubeCompanionMetadata("dQw4w9WgXcQ", "", fetchMock),
    ).rejects.toThrow("mã nhúng hợp lệ");
  });
});
