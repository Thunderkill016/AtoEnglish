"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { toRealTalkLesson, validateGeneratedLesson } from "@/lib/real-talk/lesson-schema";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

const generateLimiter = createRateLimiter(5, 60 * 1000, "real-talk-generate");
const MAX_SEGMENT_SECONDS = 180;

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

    // Attempt 1: Fetch default transcript
    let items = await YoutubeTranscript.fetchTranscript(videoId).catch(
      () => null,
    );

    // Attempt 2: Fetch explicitly for 'en'
    if (!items || items.length === 0) {
      items = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "en",
      }).catch(() => null);
    }

    // Attempt 3: Fetch for 'en-US'
    if (!items || items.length === 0) {
      items = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "en-US",
      }).catch(() => null);
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        error:
          "Video này không có phụ đề (Subtitles/CC) trên YouTube. AI cần phụ đề để phân tích thoại. Bạn hãy thử dán link video khác có phụ đề CC nhé!",
      };
    }

    const mapped: RawTranscriptItem[] = items.map((item) => ({
      text: item.text,
      offset: item.offset / 1000, // Convert ms → seconds
      duration: item.duration / 1000,
    }));

    return { success: true, transcript: mapped };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Không thể lấy phụ đề từ video.";
    return {
      success: false,
      error: `Không thể lấy phụ đề từ video: ${msg}. Hãy thử lại với video có phụ đề CC!`,
    };
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
  model?: string;
  error?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return { success: false, error: "GEMINI_API_KEY chưa cấu hình." };

  // Limit transcript size to prevent exceeding token limit and high quota usage
  const MAX_TRANSCRIPT_ITEMS = 60; // ~3-4 minutes of speech
  const truncatedTranscript = transcript.slice(0, MAX_TRANSCRIPT_ITEMS);

  // Format transcript for prompt
  const transcriptText = truncatedTranscript
    .map((item) => `[${formatTimestamp(item.offset)}] ${item.text}`)
    .join("\n");

  const userPrompt = `Video title: "${videoTitle}"
Target level: ${level}
Total duration: ${Math.ceil(truncatedTranscript[truncatedTranscript.length - 1].offset + truncatedTranscript[truncatedTranscript.length - 1].duration)}s

TRANSCRIPT:
${transcriptText}

Hãy tạo bài học tiếng Anh hoàn chỉnh từ transcript trên. Nhớ:
- Diarize speakers (phân biệt người nói) dựa vào ngữ cảnh
- Chọn segment hay nhất (tối đa 3 phút)
- Tất cả giải thích bằng tiếng Việt
- Tập trung vào từ vựng và patterns thực tế trong video`;

  // Models to attempt in order of preference (prioritizing latest Gemini 3.6 & 3.5 Flash models)
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash",
  ];

  let lastStatus = 0;
  let lastErrBody = "";

  for (const model of models) {
    // Retry loop per model (up to 2 attempts with delay for 429)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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

        if (response.ok) {
          const resData = (await response.json()) as {
            candidates?: Array<{
              content?: { parts?: Array<{ text?: string }> };
            }>;
          };

          const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text.trim());
            return { success: true, lessonData: parsed, model };
          }
        }

        lastStatus = response.status;
        lastErrBody = await response.text();

        // If model non-existent (404), break immediately to next model
        if (response.status === 404) {
          break;
        }

        // If rate limited (429), wait 2s before retrying or switching model
        if (response.status === 429) {
          console.warn(
            `[Real Talk] Gemini API Rate Limit (429) on model ${model}, attempt ${attempt}. Retrying...`,
          );
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          // Non-429 error, break to next model
          break;
        }
      } catch (err) {
        console.error(`[Real Talk] Fetch error on model ${model}:`, err);
      }
    }
  }

  // Provide human-friendly error messages based on status
  if (lastStatus === 429) {
    return {
      success: false,
      error:
        "Hệ thống Gemini AI đang quá tải giới hạn lượt gọi (Lỗi 429 Quota Limit). Vui lòng thử lại sau 30-60 giây.",
    };
  }

  return {
    success: false,
    error: `Không thể kết nối Gemini AI (${lastStatus || "Network Error"}). ${lastErrBody ? lastErrBody.slice(0, 100) : ""}`,
  };
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
  slug?: string;
  error?: string;
}

interface MutationResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

interface RealTalkWriteClient {
  from: (table: "real_talk_videos" | "real_talk_lessons") => {
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string },
    ) => {
      select: (columns: string) => {
        maybeSingle: () => Promise<MutationResponse<{ id: string }>>;
      };
    };
  };
}

function buildLessonSlug(videoId: string, level: RealTalkVideo["level"], userId: string): string {
  return `real-talk-${videoId.toLowerCase()}-${level.toLowerCase()}-${userId.slice(0, 8)}`;
}

