import type { Json } from "@/types/supabase";

export interface RealTalkVideoRow {
  id: string;
  slug: string;
  youtube_id: string;
  title: string;
  title_vi: string;
  channel_name: string | null;
  channel_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number;
  segment_start: number;
  segment_end: number;
  level: string;
  topics: string[];
  speaker_count: number | null;
  speakers: Json;
  created_by: string | null;
  is_public: boolean;
  transcript_acquisition_mode: string;
  transcript_review_status: string;
  transcript_source_metadata: Json;
  transcript_cue_digest: string | null;
  created_at: string;
}

export interface RealTalkLessonRow {
  id: string;
  video_id: string;
  title: string;
  title_vi: string;
  level: string;
  estimated_minutes: number;
  can_do_statement: string | null;
  can_do_statement_vi: string | null;
  transcript: Json;
  pre_watch: Json;
  while_watch: Json;
  post_watch: Json;
  environment: Json;
  communication_events: Json;
  transfer_task: Json;
  generation_model: string | null;
  generation_status: string;
  generation_warnings: Json;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
}

export interface AtomicPrivateDraftRpcArgs {
  p_video: Json;
  p_lesson: Json;
}

export interface AtomicPrivateDraftRpcRow {
  video_id: string;
  lesson_id: string;
}

export interface AtomicPrivateDraftRpcClient {
  rpc(
    functionName: "upsert_real_talk_private_draft",
    args: AtomicPrivateDraftRpcArgs,
  ): Promise<{
    data: AtomicPrivateDraftRpcRow[] | null;
    error: { message: string; code?: string } | null;
  }>;
}
