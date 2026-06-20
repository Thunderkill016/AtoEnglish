"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { SpeakingSessionSchema } from "@/lib/security/validation";

const speakingLimiter = createRateLimiter(20, 60 * 1000, "speaking");

interface SaveSpeakingSessionParams {
  practiceType: "shadowing" | "roleplay" | "journal";
  duration: number;
  transcript?: string | null;
  accuracyScore?: number | null;
  scenarioId?: string | null;
}

/**
 * Server Action lưu lại lịch sử một buổi luyện nói vào bảng speaking_sessions.
 */
export async function saveSpeakingSession(params: SaveSpeakingSessionParams) {
  try {
    // Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await speakingLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau."
      };
    }

    // Input Validation
    const validated = SpeakingSessionSchema.safeParse(params);
    if (!validated.success) {
      return {
        success: false,
        error: `Dữ liệu không hợp lệ: ${validated.error.issues.map(e => e.message).join(", ")}`
      };
    }
    const cleanParams = validated.data;

    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu lịch sử luyện nói."
      };
    }

    // 2. Chèn bản ghi mới
    const { error } = await supabase
      .from("speaking_sessions")
      .insert({
        user_id: user.id,
        practice_type: cleanParams.practiceType,
        duration: cleanParams.duration,
        transcript: cleanParams.transcript || null,
        accuracy_score: cleanParams.accuracyScore !== undefined ? cleanParams.accuracyScore : null,
        scenario_id: cleanParams.scenarioId || null
      });

    if (error) {
      return {
        success: false,
        error: `Lỗi lưu lịch sử: ${error.message}`
      };
    }

    // 3. Award XP for speaking practice + update streak
    const XP_BY_TYPE: Record<string, number> = {
      shadowing: 5,
      roleplay: 8,
      journal: 5,
    };
    const xpEarned = XP_BY_TYPE[cleanParams.practiceType] ?? 5;
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

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

    // Revalidate speaking + dashboard so XP and streak update immediately
    revalidatePath("/speaking");
    revalidatePath("/dashboard");

    return {
      success: true,
      xpEarned,
      message: `Đã lưu! +${xpEarned} XP`,
    };


  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}

/**
 * Server Action lấy danh sách lịch sử luyện nói gần đây của người dùng.
 */
export async function getRecentSpeakingSessions(limit: number = 5) {
  try {
    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lấy lịch sử luyện tập."
      };
    }

    // 2. Truy vấn
    const { data, error } = await supabase
      .from("speaking_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        error: `Lỗi truy vấn lịch sử: ${error.message}`
      };
    }

    return {
      success: true,
      sessions: data || []
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}