async function persistGeneratedLesson({
  supabase,
  userId,
  video,
  lesson,
  generationModel,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  generationModel: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  // Generated lesson tables are added by the Real Talk migration. The client
  // type is narrowed locally until database types are regenerated from Supabase.
  const db = supabase as unknown as RealTalkWriteClient;
  const videoResult = await db
    .from("real_talk_videos")
    .upsert(
      {
        slug: video.id,
        youtube_id: video.youtubeId,
        title: video.title,
        title_vi: video.titleVi,
        channel_name: video.channelName,
        channel_url: video.channelUrl,
        thumbnail_url: video.thumbnailUrl,
        duration_seconds: video.durationSeconds,
        segment_start: video.segment.startSeconds,
        segment_end: video.segment.endSeconds,
        level: video.level,
        topics: video.topics,
        speaker_count: video.speakerCount,
        speakers: video.speakers,
        created_by: userId,
        is_public: false,
        qa_status: "draft",
      },
      { onConflict: "slug" },
    )
    .select("id")
    .maybeSingle();

  if (videoResult.error || !videoResult.data) {
    return {
      success: false,
      error: videoResult.error?.message ?? "Không thể lưu video nguồn.",
    };
  }

  const lessonResult = await db
    .from("real_talk_lessons")
    .upsert(
      {
        video_id: videoResult.data.id,
        title: lesson.title,
        title_vi: lesson.titleVi,
        level: lesson.level,
        estimated_minutes: lesson.estimatedMinutes,
        can_do_statement: lesson.canDoStatement,
        can_do_statement_vi: lesson.canDoStatementVi,
        transcript: lesson.transcript,
        pre_watch: lesson.preWatch,
        while_watch: lesson.whileWatch,
        post_watch: lesson.postWatch,
        generation_model: generationModel,
      },
      { onConflict: "video_id" },
    )
    .select("id")
    .maybeSingle();

  if (lessonResult.error || !lessonResult.data) {
    return {
      success: false,
      error: lessonResult.error?.message ?? "Không thể lưu nội dung bài học.",
    };
  }

  return { success: true };
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

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để tạo và lưu bài học của riêng mình.",
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

    // Limit one study session to a digestible three-minute input segment.
    const trimmedTranscript = transcriptResult.transcript.filter(
      (item) => item.offset <= MAX_SEGMENT_SECONDS,
    );
    const effectiveTranscript =
      trimmedTranscript.length > 0
        ? trimmedTranscript
        : transcriptResult.transcript.slice(0, 40);

    // 4. Fetch video metadata via oEmbed (no API key needed)
    let videoTitle = "YouTube Video";
    let channelName = "Unknown Channel";
    let channelUrl = `https://www.youtube.com/watch?v=${videoId}`;
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
        channelUrl = oembed.author_url || channelUrl;
      }
    } catch {
      // oEmbed failure is non-fatal, continue with defaults
    }

    // 5. Generate lesson with AI
    const aiResult = await generateLessonWithAI(
      effectiveTranscript,
      videoTitle,
      level,
    );
    if (!aiResult.success || !aiResult.lessonData) {
      return {
        success: false,
        error: aiResult.error || "AI không thể tạo bài học từ video này.",
      };
    }

    const validation = validateGeneratedLesson(aiResult.lessonData);
    if (!validation.success) {
      return {
        success: false,
        error: `AI tạo bài chưa đạt cấu trúc cần học. Hãy thử lại. (${validation.error})`,
      };
    }
    if (validation.lesson.level !== level) {
      return {
        success: false,
        error: "AI trả về sai cấp độ đã chọn. Hãy tạo lại bài học.",
      };
    }

    // 6. Build video metadata
    const fullDuration = Math.ceil(
      transcriptResult.transcript[transcriptResult.transcript.length - 1]
        .offset +
        transcriptResult.transcript[transcriptResult.transcript.length - 1]
          .duration,
    );
    const segmentDuration = Math.min(fullDuration, MAX_SEGMENT_SECONDS);

    const slugId = buildLessonSlug(videoId, level, user.id);
    const generated = validation.lesson;

    const video: RealTalkVideo = {
      id: slugId || videoId,
      youtubeId: videoId,
      title: videoTitle,
      titleVi: generated.titleVi,
      channelName,
      channelUrl,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      durationSeconds: fullDuration,
      segment: { startSeconds: 0, endSeconds: segmentDuration },
      level,
      topics: ["my-library"],
      speakerCount: generated.speakers.length,
      speakers: generated.speakers,
    };

    // 7. Save before announcing success. A learner must be able to resume this
    // lesson from its own URL instead of losing it when the page refreshes.
    const persistence = await persistGeneratedLesson({
      supabase,
      userId: user.id,
      video,
      lesson: toRealTalkLesson(video.id, generated),
      generationModel: aiResult.model ?? "gemini-3.6-flash",
    });
    if (!persistence.success) {
      return {
        success: false,
        error: `Bài học đã được tạo nhưng chưa thể lưu vào thư viện: ${persistence.error}`,
      };
    }

    const lesson = toRealTalkLesson(video.id, generated);
    revalidatePath("/real-talk");
    return { success: true, video, lesson, slug: video.id };
  } catch (err: unknown) {
    console.error("[Real Talk] generateRealTalkLesson error:", err);
    const detail = err instanceof Error ? err.message : "";
    return {
      success: false,
      error: detail
        ? `Lỗi tạo bài học: ${detail}`
        : "Đã xảy ra lỗi. Vui lòng thử lại.",
    };
  }
}

