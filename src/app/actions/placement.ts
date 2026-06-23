"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";

const placementLimiter = createRateLimiter(3, 60 * 60 * 1000, "placement-test"); // 3/hour

/**
 * Server Action lưu kết quả Placement Test và cập nhật current_level của user.
 */
export async function savePlacementResult(level: string, score: number) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await placementLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Vui lòng chờ trước khi làm lại test." };
    }

    const validLevels = ["A1", "A2", "B1", "B2"];
    if (!validLevels.includes(level) || typeof score !== "number" || score < 0 || score > 40) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    // Check if user already has a progress record
    const { data: existing } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, streak")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Existing user: only update level, preserve XP + streak
      const { error } = await supabase
        .from("user_progress")
        .update({ current_level: level, last_active_date: today })
        .eq("user_id", user.id);

      if (error) return { success: false, error: `Lỗi lưu kết quả: ${error.message}` };
    } else {
      // New user: create fresh record with placement score as seed XP
      const { error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          current_level: level,
          total_xp: score * 5, // 5 XP per correct — modest seed
          streak: 0,
          last_active_date: today,
        });

      if (error) return { success: false, error: `Lỗi lưu kết quả: ${error.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/roadmap");
    return { success: true, message: `Đã cập nhật level ${level} thành công!` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
