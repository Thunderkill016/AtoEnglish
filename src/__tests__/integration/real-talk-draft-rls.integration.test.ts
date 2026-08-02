import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { AppDatabase } from "@/types/app-database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_PASSWORD = "RealTalkRls!2026";
const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const VIDEO_TOKEN = Math.random()
  .toString(36)
  .replace(/[^a-z0-9]/g, "")
  .slice(0, 8)
  .padEnd(8, "0");
const VIDEO_IDS = {
  ownerA: `a${VIDEO_TOKEN}01`,
  ownerAUnpaired: `b${VIDEO_TOKEN}02`,
  ownerB: `c${VIDEO_TOKEN}03`,
  anonymous: `d${VIDEO_TOKEN}04`,
} as const;

type Client = SupabaseClient<AppDatabase>;

let adminClient: Client;
let anonymousClient: Client;
let ownerAClient: Client;
let ownerBClient: Client;
let ownerAId = "";
let ownerBId = "";
let ownerAVideoId = "";
let ownerAUnpairedVideoId = "";
let ownerBVideoId = "";
let ownerALessonId = "";

const ownerAEmail = `real-talk-owner-a-${RUN_ID}@atoenglish.test`;
const ownerBEmail = `real-talk-owner-b-${RUN_ID}@atoenglish.test`;

