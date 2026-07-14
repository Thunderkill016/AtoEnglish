"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { reviewCardFSRS } from "@/lib/srs/fsrs";
import { Card } from "@/types/database";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import {
  SaveCardSchema,
  ReviewCardSchema,
  SeedVocabSchema,
  SeedV2LessonLexisSchema,
  WrongWordsSchema,
} from "@/lib/security/validation";
import { getLessonV2 } from "@/lib/v2/lessons";
import { lessonToSeedVocab } from "@/lib/v2/seed-lexis";

const saveCardLimiter = createRateLimiter(60, 60 * 1000, "save-card");
const reviewCardLimiter = createRateLimiter(60, 60 * 1000, "review-card");
const seedVocabLimiter = createRateLimiter(20, 60 * 1000, "seed-vocab");
const seedV2LexisLimiter = createRateLimiter(20, 60 * 1000, "seed-v2-lexis");
const wrongWordsLimiter = createRateLimiter(30, 60 * 1000, "wrong-words");

interface SaveCardParams {
  word: string;
  phonetic?: string | null;
  meaning_vn: string;
  example_en?: string | null;
  topic?: string | null;
  level?: "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
}

/**
 * Server Action lưu một từ vựng mới vào bảng cards (SRS) của người dùng.
 */
export async function saveCardToSRS(params: SaveCardParams) {
  try {
    // Rate Limiting
    const rateErr = await checkActionRateLimit(saveCardLimiter, "Yêu cầu quá thường xuyên. Vui lòng thử lại sau.");
    if (rateErr) {
      return {
        success: false,
        error: rateErr
      };
    }

    // Input Validation
    const validated = SaveCardSchema.safeParse(params);
    if (!validated.success) {
      return {
        success: false,
        error: `Dữ liệu không hợp lệ: ${validated.error.issues.map(e => e.message).join(", ")}`
      };
    }
    const cleanParams = validated.data;

    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập của người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu từ vựng vào hệ thống SRS."
      };
    }
    
    const formattedWord = cleanParams.word.toLowerCase().trim();
    
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
        message: `Từ "${cleanParams.word}" đã được lưu trong tủ thẻ của bạn trước đây.`,
        existed: true
      };
    }
    
    // 3. Nếu chưa có, tiến hành chèn bản ghi mới
    const { error: insertError } = await supabase
      .from("cards")
      .insert({
        user_id: user.id,
        word: formattedWord,
        phonetic: cleanParams.phonetic || null,
        meaning_vn: cleanParams.meaning_vn,
        example_en: cleanParams.example_en || null,
        topic: cleanParams.topic || "General",
        level: cleanParams.level || "A1",
        interval: 0,
        repetitions: 0,
        due_date: new Date().toISOString(),
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
 * Server Action lấy tất cả thẻ cần ôn tập hôm nay (due_date <= hiện tại) của user.
 * Giới hạn thẻ MỚI (state=0) tối đa MAX_NEW_PER_DAY để tránh bị ngập trong thẻ mới.
 */
export async function getDueCards(maxNewCards?: number) {
  const MAX_NEW_PER_DAY = maxNewCards ?? 15; // Maximum new (unseen) cards per review session
  try {
    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lấy các thẻ ôn tập đến hạn."
      };
    }
    
    const now = new Date().toISOString();
    
    // 2. Fetch review cards (state >= 1, due today) + new cards (state = 0) separately
    const [reviewRes, newRes] = await Promise.all([
      // Cards previously seen — always include when due
      supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .gte("state", 1)
        .lte("due_date", now)
        .order("due_date", { ascending: true }),
      // Unseen cards — cap at MAX_NEW_PER_DAY
      supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .eq("state", 0)
        .lte("due_date", now)
        .order("due_date", { ascending: true })
        .limit(MAX_NEW_PER_DAY),
    ]);
    
    if (reviewRes.error) {
      return {
        success: false,
        error: `Lỗi truy vấn thẻ đến hạn: ${reviewRes.error.message}`
      };
    }
    
    // Merge: review cards first (higher priority), then new cards
    const cards = [...(reviewRes.data ?? []), ...(newRes.data ?? [])];
    
    return {
      success: true,
      cards
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
 * Lấy tối đa N thẻ đến hạn ôn tập để hiển thị ở phần Khởi động (SRS warm-up).
 * Chỉ lấy state >= 1 (đã từng học, không lấy thẻ mới hoàn toàn).
 */
export async function getDueWarmupCards(limit: number = 5) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, cards: [] };

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("cards")
      .select("id, word, phonetic, meaning_vn, example_en")
      .eq("user_id", user.id)
      .gte("state", 1)          // Only cards that have been seen before (not brand new)
      .lte("due_date", now)     // Only cards that are due
      .order("due_date", { ascending: true })
      .limit(limit);

    if (error) return { success: false, cards: [] };
    return { success: true, cards: data || [] };
  } catch {
    return { success: false, cards: [] };
  }
}

