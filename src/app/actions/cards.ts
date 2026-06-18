"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { reviewCardFSRS } from "@/lib/srs/fsrs";
import { Card } from "@/types/database";

interface SaveCardParams {
  word: string;
  phonetic?: string | null;
  meaning_vn: string;
  example_en?: string | null;
  topic?: string | null;
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
}

/**
 * Server Action lưu một từ vựng mới vào bảng cards (SRS) của người dùng.
 */
export async function saveCardToSRS(params: SaveCardParams) {
  try {
    const supabase = createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập của người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu từ vựng vào hệ thống SRS."
      };
    }
    
    const formattedWord = params.word.toLowerCase().trim();
    
    // 2. Kiểm tra xem từ này đã tồn tại trong danh sách của user chưa
    const { data: existingCard, error: selectError } = await supabase
      .from("cards")
      .select("id, word")
      .eq("user_id", user.id)
      .eq("word", formattedWord)
      .maybeSingle();
      
    if (selectError) {
      return {
        success: false,
        error: `Lỗi kiểm tra thẻ trùng lặp: ${selectError.message}`
      };
    }
    
    if (existingCard) {
      return {
        success: true,
        message: `Từ "${params.word}" đã được lưu trong tủ thẻ của bạn trước đây.`,
        existed: true
      };
    }
    
    // 3. Nếu chưa có, tiến hành chèn bản ghi mới
    const { error: insertError } = await supabase
      .from("cards")
      .insert({
        user_id: user.id,
        word: formattedWord,
        phonetic: params.phonetic || null,
        meaning_vn: params.meaning_vn,
        example_en: params.example_en || null,
        topic: params.topic || "General",
        level: params.level || "B1",
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
      
    if (insertError) {
      return {
        success: false,
        error: `Lỗi khi lưu thẻ mới: ${insertError.message}`
      };
    }
    
    // Làm mới cache các route liên quan
    revalidatePath("/dashboard");
    revalidatePath("/flashcards");
    revalidatePath("/learn");
    
    return {
      success: true,
      message: `Lưu từ "${params.word}" vào hộp thẻ SRS thành công!`,
      existed: false
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
 * Server Action lấy tất cả thẻ cần ôn tập hôm nay (due_date <= hiện tại) của user
 */
export async function getDueCards() {
  try {
    const supabase = createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lấy các thẻ ôn tập đến hạn."
      };
    }
    
    const now = new Date().toISOString();
    
    // 2. Query lấy thẻ của user hiện tại có due_date <= now, sắp xếp theo due_date tăng dần
    const { data: cards, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .lte("due_date", now)
      .order("due_date", { ascending: true });
      
    if (error) {
      return {
        success: false,
        error: `Lỗi truy vấn thẻ đến hạn: ${error.message}`
      };
    }
    
    return {
      success: true,
      cards: cards || []
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống khi lấy thẻ: ${errorMessage}`
    };
  }
}

/**
 * Server Action chấm điểm độ nhớ của thẻ từ vựng và lên lịch ôn tập theo thuật toán SM-2 (SuperMemo-2)
 */
export async function reviewCard(cardId: string, rating: "Again" | "Hard" | "Good" | "Easy") {
  try {
    const supabase = createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để thực hiện đánh giá thẻ."
      };
    }
    
    // 2. Lấy dữ liệu thẻ hiện tại của user
    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("id, interval, ease_factor, repetitions, state, difficulty, stability, last_review, next_review, due_date")
      .eq("id", cardId)
      .eq("user_id", user.id)
      .single();
      
    if (fetchError || !card) {
      return {
        success: false,
        error: `Không thể tìm thấy thẻ: ${fetchError?.message || "Thẻ không thuộc về user này"}`
      };
    }
    
    // 3. Áp dụng thuật toán FSRS
    const fsrsUpdates = reviewCardFSRS(card as unknown as Card, rating);
    
    // 4. Cập nhật các chỉ số mới vào Database
    const { error: updateError } = await supabase
      .from("cards")
      .update({
        // FSRS fields
        state: fsrsUpdates.state,
        difficulty: fsrsUpdates.difficulty,
        stability: fsrsUpdates.stability,
        last_review: fsrsUpdates.last_review,
        next_review: fsrsUpdates.next_review,

        // SM-2 fields (giữ tương thích)
        interval: fsrsUpdates.interval,
        repetitions: fsrsUpdates.repetitions,
        due_date: fsrsUpdates.due_date,
        last_reviewed: fsrsUpdates.last_reviewed,
      })
      .eq("id", cardId)
      .eq("user_id", user.id);
      
    if (updateError) {
      return {
        success: false,
        error: `Lỗi cập nhật tiến trình thẻ: ${updateError.message}`
      };
    }
    
    // Refresh cache các route liên quan
    revalidatePath("/dashboard");
    revalidatePath("/flashcards");
    
    return {
      success: true,
      message: `Đã đánh giá "${rating}". Lên lịch ôn tiếp theo sau ${fsrsUpdates.interval} ngày.`,
      next_interval: fsrsUpdates.interval,
      next_due_date: fsrsUpdates.next_review,
      debug: fsrsUpdates.debug,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống khi đánh giá thẻ: ${errorMessage}`
    };
  }
}