/**
 * Fetch all catalog videos combining static curated list + DB public videos.
 */
export async function fetchCatalogVideos(): Promise<RealTalkVideo[]> {
  const { realTalkVideos } = await import("@/lib/data/real-talk/videos");
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = (await createClient()) as any;
    const { data: dbVideos } = await supabase
      .from("real_talk_videos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (!dbVideos || dbVideos.length === 0) return realTalkVideos;

    const mappedDb: RealTalkVideo[] = (dbVideos as any[]).map((v) => ({
      id: v.slug,
      youtubeId: v.youtube_id,
      title: v.title,
      titleVi: v.title_vi,
      channelName: v.channel_name ?? undefined,
      channelUrl: v.channel_url ?? undefined,
      thumbnailUrl:
        v.thumbnail_url ??
        `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
      durationSeconds: v.duration_seconds,
      segment: {
        startSeconds: Number(v.segment_start ?? 0),
        endSeconds: Number(v.segment_end ?? v.duration_seconds),
      },
      level: (v.level as RealTalkVideo["level"]) || "A1",
      topics: v.topics ?? [],
      speakerCount: v.speaker_count ?? 2,
      speakers: (v.speakers as RealTalkVideo["speakers"]) ?? [],
    }));

    // Deduplicate by slug ID (static takes precedence if same slug)
    const staticSlugs = new Set(realTalkVideos.map((v) => v.id));
    const newFromDb = mappedDb.filter((v) => !staticSlugs.has(v.id));

    return [...realTalkVideos, ...newFromDb];
  } catch {
    return realTalkVideos;
  }
}

/**
 * Fetch a single Real Talk lesson & video by videoId / slug.
 * Checks static curated list first, then falls back to Supabase DB.
 */
export async function fetchLessonBySlug(slug: string): Promise<{
  video?: RealTalkVideo;
  lesson?: RealTalkLesson;
}> {
  const { getRealTalkVideo, getRealTalkLesson } =
    await import("@/lib/data/real-talk/videos");
  const staticVideo = getRealTalkVideo(slug);
  const staticLesson = getRealTalkLesson(slug);

  if (staticVideo && staticLesson) {
    return { video: staticVideo, lesson: staticLesson };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = (await createClient()) as any;

    const { data: v } = await supabase
      .from("real_talk_videos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!v) return {};

    const { data: l } = await supabase
      .from("real_talk_lessons")
      .select("*")
      .eq("video_id", v.id)
      .maybeSingle();

    if (!l) return {};

    const video: RealTalkVideo = {
      id: v.slug,
      youtubeId: v.youtube_id,
      title: v.title,
      titleVi: v.title_vi,
      channelName: v.channel_name ?? undefined,
      channelUrl: v.channel_url ?? undefined,
      thumbnailUrl:
        v.thumbnail_url ??
        `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
      durationSeconds: v.duration_seconds,
      segment: {
        startSeconds: Number(v.segment_start ?? 0),
        endSeconds: Number(v.segment_end ?? v.duration_seconds),
      },
      level: (v.level as RealTalkVideo["level"]) || "A1",
      topics: v.topics ?? [],
      speakerCount: v.speaker_count ?? 2,
      speakers: (v.speakers as RealTalkVideo["speakers"]) ?? [],
    };

    const lesson: RealTalkLesson = {
      videoId: v.slug,
      title: l.title,
      titleVi: l.title_vi,
      level: (l.level as RealTalkLesson["level"]) || "A1",
      estimatedMinutes: l.estimated_minutes ?? 15,
      canDoStatement: l.can_do_statement ?? "",
      canDoStatementVi: l.can_do_statement_vi ?? "",
      transcript: l.transcript as unknown as RealTalkLesson["transcript"],
      preWatch: l.pre_watch as unknown as RealTalkLesson["preWatch"],
      whileWatch: l.while_watch as unknown as RealTalkLesson["whileWatch"],
      postWatch: l.post_watch as unknown as RealTalkLesson["postWatch"],
    };

    return { video, lesson };
  } catch {
    return {};
  }
}
