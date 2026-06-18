import { fsrs, Card as FSRSCard, Rating, State } from "ts-fsrs";
import { Card as DbCard } from "@/types/database";

// Khởi tạo FSRS instance với các tham số mặc định tối ưu (retention 90%)
export const fsrsInstance = fsrs({
  request_retention: 0.9,
  enable_fuzz: false, // tắt fuzz để có kết quả thống nhất khi test
});

/**
 * Ánh xạ một DbCard từ database sang FSRSCard của thư viện ts-fsrs.
 */
export function mapDbCardToFSRSCard(dbCard: DbCard): FSRSCard {
  return {
    due: dbCard.next_review ? new Date(dbCard.next_review) : new Date(dbCard.due_date),
    stability: dbCard.stability || 0,
    difficulty: dbCard.difficulty || 0,
    elapsed_days: dbCard.last_review && dbCard.next_review
      ? Math.max(0, Math.round((new Date(dbCard.next_review).getTime() - new Date(dbCard.last_review).getTime()) / (1000 * 60 * 60 * 24)))
      : 0,
    scheduled_days: dbCard.interval || 0,
    reps: dbCard.repetitions || 0,
    state: (dbCard.state as State) ?? State.New,
    last_review: dbCard.last_review ? new Date(dbCard.last_review) : undefined,
    // defaults from library required fields
    lapses: 0,
    learning_steps: 0,
  };
}

/**
 * Đánh giá thẻ từ vựng theo FSRS.
 * @param dbCard Dữ liệu thẻ hiện tại từ Database
 * @param rating Đánh giá của người dùng ("Again" | "Hard" | "Good" | "Easy")
 * @returns Đối tượng chứa thông tin cập nhật cho Database và thông tin debug
 */
export function reviewCardFSRS(
  dbCard: DbCard,
  rating: "Again" | "Hard" | "Good" | "Easy"
) {
  const fsrsCard = mapDbCardToFSRSCard(dbCard);
  const now = new Date();

  // Ánh xạ rating sang ts-fsrs Rating enum
  let fsrsRating: Rating;
  switch (rating) {
    case "Again":
      fsrsRating = Rating.Again;
      break;
    case "Hard":
      fsrsRating = Rating.Hard;
      break;
    case "Good":
      fsrsRating = Rating.Good;
      break;
    case "Easy":
      fsrsRating = Rating.Easy;
      break;
    default:
      fsrsRating = Rating.Good;
  }

  // Thực hiện lên lịch lại (repeat/review) bằng ts-fsrs
  const schedulingCards = fsrsInstance.repeat(fsrsCard, now);
  const updatedCard = schedulingCards[fsrsRating].card;

  // Tính toán interval mới từ FSRS
  const nextInterval = updatedCard.scheduled_days;

  return {
    // FSRS fields
    state: updatedCard.state,
    difficulty: updatedCard.difficulty,
    stability: updatedCard.stability,
    last_review: now.toISOString(),
    next_review: updatedCard.due.toISOString(),

    // Tương thích ngược với SM-2 fields
    interval: nextInterval,
    repetitions: updatedCard.reps,
    due_date: updatedCard.due.toISOString(), // Đồng bộ due_date để query filter thẻ đến hạn
    last_reviewed: now.toISOString(),
    
    // Thông tin debug để hiển thị lên UI
    debug: {
      rating,
      stateName: State[updatedCard.state],
      stability: Math.round(updatedCard.stability * 100) / 100,
      difficulty: Math.round(updatedCard.difficulty * 100) / 100,
      interval: nextInterval,
    }
  };
}