/**
 * Server Action chấm điểm độ nhớ của thẻ từ vựng và lên lịch ôn tập theo thuật toán SM-2 (SuperMemo-2)
 */
export async function reviewCard(
  cardId: string,
  rating: "Again" | "Hard" | "Good" | "Easy",
  retentionRate?: number
) {
  try {
    // Rate Limiting
    const rateErr = await checkActionRateLimit(reviewCardLimiter, "Yêu cầu quá thường xuyên. Vui lòng thử lại sau.");
    if (rateErr) {
      return {
        success: false,
        error: rateErr
      };
    }

    // Input Validation
    const validated = ReviewCardSchema.safeParse({ cardId, rating, retentionRate });
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
        error: "Bạn cần đăng nhập để thực hiện đánh giá thẻ."
      };
    }
    
    // 2. Lấy dữ liệu thẻ hiện tại của user
    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("id, interval, repetitions, state, difficulty, stability, last_review, next_review, due_date")
      .eq("id", cleanParams.cardId)
      .eq("user_id", user.id)
      .single();
      
    if (fetchError || !card) {
      return {
        success: false,
        error: `Không thể tìm thấy thẻ: ${fetchError?.message || "Thẻ không thuộc về user này"}`
      };
    }
    
    // 3. Áp dụng thuật toán FSRS
    const fsrsUpdates = reviewCardFSRS(card as unknown as Card, cleanParams.rating, cleanParams.retentionRate);
    
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
      })
      .eq("id", cleanParams.cardId)
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

    // 5. Lưu ReviewLog để tối ưu hóa tham số FSRS theo từng người dùng (best-effort)
    void supabase
      .from("card_review_logs")
      .insert({
        user_id: user.id,
        card_id: cleanParams.cardId,
        rating: fsrsUpdates.reviewLog.rating,
        state: fsrsUpdates.reviewLog.state,
        due: fsrsUpdates.reviewLog.due,
        stability: fsrsUpdates.reviewLog.stability,
        difficulty: fsrsUpdates.reviewLog.difficulty,
        elapsed_days: fsrsUpdates.reviewLog.elapsed_days,
        scheduled_days: fsrsUpdates.reviewLog.scheduled_days,
        review: fsrsUpdates.reviewLog.review,
      }); // fire-and-forget — non-blocking, silent fail OK

    return {
      success: true,
      message: `Đã đánh giá "${cleanParams.rating}". Lên lịch ôn tiếp theo sau ${fsrsUpdates.interval} ngày.`,
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

/**
 * Lấy TẤT CẢ thẻ của user (Cram Mode - không lọc theo due_date).
 */
export async function getAllCards(topic?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập.", cards: [] };
    }

    let query = supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .order("word", { ascending: true });

    if (topic) {
      query = query.eq("topic", topic);
    }

    const { data: cards, error } = await query;
    if (error) return { success: false, error: error.message, cards: [] };
    return { success: true, cards: cards || [] };
  } catch (err) {
    return { success: false, error: String(err), cards: [] };
  }
}

/**
 * Lấy danh sách topics của user từ bảng cards.
 */
export async function getCardTopics() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, topics: [] };

    const { data, error } = await supabase
      .from("cards")
      .select("topic")
      .eq("user_id", user.id);

    if (error) return { success: false, topics: [] };
    const topics = Array.from(new Set((data || []).map(c => c.topic).filter((t): t is string => !!t)));
    return { success: true, topics };
  } catch {
    return { success: false, topics: [] };
  }
}

/**
 * Tự động thêm toàn bộ từ vựng của một unit vào FSRS sau khi hoàn thành bài học.
 * Bỏ qua từ đã tồn tại (ON CONFLICT DO NOTHING). Fire-and-forget friendly.
 */
