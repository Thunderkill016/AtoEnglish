"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import { z } from "zod";
import { updateLeagueXp } from "./leagues";

const challengeLimiter = createRateLimiter(10, 60 * 1000, "daily-challenge");

const ChallengeResultSchema = z.object({
  score: z.number().int().min(0).max(5),
  total: z.number().int().min(1).max(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function vnToday(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
}

function challengeXp(score: number): number {
  return 10 + score * 8;
}

export type TodayChallengeResult = {
  done: boolean;
  score?: number;
  total?: number;
  xpEarned?: number;
  date: string;
};

/**
 * Lấy kết quả challenge hôm nay từ DB (sync đa thiết bị).
 */
export async function getTodayChallengeResult(): Promise<TodayChallengeResult> {
  const today = vnToday();
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { done: false, date: today };

    const { data } = await supabase
      .from("challenge_results")
      .select("score, total, xp_earned")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .maybeSingle();

    if (!data) return { done: false, date: today };

    return {
      done: true,
      score: data.score,
      total: data.total,
      xpEarned: data.xp_earned,
      date: today,
    };
  } catch {
    return { done: false, date: today };
  }
}

/**
 * Lưu kết quả Daily Challenge và thưởng XP.
 * XP: 10 base + 8 per correct = max 50 XP. Một lần mỗi ngày (idempotent).
 */
export async function saveChallengeResult(params: {
  score: number;
  total: number;
  date: string;
}) {
  try {
    const rateErr = await checkActionRateLimit(challengeLimiter, "Yêu cầu quá thường xuyên.");
    if (rateErr) return { success: false, error: rateErr };

    const validated = ChallengeResultSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }
    const clean = validated.data;

    const today = vnToday();
    if (clean.date !== today) {
      return { success: false, error: "Ngày không hợp lệ." };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    const { data: existing } = await supabase
      .from("challenge_results")
      .select("score, total, xp_earned")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        xpEarned: existing.xp_earned,
        alreadyCompleted: true,
        score: existing.score,
      };
    }

    const xpEarned = challengeXp(clean.score);

    const { error: insertError } = await supabase.from("challenge_results").insert({
      user_id: user.id,
      score: clean.score,
      total: clean.total,
      xp_earned: xpEarned,
      challenge_date: today,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: raced } = await supabase
          .from("challenge_results")
          .select("score, xp_earned")
          .eq("user_id", user.id)
          .eq("challenge_date", today)
          .maybeSingle();
        return {
          success: true,
          xpEarned: raced?.xp_earned ?? xpEarned,
          alreadyCompleted: true,
          score: raced?.score ?? clean.score,
        };
      }
      return { success: false, error: insertError.message };
    }

    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("total_xp, streak, last_active_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userProgress) {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      const yesterday = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      let nextStreak = 1;
      if (userProgress.last_active_date === today) {
        nextStreak = userProgress.streak;
      } else if (userProgress.last_active_date === yesterday) {
        nextStreak = userProgress.streak + 1;
      }
      await supabase
        .from("user_progress")
        .update({
          total_xp: userProgress.total_xp + xpEarned,
          streak: nextStreak,
          last_active_date: today,
        })
        .eq("user_id", user.id);
    } else {
      await supabase.from("user_progress").insert({
        user_id: user.id,
        current_level: "A0",
        streak: 1,
        total_xp: xpEarned,
        last_active_date: today,
      });
    }

    void updateLeagueXp(xpEarned);

    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/challenge");

    return { success: true, xpEarned, score: clean.score };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function getChallengeLevel(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "A1";
    const { data } = await supabase
      .from("user_progress")
      .select("current_level")
      .eq("user_id", user.id)
      .maybeSingle();
    return data?.current_level ?? "A1";
  } catch {
    return "A1";
  }
}