function client(key: string): Client {
  return createClient<AppDatabase>(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function createAuthenticatedOwner(email: string) {
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Could not create integration owner: ${error?.message}`);
  }

  const ownerClient = client(SUPABASE_ANON_KEY);
  const { data: session, error: signInError } =
    await ownerClient.auth.signInWithPassword({
      email,
      password: TEST_PASSWORD,
    });
  if (signInError || !session.session) {
    throw new Error(`Could not sign in integration owner: ${signInError?.message}`);
  }

  return { id: data.user.id, client: ownerClient };
}

function videoInsert(params: {
  slug: string;
  youtubeId: string;
  ownerId: string;
  isPublic?: boolean;
}) {
  return {
    slug: params.slug,
    youtube_id: params.youtubeId,
    title: "RLS fixture conversation",
    title_vi: "Hội thoại kiểm thử RLS",
    channel_name: "Integration fixture",
    channel_url: "https://www.youtube.com/@fixture",
    thumbnail_url: null,
    duration_seconds: 120,
    segment_start: 10,
    segment_end: 60,
    level: "A1",
    topics: ["rls-test"],
    speaker_count: 2,
    speakers: [
      { label: "Speaker A", color: "#60a5fa" },
      { label: "Speaker B", color: "#34d399" },
    ],
    created_by: params.ownerId,
    is_public: params.isPublic ?? false,
  };
}

function lessonInsert(videoId: string, status = "ai_draft") {
  return {
    video_id: videoId,
    title: "RLS fixture lesson",
    title_vi: "Bài học kiểm thử RLS",
    level: "A1",
    estimated_minutes: 12,
    can_do_statement: "I can introduce myself.",
    can_do_statement_vi: "Tôi có thể tự giới thiệu.",
    transcript: [],
    pre_watch: {},
    while_watch: {},
    post_watch: {},
    environment: {
      titleVi: "Gặp người mới",
      situationVi: "Hai người mới gặp nhau.",
      learnerRoleVi: "Người tham dự",
      partnerRoleVi: "Người tham dự khác",
      realWorldGoalVi: "Trao đổi tên.",
    },
    communication_events: [],
    transfer_task: {
      situationVi: "Gặp đồng nghiệp mới.",
      learnerGoalVi: "Tự giới thiệu.",
      promptVi: "Nói tên của bạn.",
      successCriteriaVi: ["Nói tên", "Phản hồi lịch sự"],
      suggestedLanguage: ["Nice to meet you"],
    },
    generation_model: "integration-fixture",
    generation_status: status,
    generation_warnings: ["Integration fixture only"],
    reviewed_at: status === "ai_draft" ? null : new Date().toISOString(),
    reviewed_by: status === "ai_draft" ? null : ownerAId,
  };
}

function expectDeniedMutation(result: { error: unknown; data: unknown[] | null }) {
  expect(Boolean(result.error) || (result.data?.length ?? 0) === 0).toBe(true);
}

beforeAll(async () => {
  adminClient = client(SERVICE_ROLE_KEY);
  anonymousClient = client(SUPABASE_ANON_KEY);

  const ownerA = await createAuthenticatedOwner(ownerAEmail);
  const ownerB = await createAuthenticatedOwner(ownerBEmail);
  ownerAId = ownerA.id;
  ownerBId = ownerB.id;
  ownerAClient = ownerA.client;
  ownerBClient = ownerB.client;

  const { data: ownerAVideo, error: ownerAVideoError } = await ownerAClient
    .from("real_talk_videos")
    .insert(
      videoInsert({
        slug: `rt-rls-owner-a-${RUN_ID}`,
        youtubeId: VIDEO_IDS.ownerA,
        ownerId: ownerAId,
      }),
    )
    .select("id")
    .single();
  if (ownerAVideoError || !ownerAVideo) {
    throw new Error(
      `Owner A private video insert failed: ${ownerAVideoError?.message}`,
    );
  }
  ownerAVideoId = ownerAVideo.id;

  const { data: ownerAUnpaired, error: ownerAUnpairedError } =
    await ownerAClient
      .from("real_talk_videos")
      .insert(
        videoInsert({
          slug: `rt-rls-owner-a-unpaired-${RUN_ID}`,
          youtubeId: VIDEO_IDS.ownerAUnpaired,
          ownerId: ownerAId,
        }),
      )
      .select("id")
      .single();
  if (ownerAUnpairedError || !ownerAUnpaired) {
    throw new Error(
      `Owner A unpaired video insert failed: ${ownerAUnpairedError?.message}`,
    );
  }
  ownerAUnpairedVideoId = ownerAUnpaired.id;

  const { data: ownerBVideo, error: ownerBVideoError } = await ownerBClient
    .from("real_talk_videos")
    .insert(
      videoInsert({
        slug: `rt-rls-owner-b-${RUN_ID}`,
        youtubeId: VIDEO_IDS.ownerB,
        ownerId: ownerBId,
      }),
    )
    .select("id")
    .single();
  if (ownerBVideoError || !ownerBVideo) {
    throw new Error(
      `Owner B private video insert failed: ${ownerBVideoError?.message}`,
    );
  }
  ownerBVideoId = ownerBVideo.id;

  const { data: ownerALesson, error: ownerALessonError } = await ownerAClient
    .from("real_talk_lessons")
    .insert(lessonInsert(ownerAVideoId))
    .select("id")
    .single();
  if (ownerALessonError || !ownerALesson) {
    throw new Error(
      `Owner A private lesson insert failed: ${ownerALessonError?.message}`,
    );
  }
  ownerALessonId = ownerALesson.id;
}, 30_000);

afterAll(async () => {
  if (adminClient) {
    const videoIds = [ownerAVideoId, ownerAUnpairedVideoId, ownerBVideoId].filter(
      Boolean,
    );
    if (videoIds.length) {
      await adminClient.from("real_talk_lessons").delete().in("video_id", videoIds);
      await adminClient.from("real_talk_videos").delete().in("id", videoIds);
    }
    if (ownerAId) await adminClient.auth.admin.deleteUser(ownerAId);
    if (ownerBId) await adminClient.auth.admin.deleteUser(ownerBId);
  }
});

describe("Real Talk owner-private draft RLS", () => {
  it("denies anonymous draft insertion", async () => {
    const { error } = await anonymousClient.from("real_talk_videos").insert(
      videoInsert({
        slug: `rt-rls-anonymous-${RUN_ID}`,
        youtubeId: VIDEO_IDS.anonymous,
        ownerId: ownerAId,
      }),
    );

    expect(error).toBeTruthy();
  });

  it("allows owner A to reload their private video and lesson", async () => {
    const videoResult = await ownerAClient
      .from("real_talk_videos")
      .select("id, slug, is_public")
      .eq("id", ownerAVideoId)
      .single();
    const lessonResult = await ownerAClient
      .from("real_talk_lessons")
      .select("id, generation_status")
      .eq("id", ownerALessonId)
      .single();

    expect(videoResult.error).toBeNull();
    expect(videoResult.data).toMatchObject({
      id: ownerAVideoId,
      is_public: false,
    });
    expect(lessonResult.error).toBeNull();
    expect(lessonResult.data).toMatchObject({
      id: ownerALessonId,
      generation_status: "ai_draft",
    });
  });

  it("hides owner A private rows from owner B and anonymous users", async () => {
    const ownerBVideos = await ownerBClient
      .from("real_talk_videos")
      .select("id")
      .eq("id", ownerAVideoId);
    const ownerBLessons = await ownerBClient
      .from("real_talk_lessons")
      .select("id")
      .eq("id", ownerALessonId);
    const anonymousVideos = await anonymousClient
      .from("real_talk_videos")
      .select("id")
      .eq("id", ownerAVideoId);
    const anonymousLessons = await anonymousClient
      .from("real_talk_lessons")
      .select("id")
      .eq("id", ownerALessonId);

    expect(ownerBVideos.data).toEqual([]);
    expect(ownerBLessons.data).toEqual([]);
    expect(anonymousVideos.data).toEqual([]);
    expect(anonymousLessons.data).toEqual([]);
  });

  it("denies cross-owner video updates and deletes", async () => {
    const updateResult = await ownerBClient
      .from("real_talk_videos")
      .update({ title: "Cross-owner mutation" })
      .eq("id", ownerAVideoId)
      .select("id");
    const deleteResult = await ownerBClient
      .from("real_talk_videos")
      .delete()
      .eq("id", ownerAVideoId)
      .select("id");

    expectDeniedMutation(updateResult);
    expectDeniedMutation(deleteResult);
  });

  it("prevents an owner from publishing their own draft", async () => {
    const result = await ownerAClient
      .from("real_talk_videos")
      .update({ is_public: true })
      .eq("id", ownerAVideoId)
      .select("id");

    expectDeniedMutation(result);
  });

  it("prevents an owner from elevating a draft lesson review state", async () => {
    const result = await ownerAClient
      .from("real_talk_lessons")
      .update({
        generation_status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: ownerAId,
      })
      .eq("id", ownerALessonId)
      .select("id");

    expectDeniedMutation(result);
  });

  it("prevents insertion of a pre-reviewed or approved lesson", async () => {
    const { error } = await ownerAClient
      .from("real_talk_lessons")
      .insert(lessonInsert(ownerAUnpairedVideoId, "approved"));

    expect(error).toBeTruthy();
  });

  it("prevents owner B from writing a lesson through owner A's video", async () => {
    const { error } = await ownerBClient
      .from("real_talk_lessons")
      .insert(lessonInsert(ownerAUnpairedVideoId));

    expect(error).toBeTruthy();
  });

  it("keeps all private fixtures out of an anonymous public-catalog query", async () => {
    const { data, error } = await anonymousClient
      .from("real_talk_videos")
      .select("id")
      .eq("is_public", true)
      .in("id", [ownerAVideoId, ownerAUnpairedVideoId, ownerBVideoId]);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