export async function seedUnitVocabToSRS(params: {
  vocab: Array<{ word: string; phonetic?: string | null; meaning_vn: string; example_en?: string | null }>;
  topic: string;
  level?: "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
}) {
  try {
    const rateErr = await checkActionRateLimit(seedVocabLimiter);
    if (rateErr) return { success: false, added: 0 };

    const validated = SeedVocabSchema.safeParse(params);
    if (!validated.success) return { success: false, added: 0 };
    const { vocab, topic, level } = validated.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, added: 0 };

    const now = new Date().toISOString();

    // Build batch insert rows — unique per (user_id, word)
    const rows = vocab.map(v => ({
      user_id: user.id,
      word: v.word.toLowerCase().trim(),
      phonetic: v.phonetic ?? null,
      meaning_vn: v.meaning_vn,
      example_en: v.example_en ?? null,
      topic,
      level: level ?? "A1",
      interval: 0,
      repetitions: 0,
      due_date: now,
      state: 0,
      difficulty: 0.0,
      stability: 0.0,
      last_review: null,
      next_review: now,
    }));

    // upsert with ignoreDuplicates — skip words already in the user's deck
    const { error } = await supabase
      .from("cards")
      .upsert(rows, { onConflict: "user_id,word", ignoreDuplicates: true });

    if (error) return { success: false, added: 0 };

    revalidatePath("/flashcards");
    revalidatePath("/dashboard");
    return { success: true, added: rows.length };
  } catch {
    return { success: false, added: 0 };
  }
}

/**
 * TASK-280/314: On v2 lesson complete, upsert FSRS cards from LessonSpec
 * lexis + fluency target phrases. Client sends lessonId only — content from registry.
 * Guest / unauth / DB down → silent no-op (fire-and-forget safe; local seed is client-side).
 */
export async function seedV2LessonLexisToSRS(lessonId: string) {
  try {
    const rateErr = await checkActionRateLimit(seedV2LexisLimiter);
    if (rateErr) return { success: false, added: 0 };

    const validated = SeedV2LessonLexisSchema.safeParse({ lessonId });
    if (!validated.success) return { success: false, added: 0 };
    const cleanId = validated.data.lessonId;

    const lesson = getLessonV2(cleanId);
    if (!lesson) return { success: false, added: 0 };

    const vocab = lessonToSeedVocab(lesson);
    if (vocab.length === 0) return { success: true, added: 0 };

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, added: 0, guestMode: true };

    const now = new Date().toISOString();
    const rows = vocab.map((v) => ({
      user_id: user.id,
      word: v.word.toLowerCase().trim(),
      phonetic: v.phonetic,
      meaning_vn: v.meaning_vn,
      example_en: v.example_en,
      topic: cleanId,
      level: lesson.cefr,
      interval: 0,
      repetitions: 0,
      due_date: now,
      state: 0,
      difficulty: 0.0,
      stability: 0.0,
      last_review: null,
      next_review: now,
    }));

    const { error } = await supabase
      .from("cards")
      .upsert(rows, { onConflict: "user_id,word", ignoreDuplicates: true });

    if (error) return { success: false, added: 0 };

    revalidatePath("/flashcards");
    revalidatePath("/dashboard");
    return { success: true, added: rows.length };
  } catch {
    return { success: false, added: 0 };
  }
}

/**
 * Khi người dùng trả lời sai trong quiz/scramble/translate,
 * tìm card tương ứng và đánh giá lại với rating "Again" → đẩy lên đầu hàng ôn tập.
 */
