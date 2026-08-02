"use server";

import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

const generateLimiter = createRateLimiter(5, 60 * 1000, "real-talk-generate");

// ─── YouTube Helpers ───────────────────────────────────────────────────────────

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  // Already a plain video ID (11 chars, alphanumeric + dash/underscore)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  // Standard URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

// ─── Transcript Fetching ───────────────────────────────────────────────────────

interface RawTranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

async function fetchTranscript(videoId: string): Promise<{
  success: boolean;
  transcript?: RawTranscriptItem[];
  error?: string;
}> {
  try {
    // Dynamic import to avoid bundling issues
    const { YoutubeTranscript } = await import("youtube-transcript");
    const items = await YoutubeTranscript.fetchTranscript(videoId);

    if (!items || items.length === 0) {
      return { success: false, error: "Video không có phụ đề / captions." };
    }

    const mapped: RawTranscriptItem[] = items.map((item) => ({
      text: item.text,
      offset: item.offset / 1000, // Convert ms → seconds
      duration: item.duration / 1000,
    }));

    return { success: true, transcript: mapped };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Không thể lấy transcript.";
    return { success: false, error: msg };
  }
}

// ─── Gemini AI Lesson Generation ───────────────────────────────────────────────

const LESSON_GENERATION_PROMPT = `Bạn là giáo viên tiếng Anh chuyên gia cho người Việt mất gốc (Pre-A1 → A2).

Bạn sẽ nhận transcript từ một video YouTube trò chuyện thực tế. Nhiệm vụ:
1. Phân tích transcript
2. Tạo bài học tiếng Anh hoàn chỉnh theo khung Pre-While-Post

QUAN TRỌNG - Quy tắc:
- Tất cả giải thích cho learner phải bằng TIẾNG VIỆT
- Highlight lỗi phát âm đặc thù người Việt (L1 interference)
- Chọn 6-8 từ vựng quan trọng nhất, ưu tiên collocations và phrasal verbs
- Focus points: discourse markers (you know, actually, I mean), grammar patterns, collocations
- Quiz phải dựa trên NỘI DUNG thực tế trong video, không bịa
- Sound alerts: chọn 1-2 âm khó cho người Việt có trong video (ví dụ: /θ/, /ŋ/, /r/, /l/)

RESPONSE FORMAT: JSON thuần túy, không markdown. Trả về object với cấu trúc sau:

{
  "title": "Tiêu đề tiếng Anh",
  "titleVi": "Tiêu đề tiếng Việt",
  "level": "A1",
  "estimatedMinutes": 15,
  "canDoStatement": "I can...",
  "canDoStatementVi": "Tôi có thể...",
  "speakers": [
    { "label": "Speaker A", "color": "#60a5fa" },
    { "label": "Speaker B", "color": "#34d399" }
  ],
  "transcript": [
    {
      "index": 0,
      "speaker": "Speaker A",
      "startTime": 0,
      "endTime": 5,
      "textEn": "English text",
      "textVi": "Vietnamese translation"
    }
  ],
  "preWatch": {
    "contextVi": "Mô tả ngữ cảnh bằng tiếng Việt...",
    "vocabulary": [
      {
        "word": "phrase",
        "phonetic": "/fɹeɪz/",
        "definition": "English definition",
        "meaningVi": "Nghĩa tiếng Việt",
        "contextSentence": "Câu trong video chứa từ này",
        "timestamp": 10,
        "pronunciationNote": "Ghi chú phát âm cho người Việt",
        "l1InterferenceVn": "Lỗi thường gặp của người Việt"
      }
    ],
    "prediction": {
      "questionVi": "Câu hỏi dự đoán?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    },
    "soundAlerts": [
      {
        "sound": "/θ/",
        "explanationVi": "Giải thích âm này",
        "exampleWords": ["think", "three"],
        "commonMistakeVi": "Lỗi thường gặp"
      }
    ]
  },
  "whileWatch": {
    "gistQuestion": {
      "questionVi": "Câu hỏi gist?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    },
    "focusPoints": [
      {
        "type": "discourse_marker",
        "pattern": "you know",
        "explanationVi": "Giải thích",
        "segmentIndices": [1, 5]
      }
    ],
    "keyMoments": [
      {
        "timestamp": 10,
        "descriptionVi": "Mô tả",
        "listenForVi": "Nghe cái gì"
      }
    ]
  },
  "postWatch": {
    "comprehensionQuiz": [
      {
        "id": "q1",
        "questionVi": "Câu hỏi?",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanationVi": "Giải thích đáp án"
      }
    ],
    "fillInTheBlank": [
      {
        "id": "fib1",
        "sentence": "I like to ___ hiking.",
        "hintVi": "đi (hoạt động)",
        "answer": "go",
        "alternatives": []
      }
    ],
    "speakingDrills": [
      {
        "id": "sd1",
        "phrase": "Key phrase from video",
        "meaningVi": "Nghĩa",
        "timestamp": 10,
        "tipVi": "Mẹo phát âm"
      }
    ],
    "culturalNotes": [
      {
        "titleVi": "Tiêu đề",
        "contentVi": "Nội dung ghi chú văn hóa"
      }
    ]
  }
}`;

