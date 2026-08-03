import { describe, expect, it } from "vitest";

import {
  canonicalYouTubeWatchUrl,
  extractYouTubeVideoId,
} from "@/features/real-talk/domain/youtube-source";

const VIDEO_ID = "abcdefghijk";

describe("Real Talk YouTube source contract", () => {
  it.each([
    [`https://www.youtube.com/watch?v=${VIDEO_ID}`, VIDEO_ID],
    [`https://youtube.com/watch?v=${VIDEO_ID}&t=12`, VIDEO_ID],
    [`https://m.youtube.com/watch?v=${VIDEO_ID}`, VIDEO_ID],
    [`https://youtu.be/${VIDEO_ID}`, VIDEO_ID],
    [`https://www.youtube.com/shorts/${VIDEO_ID}`, VIDEO_ID],
    [`https://www.youtube.com/embed/${VIDEO_ID}`, VIDEO_ID],
  ])("accepts official HTTPS YouTube URL %s", (input, expected) => {
    expect(extractYouTubeVideoId(input)).toBe(expected);
    expect(canonicalYouTubeWatchUrl(input)).toBe(
      `https://www.youtube.com/watch?v=${VIDEO_ID}`,
    );
  });

  it.each([
    "not-a-url",
    VIDEO_ID,
    `http://www.youtube.com/watch?v=${VIDEO_ID}`,
    `https://youtube.com.evil.test/watch?v=${VIDEO_ID}`,
    `https://example.com/watch?v=${VIDEO_ID}`,
    "https://www.youtube.com/watch?v=too-short",
    "https://youtu.be/too-short",
    "https://www.youtube.com/playlist?list=PL123",
  ])("rejects unsupported source %s", (input) => {
    expect(extractYouTubeVideoId(input)).toBeNull();
    expect(canonicalYouTubeWatchUrl(input)).toBeNull();
  });
});
