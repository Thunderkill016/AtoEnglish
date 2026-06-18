"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { InMemoryRateLimiter } from "@/lib/security/rate-limit";
import { SpeakingSessionSchema } from "@/lib/security/validation";

const speakingLimiter = new InMemoryRateLimiter(20, 60 * 1000); // 20 requests/min

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
    const reqHeaders = headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = speakingLimiter.check(ip);
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
        error: `Dữ liệu không hợp lệ: ${validated.error.errors.map(e => e.message).join(", ")}`
      };
    }
    const cleanParams = validated.data;

    const supabase = createClient();
    
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

    // Revalidate trang speaking để cập nhật lịch sử trên sidebar
    revalidatePath("/speaking");

    return {
      success: true,
      message: "Lưu lịch sử luyện nói thành công!"
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
    const supabase = createClient();
    
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
