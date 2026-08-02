import type { Database, Json } from "@/types/supabase";

type RealTalkVideoTable = {
  Row: {
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
    topics: string[] | null;
    speaker_count: number | null;
    speakers: Json;
    created_by: string | null;
    is_public: boolean;
    created_at: string;
  };
  Insert: {
    id?: string;
    slug: string;
    youtube_id: string;
    title: string;
    title_vi: string;
    channel_name?: string | null;
    channel_url?: string | null;
    thumbnail_url?: string | null;
    duration_seconds?: number;
    segment_start?: number;
    segment_end?: number;
    level?: string;
    topics?: string[] | null;
    speaker_count?: number | null;
    speakers?: Json;
    created_by?: string | null;
    is_public?: boolean;
    created_at?: string;
  };
  Update: {
    id?: string;
    slug?: string;
    youtube_id?: string;
    title?: string;
    title_vi?: string;
    channel_name?: string | null;
    channel_url?: string | null;
    thumbnail_url?: string | null;
    duration_seconds?: number;
    segment_start?: number;
    segment_end?: number;
    level?: string;
    topics?: string[] | null;
    speaker_count?: number | null;
    speakers?: Json;
    created_by?: string | null;
    is_public?: boolean;
    created_at?: string;
  };
  Relationships: [];
};

type RealTalkLessonTable = {
  Row: {
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
  };
  Insert: {
    id?: string;
    video_id: string;
    title: string;
    title_vi: string;
    level?: string;
    estimated_minutes?: number;
    can_do_statement?: string | null;
    can_do_statement_vi?: string | null;
    transcript?: Json;
    pre_watch?: Json;
    while_watch?: Json;
    post_watch?: Json;
    environment?: Json;
    communication_events?: Json;
    transfer_task?: Json;
    generation_model?: string | null;
    generation_status?: string;
    generation_warnings?: Json;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    video_id?: string;
    title?: string;
    title_vi?: string;
    level?: string;
    estimated_minutes?: number;
    can_do_statement?: string | null;
    can_do_statement_vi?: string | null;
    transcript?: Json;
    pre_watch?: Json;
    while_watch?: Json;
    post_watch?: Json;
    environment?: Json;
    communication_events?: Json;
    transfer_task?: Json;
    generation_model?: string | null;
    generation_status?: string;
    generation_warnings?: Json;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    created_at?: string;
  };
  Relationships: [];
};

type RealTalkProgressTable = {
  Row: {
    id: string;
    user_id: string;
    video_id: string;
    phase: string;
    quiz_score: number | null;
    speaking_scores: Json | null;
    saved_vocab: string[] | null;
    completed_at: string | null;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    video_id: string;
    phase?: string;
    quiz_score?: number | null;
    speaking_scores?: Json | null;
    saved_vocab?: string[] | null;
    completed_at?: string | null;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    video_id?: string;
    phase?: string;
    quiz_score?: number | null;
    speaking_scores?: Json | null;
    saved_vocab?: string[] | null;
    completed_at?: string | null;
    updated_at?: string;
  };
  Relationships: [];
};

type RealTalkTables = {
  real_talk_videos: RealTalkVideoTable;
  real_talk_lessons: RealTalkLessonTable;
  real_talk_progress: RealTalkProgressTable;
};

export type AppDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & RealTalkTables;
  };
};
