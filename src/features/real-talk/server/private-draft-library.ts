import "server-only";

import { mapPersistedRealTalkDraft } from "@/features/real-talk/server/draft-mapping";
import { createClient } from "@/lib/supabase/server";
import type {
  RealTalkLessonRow,
  RealTalkVideoRow,
} from "@/types/real-talk-database";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

interface QueryError {
  message: string;
  code?: string;
}

interface QueryResult<T> {
  data: T | null;
  error: QueryError | null;
}

interface FilterBuilder<T> {
  eq(column: string, value: string | boolean): FilterBuilder<T>;
  order(
    column: string,
    options?: { ascending?: boolean },
  ): Promise<QueryResult<T[]>>;
  maybeSingle(): Promise<QueryResult<T>>;
}

interface TableBuilder<T> {
  select(columns?: string): FilterBuilder<T>;
}

interface RealTalkQueryClient {
  from(table: "real_talk_videos"): TableBuilder<RealTalkVideoRow>;
  from(table: "real_talk_lessons"): TableBuilder<RealTalkLessonRow>;
}

export interface PrivateDraftSummary {
  id: string;
  slug: string;
  title: string;
  titleVi: string;
  thumbnailUrl: string;
  level: string;
  createdAt: string;
  acquisitionMode: string;
  reviewStatus: string;
}

async function getAuthenticatedOwner() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    userId: error ? null : (user?.id ?? null),
  };
}

export async function listOwnerPrivateDrafts(): Promise<PrivateDraftSummary[]> {
  const { supabase, userId } = await getAuthenticatedOwner();
  if (!userId) return [];

  const queryClient = supabase as unknown as RealTalkQueryClient;
  const { data, error } = await queryClient
    .from("real_talk_videos")
    .select("*")
    .eq("created_by", userId)
    .eq("is_public", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleVi: row.title_vi,
    thumbnailUrl:
      row.thumbnail_url ??
      `https://i.ytimg.com/vi/${row.youtube_id}/hqdefault.jpg`,
    level: row.level,
    createdAt: row.created_at,
    acquisitionMode: row.transcript_acquisition_mode,
    reviewStatus: row.transcript_review_status,
  }));
}

export async function fetchOwnerPrivateDraftBySlug(slug: string): Promise<{
  video?: RealTalkVideo;
  lesson?: RealTalkLesson;
}> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug || normalizedSlug.length > 180) return {};

  const { supabase, userId } = await getAuthenticatedOwner();
  if (!userId) return {};

  const queryClient = supabase as unknown as RealTalkQueryClient;
  const { data: videoRow, error: videoError } = await queryClient
    .from("real_talk_videos")
    .select("*")
    .eq("slug", normalizedSlug)
    .eq("created_by", userId)
    .eq("is_public", false)
    .maybeSingle();
  if (videoError || !videoRow) return {};

  const { data: lessonRow, error: lessonError } = await queryClient
    .from("real_talk_lessons")
    .select("*")
    .eq("video_id", videoRow.id)
    .maybeSingle();
  if (lessonError || !lessonRow) return {};

  return mapPersistedRealTalkDraft(videoRow, lessonRow);
}
