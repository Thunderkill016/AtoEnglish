"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { getQuizXp } from "@/lib/constants/xp-rewards";
import { awardXpAndUpdateStreak } from "@/lib/progress/award-xp";
import { getVnDateKey } from "@/lib/utils/vn-date";
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
 * Idempotent per (user, unit, VN day) — retry chỉ cộng thêm XP nếu điểm tốt hơn.
 */
export async function saveQuizResult(params: {
  unitId: string;
  score: number;
  total: number;
}) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await quizLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên." };
    }

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

    const pct = Math.round((clean.score / clean.total) * 100);
    const xpEarned = getQuizXp(pct);
    const quizDate = getVnDateKey();

    const { data: existing, error: fetchError } = await supabase
      .from("quiz_results")
      .select("id, xp_earned")
      .eq("user_id", user.id)
      .eq("unit_id", clean.unitId)
      .eq("quiz_date", quizDate)
      .maybeSingle();

    if (fetchError) {
      return { success: false, error: `Lỗi lưu kết quả: ${fetchError.message}` };
    }

    let xpDelta = 0;
    let awardedXp = xpEarned;

    if (!existing) {
      xpDelta = xpEarned;
      const { error: insertError } = await supabase.from("quiz_results").insert({
        user_id: user.id,
        unit_id: clean.unitId,
        score: clean.score,
        total: clean.total,
        pct,
        xp_earned: xpEarned,
        quiz_date: quizDate,
      });
      if (insertError) {
        return { success: false, error: `Lỗi lưu kết quả: ${insertError.message}` };
      }
    } else {
      awardedXp = Math.max(existing.xp_earned, xpEarned);
      if (xpEarned > existing.xp_earned) {
        xpDelta = xpEarned - existing.xp_earned;
      }

      const { error: updateError } = await supabase
        .from("quiz_results")
        .update({
          score: clean.score,
          total: clean.total,
          pct,
          xp_earned: awardedXp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .eq("user_id", user.id);

      if (updateError) {
        return { success: false, error: `Lỗi cập nhật kết quả: ${updateError.message}` };
      }
    }

    if (xpDelta > 0) {
      await awardXpAndUpdateStreak(supabase, user.id, xpDelta);
    }

    revalidatePath("/dashboard");
    revalidatePath("/progress");

    return {
      success: true,
      xpEarned: xpDelta > 0 ? xpDelta : 0,
      totalXpEarned: awardedXp,
      pct,
      improved: xpDelta > 0,
      alreadyRecorded: !!existing && xpDelta === 0,
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}