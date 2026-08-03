import type { AppDatabase } from "@/types/app-database";
import type {
  RealTalkGenerationMetadata,
  RealTalkLesson,
  RealTalkLevel,
  RealTalkVideo,
} from "@/types/real-talk";

type RealTalkVideoRow =
  AppDatabase["public"]["Tables"]["real_talk_videos"]["Row"];
type RealTalkLessonRow =
  AppDatabase["public"]["Tables"]["real_talk_lessons"]["Row"];

const REAL_TALK_LEVELS = new Set<RealTalkLevel>([
  "A0",
  "A1",
  "A2",
  "B1",
  "B2",
]);

const GENERATION_STATUSES = new Set<RealTalkGenerationMetadata["status"]>([
  "ai_draft",
  "human_reviewed",
  "approved",
]);

function asLevel(value: string): RealTalkLevel {
  return REAL_TALK_LEVELS.has(value as RealTalkLevel)
    ? (value as RealTalkLevel)
    : "A1";
}

function asGenerationStatus(
  value: string,
): RealTalkGenerationMetadata["status"] {
  return GENERATION_STATUSES.has(
    value as RealTalkGenerationMetadata["status"],
  )
    ? (value as RealTalkGenerationMetadata["status"])
    : "ai_draft";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function mapRealTalkVideoRow(row: RealTalkVideoRow): RealTalkVideo {
  const watchUrl = `https://www.youtube.com/watch?v=${row.youtube_id}`;

  return {
    id: row.slug,
    youtubeId: row.youtube_id,
    title: row.title,
    titleVi: row.title_vi,
    channelName: row.channel_name ?? "Unknown channel",
    channelUrl: row.channel_url ?? watchUrl,
    thumbnailUrl:
      row.thumbnail_url ??
      `https://i.ytimg.com/vi/${row.youtube_id}/hqdefault.jpg`,
    durationSeconds: row.duration_seconds,
    segment: {
      startSeconds: Number(row.segment_start ?? 0),
      endSeconds: Number(row.segment_end ?? row.duration_seconds),
    },
    level: asLevel(row.level),
    topics: row.topics ?? [],
    speakerCount: row.speaker_count ?? 2,
    speakers: row.speakers as unknown as RealTalkVideo["speakers"],
    source: {
      watchUrl,
      metadataSource: "youtube_oembed",
      transcriptSource: "youtube_caption",
    },
  };
}

export function mapRealTalkLessonRow(
  video: RealTalkVideo,
  row: RealTalkLessonRow,
): RealTalkLesson {
  return {
    videoId: video.id,
    title: row.title,
    titleVi: row.title_vi,
    level: asLevel(row.level),
    estimatedMinutes: row.estimated_minutes ?? 15,
    canDoStatement: row.can_do_statement ?? "",
    canDoStatementVi: row.can_do_statement_vi ?? "",
    transcript: row.transcript as unknown as RealTalkLesson["transcript"],
    preWatch: row.pre_watch as unknown as RealTalkLesson["preWatch"],
    whileWatch: row.while_watch as unknown as RealTalkLesson["whileWatch"],
    postWatch: row.post_watch as unknown as RealTalkLesson["postWatch"],
    environment:
      row.environment as unknown as RealTalkLesson["environment"],
    communicationEvents:
      row.communication_events as unknown as RealTalkLesson["communicationEvents"],
    transferTask:
      row.transfer_task as unknown as RealTalkLesson["transferTask"],
    generation: {
      status: asGenerationStatus(row.generation_status),
      model: row.generation_model ?? "unknown",
      generatedAt: row.created_at,
      persistence: "saved_private_draft",
      warnings: stringArray(row.generation_warnings),
    },
  };
}

export function mapPersistedRealTalkDraft(
  videoRow: RealTalkVideoRow,
  lessonRow: RealTalkLessonRow,
): { video: RealTalkVideo; lesson: RealTalkLesson } {
  const video = mapRealTalkVideoRow(videoRow);
  return { video, lesson: mapRealTalkLessonRow(video, lessonRow) };
}
