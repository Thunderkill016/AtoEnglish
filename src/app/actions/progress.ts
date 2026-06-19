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
          current_level: "A1", // Default level for new users
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

    // Lấy display_name từ bảng users
    const { data: profile } = await supabase
      .from("users")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    const displayName = profile?.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Học viên";

    return {
      success: true,
      progress: {
        user_id: user.id,
        current_level: data?.current_level || "A1",
        streak: data?.streak || 0,
        total_xp: data?.total_xp || 0,
        last_active_date: data?.last_active_date || null,
        display_name: displayName
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

/**
 * Server Action reset toàn bộ tiến trình của một unit (xóa progress và cards SRS liên quan).
 */
export async function resetUnitProgress(unitId: string) {
  try {
    const supabase = createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để thực hiện reset bài học."
      };
    }

    // 2. Xóa tiến trình bài học trong user_lesson_progress
    const { error: deleteProgressError } = await supabase
      .from("user_lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("unit_id", unitId);

    if (deleteProgressError) {
      return {
        success: false,
        error: `Lỗi khi xóa tiến trình: ${deleteProgressError.message}`
      };
    }

    // 3. Xóa các từ vựng thuộc Unit này trong bảng cards
    const vocabList = UNIT_VOCABULARY[unitId] || [];
    if (vocabList.length > 0) {
      const wordList = vocabList.map(v => v.word.toLowerCase().trim());
      const { error: deleteCardsError } = await supabase
        .from("cards")
        .delete()
        .eq("user_id", user.id)
        .in("word", wordList);

      if (deleteCardsError) {
        console.error("Lỗi khi xóa các thẻ từ vựng trong SRS:", deleteCardsError.message);
      }
    }

    // 4. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/flashcards");

    return {
      success: true,
      message: `Đã reset thành công toàn bộ tiến trình bài học ${unitId}.`
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
 * Server Action lấy thông tin Unit đang học hiện tại của người dùng.
 */
export async function getCurrentUnit() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Đối với người dùng chưa đăng nhập, mặc định hiển thị Unit 1 với progress 0%
    if (authError || !user) {
      return {
        success: true,
        unitId: "unit-1",
        title: "Unit 1: Greetings & Self-Introduction",
        description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh và thực hành phản xạ nói Shadowing / Roleplay.",
        currentPhase: "Pha 1: Input",
        progress: 0,
        completed: false,
        route: "/learn/unit-1"
      };
    }

    // 1. Lấy tất cả các unit đã hoàn thành của user
    const { data: completedLessons, error: dbError } = await supabase
      .from("user_lesson_progress")
      .select("unit_id")
      .eq("user_id", user.id);

    if (dbError) {
      return {
        success: false,
        error: `Lỗi truy vấn database: ${dbError.message}`
      };
    }

    const completedUnitIds = completedLessons?.map(l => l.unit_id) || [];
    const isUnit1Completed = completedUnitIds.includes("unit-1");
    const isUnit4Completed = completedUnitIds.includes("unit-4");

    // 2. Lấy danh sách từ vựng của tất cả các bài để so khớp xem thẻ nào đã được lưu
    const allWords = [
      ...(UNIT_VOCABULARY["unit-1"] || []).map(v => v.word.toLowerCase().trim()),
      ...(UNIT_VOCABULARY["unit-4"] || []).map(v => v.word.toLowerCase().trim())
    ];

    const { data: userCards, error: cardsError } = await supabase
      .from("cards")
      .select("word")
      .eq("user_id", user.id)
      .in("word", allWords);

    if (cardsError) {
      console.error("Lỗi lấy danh sách thẻ:", cardsError.message);
    }

    const savedWords = new Set(userCards?.map(c => c.word.toLowerCase().trim()) || []);

    // Tính toán trạng thái cho Unit 1
    const vocab1 = UNIT_VOCABULARY["unit-1"] || [];
    const savedCount1 = vocab1.filter(v => savedWords.has(v.word.toLowerCase().trim())).length;
    let progress1 = 0;
    let phase1 = "Pha 1: Input";
    if (savedCount1 > 0) {
      if (savedCount1 < vocab1.length) {
        progress1 = 40;
        phase1 = "Pha 2: Processing";
      } else {
        progress1 = 75;
        phase1 = "Pha 3: Output";
      }
    }

    const unit1Status = {
      unitId: "unit-1",
      title: "Unit 1: Greetings & Self-Introduction",
      description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh và thực hành phản xạ nói Shadowing / Roleplay.",
      currentPhase: isUnit1Completed ? "Hoàn thành" : phase1,
      progress: isUnit1Completed ? 100 : progress1,
      completed: isUnit1Completed,
      route: "/learn/unit-1"
    };

    // Tính toán trạng thái cho Unit 4
    const vocab4 = UNIT_VOCABULARY["unit-4"] || [];
    const savedCount4 = vocab4.filter(v => savedWords.has(v.word.toLowerCase().trim())).length;
    let progress4 = 0;
    let phase4 = "Pha 1: Input";
    if (savedCount4 > 0) {
      if (savedCount4 < vocab4.length) {
        progress4 = 40;
        phase4 = "Pha 2: Processing";
      } else {
        progress4 = 75;
        phase4 = "Pha 3: Output";
      }
    }

    const unit4Status = {
      unitId: "unit-4",
      title: "Unit 4: Technology & Society",
      description: "Phân tích cấu trúc câu nâng cao và ý nghĩa của động từ khuyết thiếu trong văn cảnh thời đại số. Thực hành diễn đạt ý kiến trái chiều về tiến bộ công nghệ.",
      currentPhase: isUnit4Completed ? "Hoàn thành" : phase4,
      progress: isUnit4Completed ? 100 : progress4,
      completed: isUnit4Completed,
      route: "/learn"
    };

    // 3. Quyết định unit đang học hiện tại
    let activeUnit = unit1Status;

    if (!unit1Status.completed && !unit4Status.completed) {
      // Cả hai unit chưa hoàn thành
      if (unit1Status.progress > 0 && unit4Status.progress > 0) {
        // Cả hai đều đang học dở: ưu tiên cái có tiến độ thấp hơn
        activeUnit = unit1Status.progress <= unit4Status.progress ? unit1Status : unit4Status;
      } else if (unit1Status.progress > 0) {
        activeUnit = unit1Status;
      } else if (unit4Status.progress > 0) {
        activeUnit = unit4Status;
      } else {
        // Cả hai đều chưa học gì: mặc định Unit 1
        activeUnit = unit1Status;
      }
    } else if (!unit1Status.completed) {
      activeUnit = unit1Status;
    } else if (!unit4Status.completed) {
      activeUnit = unit4Status;
    } else {
      // Cả hai đều đã hoàn thành: mặc định hiển thị Unit 4
      activeUnit = unit4Status;
    }

    return {
      success: true,
      ...activeUnit
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}
