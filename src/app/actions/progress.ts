"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import { headers } from "next/headers";
import { InMemoryRateLimiter } from "@/lib/security/rate-limit";
import { CompleteUnitSchema } from "@/lib/security/validation";

const completeUnitLimiter = new InMemoryRateLimiter(10, 60 * 1000); // 10 requests/min

/**
 * Server Action xử lý khi người dùng hoàn thành một Unit học tập.
 * Cộng 80 XP, cập nhật streak, lưu tất cả từ vựng trong unit vào SRS (nếu chưa có).
 */
export async function completeUnit(unitId: string) {
  try {
    // Rate Limiting
    const reqHeaders = headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = completeUnitLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau."
      };
    }

    // Input Validation
    const validated = CompleteUnitSchema.safeParse({ unitId });
    if (!validated.success) {
      return {
        success: false,
        error: `Dữ liệu không hợp lệ: ${validated.error.issues.map(e => e.message).join(", ")}`
      };
    }
    const cleanParams = validated.data;

    const supabase = createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để hoàn thành chương học."
      };
    }

    // Lấy ngày hôm nay dưới dạng YYYY-MM-DD theo múi giờ Việt Nam
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    // 2. Kiểm tra xem unit này đã được hoàn thành chưa (tránh cộng XP trùng)
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("unit_id", cleanParams.unitId)
      .maybeSingle();

    if (progressError) {
      return {
        success: false,
        error: `Lỗi kiểm tra lịch sử học tập: ${progressError.message}`
      };
    }

    if (existingProgress) {
      return {
        success: true,
        message: "Unit này đã được bạn hoàn thành trước đó.",
        alreadyCompleted: true
      };
    }

    // 3. Tiến hành insert bản ghi hoàn thành vào user_lesson_progress
    const { error: insertProgressError } = await supabase
      .from("user_lesson_progress")
      .insert({
        user_id: user.id,
        unit_id: cleanParams.unitId,
        xp_earned: 80
      });

    if (insertProgressError) {
      return {
        success: false,
        error: `Lỗi lưu tiến trình bài học: ${insertProgressError.message}`
      };
    }

    // 4. Cộng XP và cập nhật streak trong user_progress
    const { data: userProgress, error: fetchProgressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchProgressError) {
      return {
        success: false,
        error: `Lỗi truy vấn tiến trình người dùng: ${fetchProgressError.message}`
      };
    }

    let nextStreak = 1;
    let totalXp = 80;

    if (!userProgress) {
      // Nếu chưa có tiến trình người dùng, tạo bản ghi mới
      const { error: createProgressError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          current_level: "B1",
          streak: 1,
          total_xp: 80,
          last_active_date: today
        });

      if (createProgressError) {
        return {
          success: false,
          error: `Lỗi tạo mới tiến trình người dùng: ${createProgressError.message}`
        };
      }
    } else {
      // Nếu đã có tiến trình, tính toán streak
      totalXp = userProgress.total_xp + 80;
      const lastActive = userProgress.last_active_date;

      if (!lastActive) {
        nextStreak = 1;
      } else {
        // Tính ngày hôm qua
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        const yesterday = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

        if (lastActive === today) {
          // Làm nhiều bài trong cùng 1 ngày, giữ nguyên streak
          nextStreak = userProgress.streak;
        } else if (lastActive === yesterday) {
          // Làm bài liên tiếp ngày tiếp theo, tăng streak
          nextStreak = userProgress.streak + 1;
        } else {
          // Cách ngày không học, reset streak về 1
          nextStreak = 1;
        }
      }

      const { error: updateProgressError } = await supabase
        .from("user_progress")
        .update({
          total_xp: totalXp,
          streak: nextStreak,
          last_active_date: today
        })
        .eq("user_id", user.id);

      if (updateProgressError) {
        return {
          success: false,
          error: `Lỗi cập nhật tiến trình người dùng: ${updateProgressError.message}`
        };
      }
    }

    // 5. Tự động thêm tất cả từ vựng trong unit này vào bảng cards (nếu chưa có)
    const vocabList = UNIT_VOCABULARY[cleanParams.unitId] || [];
    let addedCount = 0;

    if (vocabList.length > 0) {
      for (const vocab of vocabList) {
        const formattedWord = vocab.word.toLowerCase().trim();
        
        const { data: existingCard, error: selectCardError } = await supabase
          .from("cards")
          .select("id")
          .eq("user_id", user.id)
          .eq("word", formattedWord)
          .maybeSingle();

        if (!selectCardError && !existingCard) {
          const { error: insertCardError } = await supabase
            .from("cards")
            .insert({
              user_id: user.id,
              word: formattedWord,
              phonetic: vocab.phonetic,
              meaning_vn: vocab.meaning_vn,
              example_en: vocab.example_en,
              topic: vocab.topic,
              level: vocab.level,
              interval: 0,
              ease_factor: 2.5,
              repetitions: 0,
              due_date: new Date().toISOString(), // Lên lịch ôn ngay hôm nay
              state: 0,
              difficulty: 0.0,
              stability: 0.0,
              last_review: null,
              next_review: new Date().toISOString(),
            });

          if (!insertCardError) {
            addedCount++;
          }
        }
      }
    }

    // 6. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/flashcards");

    return {
      success: true,
      message: `Hoàn thành bài học thành công! Bạn nhận được 80 XP.`,
      xpEarned: 80,
      newStreak: nextStreak,
      vocabAddedCount: addedCount
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
 * Server Action lấy trạng thái hoàn thành của một unit cụ thể.
 */
export async function getUnitCompletionStatus(unitId: string) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, completed: false };
    }

    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("id, completed_at, xp_earned")
      .eq("user_id", user.id)
      .eq("unit_id", unitId)
      .maybeSingle();

    if (error) {
      return { success: false, completed: false };
    }

    return {
      success: true,
      completed: !!data,
      completedAt: data?.completed_at || null,
      xpEarned: data?.xp_earned || 0
    };
  } catch {
    return { success: false, completed: false };
  }
}

/**
 * Server Action lấy thông tin tiến trình tổng thể của người dùng (streak, XP, level).
 */
export async function getUserProgress() {
  try {
    const supabase = createClient();
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

    return {
      success: true,
      progress: data || {
        user_id: user.id,
        current_level: "B1",
        streak: 0,
        total_xp: 0,
        last_active_date: null
      }
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}

/**
 * Server Action lấy số lượng unit đã hoàn thành của user.
 */
export async function getCompletedUnitsCount() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, count: 0 };
    }

    const { count, error } = await supabase
      .from("user_lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, count: 0 };
    }

    return { success: true, count: count || 0 };
  } catch {
    return { success: false, count: 0 };
  }
}

