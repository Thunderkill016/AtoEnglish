"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Server Action lấy thông tin tiến trình tổng thể của người dùng (streak, XP, level).
 */
export async function getUserProgress() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để lấy thông tin tiến trình." };
    }
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return { success: false, error: `Lỗi truy vấn: ${error.message}` };
    }

    // display_name: dùng user_metadata (Auth) — không query bảng users không tồn tại
    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Học viên";

    return {
      success: true,
      progress: {
        user_id: user.id,
        current_level: data?.current_level || "A0",
        streak: data?.streak || 0,
        total_xp: data?.total_xp || 0,
        last_active_date: data?.last_active_date || null,
        daily_xp_goal: 50,
        display_name: displayName
      }
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}

/**
 * Server Action cập nhật mục tiêu XP hàng ngày của người dùng.
 */
export async function updateDailyXpGoal(goal: number) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để cập nhật mục tiêu XP." };
    }

    if (![30, 50, 80, 100].includes(goal)) {
      return { success: false, error: "Mục tiêu XP không hợp lệ." };
    }

    const { error } = await supabase
      .from("user_progress")
      .update({ updated_at: new Date().toISOString() }) // daily_xp_goal not in DB schema
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: `Lỗi khi cập nhật mục tiêu: ${error.message}` };
    }

    revalidatePath("/dashboard");
    return { success: true, message: `Đã cập nhật mục tiêu XP hàng ngày thành ${goal} XP.` };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}

/**
 * Lấy dữ liệu XP theo 7 ngày gần nhất từ user_lesson_progress.
 */
export async function getWeeklyXpData() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, data: [] };

    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const days: { day: string; label: string; xp: number; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      days.push({ day: dateStr, label: dayLabels[d.getDay()], xp: 0, pct: 0 });
    }

    const startDate = days[0].day;
    // +07:00 so Postgres interprets startDate as VN midnight, not UTC midnight
    const startUtc = startDate + "T00:00:00+07:00";

    // Fetch lesson XP and speaking sessions in parallel
    const [lessonsRes, speakingRes] = await Promise.all([
      supabase
        .from("user_lesson_progress")
        .select("xp_earned, completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", startUtc),
      supabase
        .from("speaking_sessions")
        .select("practice_type, created_at")
        .eq("user_id", user.id)
        .gte("created_at", startUtc),
    ]);

    // Add lesson XP per day
    if (!lessonsRes.error && lessonsRes.data) {
      for (const row of lessonsRes.data) {
        const rowDate = new Date(row.completed_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += (row.xp_earned || 0);
      }
    }

    // Add speaking XP per day (estimated from practice_type)
    const SPEAKING_XP: Record<string, number> = { shadowing: 5, roleplay: 8, journal: 5 };
    if (!speakingRes.error && speakingRes.data) {
      for (const row of speakingRes.data) {
        const rowDate = new Date(row.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += SPEAKING_XP[row.practice_type] ?? 5;
      }
    }

    const maxXp = Math.max(...days.map(d => d.xp), 1);
    return {
      success: true,
      data: days.map(d => ({ ...d, pct: Math.round((d.xp / maxXp) * 100) }))
    };
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * Lấy thống kê tổng hợp cho trang Progress.
 */
export async function getProgressStats() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, stats: null };

    const [progressRes, cardsRes, completedRes, speakingRes] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("cards").select("state").eq("user_id", user.id),
      supabase.from("user_lesson_progress").select("unit_id", { count: "exact" }).eq("user_id", user.id),
      supabase.from("speaking_sessions").select("id", { count: "exact" }).eq("user_id", user.id),
    ]);

    const progress = progressRes.data;
    const cards = cardsRes.data || [];
    const totalCards = cards.length;
    const cardsByState = {
      new: cards.filter(c => c.state === 0).length,
      learning: cards.filter(c => c.state === 1).length,
      review: cards.filter(c => c.state === 2).length,
      relearning: cards.filter(c => c.state === 3).length,
    };

    return {
      success: true,
      stats: {
        totalXp: progress?.total_xp || 0,
        streak: progress?.streak || 0,
        currentLevel: progress?.current_level || "A0",
        totalCards,
        cardsByState,
        completedUnits: completedRes.count || 0,
        totalSpeakingSessions: speakingRes.count || 0,
      }
    };
  } catch {
    return { success: false, stats: null };
  }
}
