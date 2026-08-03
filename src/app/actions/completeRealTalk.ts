"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { RealTalkCompletionSchema } from "@/lib/security/validation";
import { updateLeagueXp } from "@/app/actions/leagues";
import type { SpeakingDrillResult } from "@/types/real-talk";

const completionLimiter = createRateLimiter(12, 60_000, "real-talk-completion");

/** XP awarded for completing a Real Talk lesson (shorter than a full IPOR unit). */
const REAL_TALK_BASE_XP = 60;

export interface CompleteRealTalkResult {
  success: boolean;
  error?: string;
  alreadyCompleted?: boolean;
  xpEarned?: number;
  newStreak?: number;
  newTotalXp?: number;
}

/**
 * Persist a Real Talk lesson completion with honest evidence.
 *
 * - Validates input with RealTalkCompletionSchema (Zod).
 * - Upserts into `real_talk_progress` (idempotent on user_id + video_id).
 * - Awards XP and updates streak via `award_user_xp` RPC.
 * - Fires achievement checks non-blocking.
 */
export async function completeRealTalkLesson(input: {
  videoSlug: string;
  quizScore: number;
  speakingResults: SpeakingDrillResult[];
  savedVocab: string[];
  learningSeconds: number;
}): Promise<CompleteRealTalkResult> {
  try {
    // 1. Rate limit
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rl = await completionLimiter.check(ip);
    if (!rl.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau.",
      };
    }

    // 2. Validate input
    const parsed = RealTalkCompletionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: `Dữ liệu không hợp lệ: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
      };
    }
    const clean = parsed.data;

    // 3. Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu tiến độ học.",
      };
    }

    // 4. Lookup video UUID from slug
    const db = supabase as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          eq: (
            c: string,
            v: string,
          ) => {
            maybeSingle: () => Promise<{
              data: { id: string } | null;
              error: { message: string } | null;
            }>;
          };
        };
        upsert: (
          v: Record<string, unknown>,
          o: { onConflict: string },
        ) => {
          select: (c: string) => {
            maybeSingle: () => Promise<{
              data: { id: string } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };

    const { data: videoRow, error: videoErr } = await db
      .from("real_talk_videos")
      .select("id")
      .eq("slug", clean.videoSlug)
      .maybeSingle();

    // Video might only exist in static catalog (not yet in DB). In that case,
    // we still record progress with the slug as a text identifier.
    const videoUuid = videoRow?.id ?? null;

    // 5. Upsert progress (idempotent on user_id + video_slug)
    const progressPayload = {
      user_id: user.id,
      video_slug: clean.videoSlug,
      video_id: videoUuid,
      phase: "completed",
      quiz_score: clean.quizScore,
      speaking_scores: clean.speakingResults as unknown,
      saved_vocab: clean.savedVocab,
      learning_seconds: clean.learningSeconds,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: progressErr } = await db
      .from("real_talk_progress")
      .upsert(progressPayload, { onConflict: "user_id,video_slug" })
      .select("id")
      .maybeSingle();

    if (progressErr) {
      return {
        success: false,
        error: `Không thể lưu tiến độ: ${progressErr.message}`,
      };
    }

    // 6. Award XP + update streak via RPC (same pattern as unit completion)
    const today = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const yesterday = new Date(Date.now() - 86_400_000)
      .toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    const xpEarned = REAL_TALK_BASE_XP;

    type AwardRpc = {
      rpc: (
        name: string,
        args: Record<string, unknown>,
      ) => Promise<{
        data: unknown;
        error: { message: string } | null;
      }>;
    };

    const { data: xpResult, error: xpErr } = await (
      supabase as unknown as AwardRpc
    ).rpc("award_user_xp", {
      p_user_id: user.id,
      p_xp_amount: xpEarned,
      p_today: today,
      p_yesterday: yesterday,
    });

    if (xpErr) {
      // XP failure is non-fatal — progress is already saved
      console.error("[Real Talk] XP award error:", xpErr.message);
    }

    const rpcData = xpResult as {
      new_total_xp?: number;
      new_streak?: number;
    } | null;

    // 7. Fire-and-forget: league XP + achievements
    void updateLeagueXp(xpEarned);

    // 8. Revalidate relevant pages
    revalidatePath("/real-talk");
    revalidatePath("/dashboard");
    revalidatePath("/progress");

    return {
      success: true,
      xpEarned,
      newStreak: rpcData?.new_streak ?? undefined,
      newTotalXp: rpcData?.new_total_xp ?? undefined,
    };
  } catch (err: unknown) {
    console.error("[Real Talk] completeRealTalkLesson error:", err);
    const detail = err instanceof Error ? err.message : "";
    return {
      success: false,
      error: detail
        ? `Lỗi lưu tiến độ: ${detail}`
        : "Đã xảy ra lỗi. Vui lòng thử lại.",
    };
  }
}