export async function scheduleWrongWordsForReview(words: string[]) {
  try {
    if (!words.length) return { success: true, updated: 0 };

    const rateErr = await checkActionRateLimit(wrongWordsLimiter);
    if (rateErr) return { success: false, updated: 0 };

    const validated = WrongWordsSchema.safeParse({ words });
    if (!validated.success) return { success: false, updated: 0 };
    const cleanWords = validated.data.words.map(w => w.toLowerCase().trim());

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, updated: 0 };

    // Fetch matching cards from user's deck
    const { data: cards, error: fetchErr } = await supabase
      .from("cards")
      .select("id, interval, repetitions, state, difficulty, stability, last_review, next_review, due_date")
      .eq("user_id", user.id)
      .in("word", cleanWords);

    if (fetchErr || !cards?.length) return { success: true, updated: 0 };

    // Apply FSRS "Again" rating to each card and bulk update
    const now = new Date().toISOString();
    const updates = cards.map(card => {
      const fsrsResult = reviewCardFSRS(card as unknown as Card, "Again");
      return {
        id: card.id,
        user_id: user.id,
        state: fsrsResult.state,
        difficulty: fsrsResult.difficulty,
        stability: fsrsResult.stability,
        last_review: fsrsResult.last_review,
        next_review: fsrsResult.next_review,
        interval: fsrsResult.interval,
        repetitions: fsrsResult.repetitions,
        due_date: now, // Due immediately for re-review
      };
    });

    // Update each card's FSRS fields individually (update, not upsert, to avoid required-field violations)
    const updateResults = await Promise.all(
      updates.map(u =>
        supabase
          .from("cards")
          .update({
            state: u.state,
            difficulty: u.difficulty,
            stability: u.stability,
            last_review: u.last_review,
            next_review: u.next_review,
            interval: u.interval,
            repetitions: u.repetitions,
            due_date: u.due_date,
          })
          .eq("id", u.id)
          .eq("user_id", user.id)
      )
    );

    if (updateResults.some(r => r.error)) return { success: false, updated: 0 };

    // Fire-and-forget: insert review logs for each card (best-effort)
    void supabase.from("card_review_logs").insert(
      cards.map(card => {
        const fsrsResult = reviewCardFSRS(card as unknown as Card, "Again");
        return {
          user_id: user.id,
          card_id: card.id,
          rating: fsrsResult.reviewLog.rating,
          state: fsrsResult.reviewLog.state,
          due: fsrsResult.reviewLog.due,
          stability: fsrsResult.reviewLog.stability,
          difficulty: fsrsResult.reviewLog.difficulty,
          elapsed_days: fsrsResult.reviewLog.elapsed_days,
          scheduled_days: fsrsResult.reviewLog.scheduled_days,
          review: fsrsResult.reviewLog.review,
        };
      })
    );

    revalidatePath("/flashcards");
    return { success: true, updated: updates.length };
  } catch {
    return { success: false, updated: 0 };
  }
}
/**
 * Lấy top N từ khó nhất của user dựa trên số lần bấm "Again" (rating=1) trong card_review_logs.
 * Kết quả được sắp xếp từ khó nhất → dễ hơn.
 * Không cần migration DB mới — chỉ đọc card_review_logs + cards.
 */
export async function getHardWords(limit: number = 20): Promise<{
  success: boolean;
  words?: Array<{
    id: string;
    word: string;
    phonetic: string | null;
    meaning_vn: string;
    level: string;
    example_en: string | null;
    again_count: number;
    total_reviews: number;
    mastery_pct: number;
  }>;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Unauthenticated" };

    // 1. Fetch all "Again" (rating=1) logs for this user
    const { data: againLogs, error: logErr } = await supabase
      .from("card_review_logs")
      .select("card_id")
      .eq("user_id", user.id)
      .eq("rating", 1);

    if (logErr) return { success: false, error: logErr.message };
    if (!againLogs || againLogs.length === 0) return { success: true, words: [] };

    // 2. Count Again per card_id in JS
    const againMap = new Map<string, number>();
    for (const log of againLogs) {
      againMap.set(log.card_id, (againMap.get(log.card_id) ?? 0) + 1);
    }

    // 3. Sort by again count descending, take top N IDs
    const topIds = [...againMap.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);

    // 4. Fetch card details (word, phonetic, meaning, level, example, repetitions)
    const { data: cards, error: cardErr } = await supabase
      .from("cards")
      .select("id, word, phonetic, meaning_vn, level, example_en, repetitions")
      .eq("user_id", user.id)
      .in("id", topIds);

    if (cardErr) return { success: false, error: cardErr.message };
    if (!cards || cards.length === 0) return { success: true, words: [] };

    // 5. Merge and compute mastery %
    const words = topIds
      .map(id => {
        const card = cards.find(c => c.id === id);
        if (!card) return null;
        const again_count = againMap.get(id) ?? 0;
        const total_reviews = Math.max(card.repetitions ?? 1, again_count);
        const mastery_pct = Math.round(Math.max(0, (1 - again_count / total_reviews) * 100));
        return {
          id: card.id,
          word: card.word,
          phonetic: card.phonetic ?? null,
          meaning_vn: card.meaning_vn,
          level: card.level ?? "A1",
          example_en: card.example_en ?? null,
          again_count,
          total_reviews,
          mastery_pct,
        };
      })
      .filter((w): w is NonNullable<typeof w> => w !== null);

    return { success: true, words };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
