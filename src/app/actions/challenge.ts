"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { z } from "zod";
import { updateLeagueXp } from "./leagues";

const challengeLimiter = createRateLimiter(10, 60 * 1000, "daily-challenge");

const ChallengeResultSchema = z.object({
  score: z.number().int().min(0).max(5),
  total: z.number().int().min(1).max(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
});

/**
 * Lưu kết quả Daily Challenge và thưởng XP.
 * XP: 10 base + 8 per correct answer = max 50 XP (5 correct).
 * Chỉ thưởng 1 lần mỗi ngày — date được validate server-side.
 */
export async function saveChallengeResult(params: {
  score: number;
  total: number;
  date: string;
}) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await challengeLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên." };
    }

    const validated = ChallengeResultSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }
    const clean = validated.data;

    // Server-side date check — must match today (Vietnam time)
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (clean.date !== today) {
      return { success: false, error: "Ngày không hợp lệ." };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    // XP formula: 10 base + 8 per correct = 10–50 XP
    const xpEarned = 10 + clean.score * 8;

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

    // Bump weekly league XP (fire-and-forget)
    void updateLeagueXp(xpEarned);

    revalidatePath("/dashboard");
    revalidatePath("/progress");

    return { success: true, xpEarned };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Lấy trình độ hiện tại của user để xây daily challenge đúng level.
 */
export async function getChallengeLevel(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
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