async function generateLessonWithAI(
  transcript: RawTranscriptItem[],
  videoTitle: string,
  level: string,
): Promise<{
  success: boolean;
  lessonData?: Record<string, unknown>;
  error?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return { success: false, error: "GEMINI_API_KEY chưa cấu hình." };

  // Format transcript for the prompt
  const transcriptText = transcript
    .map((item, i) => `[${formatTimestamp(item.offset)}] ${item.text}`)
    .join("\n");

  const userPrompt = `Video title: "${videoTitle}"
Target level: ${level}
Total duration: ${Math.ceil(transcript[transcript.length - 1].offset + transcript[transcript.length - 1].duration)}s

TRANSCRIPT:
${transcriptText}

Hãy tạo bài học tiếng Anh hoàn chỉnh từ transcript trên. Nhớ:
- Diarize speakers (phân biệt người nói) dựa vào ngữ cảnh
- Chọn segment hay nhất nếu video dài (tối đa 3 phút)
- Tất cả giải thích bằng tiếng Việt
- Tập trung vào từ vựng và patterns thực tế trong video`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: LESSON_GENERATION_PROMPT }] },
            {
              role: "model",
              parts: [
                {
                  text: "Understood. Send me the transcript and I'll generate the lesson JSON.",
                },
              ],
            },
            { role: "user", parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
            maxOutputTokens: 8192,
          },
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[Real Talk] Gemini API error:", response.status, errBody);
      return { success: false, error: `Gemini API lỗi (${response.status}).` };
    }

    const resData = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return { success: false, error: "AI trả về phản hồi rỗng." };

    const parsed = JSON.parse(text.trim());
    return { success: true, lessonData: parsed };
  } catch (err: unknown) {
    console.error("[Real Talk] Lesson generation error:", err);
    const msg = err instanceof Error ? err.message : "Lỗi khi tạo bài học.";
    return { success: false, error: msg };
  }
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Main Server Action ────────────────────────────────────────────────────────

export interface GenerateLessonResult {
  success: boolean;
  video?: RealTalkVideo;
  lesson?: RealTalkLesson;
  error?: string;
}

/**
 * Server action: Takes a YouTube URL, fetches transcript, generates a full
 * Real Talk lesson using Gemini AI.
 *
 * Rate-limited to 5 req/min (AI generation is expensive).
 */
