"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { z } from "zod";

const quizLimiter = createRateLimiter(30, 60 * 1000, "quiz");

const QuizResultSchema = z.object({
  unitId: z.string().min(1).max(20),
  score: z.number().int().min(0),
  total: z.number().int().min(1).max(50),
});

/**
 * Server Action: lưu kết quả quiz từ vựng và thưởng XP theo điểm số.
 * XP scale: ≥80% → 15 XP | 50-79% → 10 XP | <50% → 5 XP
 */
export async function saveQuizResult(params: {
  unitId: string;
  score: number;
  total: number;
}) {
  try {
    // Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await quizLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên." };
    }

    // Input Validation
    const validated = QuizResultSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }
    const clean = validated.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    // XP scales with performance
    const pct = Math.round((clean.score / clean.total) * 100);
    const xpEarned = pct >= 80 ? 15 : pct >= 50 ? 10 : 5;
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    // Update user_progress: add XP + maintain streak (best-effort)
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("total_xp, streak, last_active_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userProgress) {
      const lastActive = userProgress.last_active_date;
      let nextStreak = 1;
      if (lastActive === today) {
        nextStreak = userProgress.streak;
      } else {
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        const yesterday = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        nextStreak = lastActive === yesterday ? userProgress.streak + 1 : 1;
      }
      await supabase
        .from("user_progress")
        .update({
          total_xp: userProgress.total_xp + xpEarned,
          streak: nextStreak,
          last_active_date: today,
        })
        .eq("user_id", user.id);
    }

    revalidatePath("/dashboard");

    return { success: true, xpEarned, pct };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
