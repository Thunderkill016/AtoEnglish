// Generated from Supabase project zpiwddskhduuykpxltun after the Real Talk
// private-draft migrations. Keep this file schema-shaped; do not add domain
// behavior or UI-specific types here.

import type { Json } from "@/types/supabase";

export type RealTalkLessonTable = {
  Row: {
    can_do_statement: string | null;
    can_do_statement_vi: string | null;
    communication_events: Json;
    created_at: string;
    environment: Json;
    estimated_minutes: number;
    generation_model: string | null;
    generation_status: string;
    generation_warnings: Json;
    id: string;
    level: string;
    post_watch: Json;
    pre_watch: Json;
    reviewed_at: string | null;
    reviewed_by: string | null;
    title: string;
    title_vi: string;
    transcript: Json;
    transfer_task: Json;
    video_id: string;
    while_watch: Json;
  };
  Insert: {
    can_do_statement?: string | null;
    can_do_statement_vi?: string | null;
    communication_events?: Json;
    created_at?: string;
    environment?: Json;
    estimated_minutes?: number;
    generation_model?: string | null;
    generation_status?: string;
    generation_warnings?: Json;
    id?: string;
    level?: string;
    post_watch?: Json;
    pre_watch?: Json;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    title: string;
    title_vi: string;
    transcript?: Json;
    transfer_task?: Json;
    video_id: string;
    while_watch?: Json;
  };
  Update: {
    can_do_statement?: string | null;
    can_do_statement_vi?: string | null;
    communication_events?: Json;
    created_at?: string;
    environment?: Json;
    estimated_minutes?: number;
    generation_model?: string | null;
    generation_status?: string;
    generation_warnings?: Json;
    id?: string;
    level?: string;
    post_watch?: Json;
    pre_watch?: Json;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    title?: string;
    title_vi?: string;
    transcript?: Json;
    transfer_task?: Json;
    video_id?: string;
    while_watch?: Json;
  };
  Relationships: [
    {
      foreignKeyName: "real_talk_lessons_video_id_fkey";
      columns: ["video_id"];
      isOneToOne: true;
      referencedRelation: "real_talk_videos";
      referencedColumns: ["id"];
    },
  ];
};

export type RealTalkVideoTable = {
  Row: {
    channel_name: string | null;
    channel_url: string | null;
    created_at: string;
    created_by: string | null;
    duration_seconds: number;
    id: string;
    is_public: boolean;
    level: string;
    segment_end: number;
    segment_start: number;
    slug: string;
    speaker_count: number | null;
    speakers: Json;
    thumbnail_url: string | null;
    title: string;
    title_vi: string;
    topics: string[];
    youtube_id: string;
  };
  Insert: {
    channel_name?: string | null;
    channel_url?: string | null;
    created_at?: string;
    created_by?: string | null;
    duration_seconds?: number;
    id?: string;
    is_public?: boolean;
    level?: string;
    segment_end?: number;
    segment_start?: number;
    slug: string;
    speaker_count?: number | null;
    speakers?: Json;
    thumbnail_url?: string | null;
    title: string;
    title_vi: string;
    topics?: string[];
    youtube_id: string;
  };
  Update: {
    channel_name?: string | null;
    channel_url?: string | null;
    created_at?: string;
    created_by?: string | null;
    duration_seconds?: number;
    id?: string;
    is_public?: boolean;
    level?: string;
    segment_end?: number;
    segment_start?: number;
    slug?: string;
    speaker_count?: number | null;
    speakers?: Json;
    thumbnail_url?: string | null;
    title?: string;
    title_vi?: string;
    topics?: string[];
    youtube_id?: string;
  };
  Relationships: [];
};

export type RealTalkTables = {
  real_talk_lessons: RealTalkLessonTable;
  real_talk_videos: RealTalkVideoTable;
};