export async function generateRealTalkLesson(
  youtubeUrl: string,
  level: "A0" | "A1" | "A2" | "B1" | "B2" = "A1",
): Promise<GenerateLessonResult> {
  try {
    // 1. Rate limit
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateCheck = await generateLimiter.check(ip);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Bạn đang tạo quá nhiều bài. Thử lại sau 1 phút.",
      };
    }

    // 2. Extract video ID
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      return {
        success: false,
        error: "Link YouTube không hợp lệ. Hãy dán link đầy đủ hoặc video ID.",
      };
    }

    // 3. Fetch transcript
    const transcriptResult = await fetchTranscript(videoId);
    if (!transcriptResult.success || !transcriptResult.transcript) {
      return {
        success: false,
        error:
          transcriptResult.error ||
          "Không thể lấy phụ đề từ video. Video cần có captions/subtitles.",
      };
    }

    // 4. Fetch video metadata via oEmbed (no API key needed)
    let videoTitle = "YouTube Video";
    let channelName = "Unknown Channel";
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      );
      if (oembedRes.ok) {
        const oembed = (await oembedRes.json()) as {
          title?: string;
          author_name?: string;
          author_url?: string;
        };
        videoTitle = oembed.title || videoTitle;
        channelName = oembed.author_name || channelName;
      }
    } catch {
      // oEmbed failure is non-fatal, continue with defaults
    }

    // 5. Generate lesson with AI
    const aiResult = await generateLessonWithAI(
      transcriptResult.transcript,
      videoTitle,
      level,
    );
    if (!aiResult.success || !aiResult.lessonData) {
      return {
        success: false,
        error: aiResult.error || "AI không thể tạo bài học từ video này.",
      };
    }

    const data = aiResult.lessonData as Record<string, unknown>;

    // 6. Build video metadata
    const transcript = transcriptResult.transcript;
    const totalDuration = Math.ceil(
      transcript[transcript.length - 1].offset +
        transcript[transcript.length - 1].duration,
    );

    const slugId = videoTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const speakers = (data.speakers as Array<{
      label: string;
      color: string;
    }>) || [
      { label: "Speaker A", color: "#60a5fa" },
      { label: "Speaker B", color: "#34d399" },
    ];

    const video: RealTalkVideo = {
      id: slugId || videoId,
      youtubeId: videoId,
      title: videoTitle,
      titleVi: (data.titleVi as string) || videoTitle,
      channelName,
      channelUrl: `https://www.youtube.com/channel/UC${videoId.slice(0, 8)}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      durationSeconds: totalDuration,
      segment: { startSeconds: 0, endSeconds: Math.min(totalDuration, 180) },
      level,
      topics: [],
      speakerCount: speakers.length,
      speakers,
    };

    // 7. Build lesson from AI data
    const lesson: RealTalkLesson = {
      videoId: video.id,
      title: (data.title as string) || videoTitle,
      titleVi: (data.titleVi as string) || videoTitle,
      level,
      estimatedMinutes: (data.estimatedMinutes as number) || 15,
      canDoStatement: (data.canDoStatement as string) || "",
      canDoStatementVi: (data.canDoStatementVi as string) || "",
      transcript: (data.transcript as RealTalkLesson["transcript"]) || [],
      preWatch: (data.preWatch as RealTalkLesson["preWatch"]) || {
        contextVi: "",
        vocabulary: [],
        prediction: {
          questionVi: "",
          options: [],
          correctIndex: 0,
        },
        soundAlerts: [],
      },
      whileWatch: (data.whileWatch as RealTalkLesson["whileWatch"]) || {
        gistQuestion: {
          questionVi: "",
          options: [],
          correctIndex: 0,
        },
        focusPoints: [],
        keyMoments: [],
      },
      postWatch: (data.postWatch as RealTalkLesson["postWatch"]) || {
        comprehensionQuiz: [],
        fillInTheBlank: [],
        speakingDrills: [],
        culturalNotes: [],
      },
    };

    return { success: true, video, lesson };
  } catch (err: unknown) {
    console.error("[Real Talk] generateRealTalkLesson error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi. Vui lòng thử lại.",
    };
  }
}
