import { z } from "zod";

/**
 * Schema for login requests
 */
export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

/**
 * Schema for registration requests
 */
export const SignUpSchema = z.object({
  email: z.string().email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
});

/**
 * Schema for creating or saving a card
 */
export const SaveCardSchema = z.object({
  word: z
    .string()
    .min(1, "Từ vựng không được để trống")
    .max(100, "Từ vựng quá dài")
    .trim(),
  phonetic: z.string().nullable().optional(),
  meaning_vn: z.string().min(1, "Nghĩa tiếng Việt không được để trống").trim(),
  example_en: z.string().nullable().optional(),
  topic: z.string().max(50).nullable().optional(),
  level: z.enum(["A0", "A1", "A2", "B1", "B2", "C1"]).optional(),
});

/**
 * Schema for reviewing a card
 */
export const ReviewCardSchema = z.object({
  cardId: z.string().min(1, "ID thẻ không hợp lệ"),
  rating: z.enum(["Again", "Hard", "Good", "Easy"]),
});

/**
 * Schema for completing a unit
 */
export const CompleteUnitSchema = z.object({
  unitId: z.string().min(1, "ID bài học không được để trống"),
  starCount: z.number().int().min(1).max(3).default(3),
});

/**
 * Schema for saving a speaking session
 */
export const SpeakingSessionSchema = z.object({
  practiceType: z.enum(["shadowing", "roleplay", "journal"]),
  duration: z.number().nonnegative("Thời lượng không được âm"),
  transcript: z.string().nullable().optional(),
  accuracyScore: z
    .number()
    .min(0, "Điểm chính xác không được nhỏ hơn 0")
    .max(100, "Điểm chính xác tối đa là 100")
    .nullable()
    .optional(),
  scenarioId: z.string().nullable().optional(),
});

/**
 * Schema for bulk-seeding unit vocabulary into FSRS after lesson completion.
 * Max 30 items per call to prevent abuse.
 */
export const SeedVocabSchema = z.object({
  vocab: z
    .array(
      z.object({
        word: z.string().min(1).max(100).trim(),
        phonetic: z.string().max(100).nullable().optional(),
        meaning_vn: z.string().min(1).max(300).trim(),
        example_en: z.string().max(500).nullable().optional(),
      })
    )
    .min(1, "Cần ít nhất 1 từ vựng")
    .max(30, "Tối đa 30 từ vựng mỗi lần"),
  topic: z.string().max(60).trim().default("General"),
  level: z.enum(["A0", "A1", "A2", "B1", "B2", "C1"]).default("A0"),
});

/**
 * Schema for scheduling wrong words for early FSRS review.
 * Sends rated "Again" to bring them back to the front of the queue.
 */
export const WrongWordsSchema = z.object({
  words: z
    .array(z.string().min(1).max(100).trim())
    .min(1)
    .max(30),
});

