"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { z } from "zod";

const writingLimiter = createRateLimiter(15, 60_000, "writing");

const improveSchema = z.object({
  text: z.string().min(5, "Câu quá ngắn").max(500, "Tối đa 500 ký tự"),
  level: z.enum(["A1", "A2", "B1"]),
});

export interface WritingFeedback {
  corrected: string;         // Corrected version of the sentence(s)
  errors: {
    original: string;        // Exact erroneous phrase
    correction: string;      // Fixed version
    explanation_vn: string;  // Vietnamese explanation
    type: "grammar" | "vocabulary" | "spelling" | "word_order";
  }[];
  improved: string;          // A more natural / advanced rephrasing
  score: number;             // 0–100 accuracy score
  encouragement_vn: string;  // Short Vietnamese motivational comment
}

/**
 * analyzeWriting — sends learner text to Gemini Flash for grammar/style feedback.
 * Targets A0-B1 Vietnamese learners; all explanations in Vietnamese.
 * Rate-limited: 15 req/min per IP.
 */
export async function analyzeWriting(formData: {
  text: string;
  level: "A1" | "A2" | "B1";
}) {
  try {
    // Rate limit
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const rateCheck = await writingLimiter.check(ip);
    if (!rateCheck.success) {
      return {
        success: false as const,
        error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.",
      };
    }

    // Auth
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false as const, error: "Bạn cần đăng nhập." };
    }

    // Validate input
    const parsed = improveSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false as const,
        error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
      };
    }
    const { text, level } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Demo mode — return plausible mock response
      return {
        success: true as const,
        feedback: {
          corrected: text,
          errors: [],
          improved: text + " (Demo mode — add GEMINI_API_KEY to enable AI feedback)",
          score: 85,
          encouragement_vn:
            "Tốt lắm! Thêm GEMINI_API_KEY vào .env.local để bật phản hồi AI thực.",
        } satisfies WritingFeedback,
      };
    }

    const prompt = `You are an expert English writing tutor for Vietnamese learners at ${level} level.

Student's text:
"${text}"

Analyze this text and respond STRICTLY in valid JSON with this exact structure:
{
  "corrected": "corrected version of the full text (fix grammar/spelling/word order errors only — keep vocabulary simple for ${level})",
  "errors": [
    {
      "original": "exact erroneous phrase from student text",
      "correction": "corrected phrase",
      "explanation_vn": "explanation in Vietnamese — short, clear, pedagogically useful for Vietnamese speakers",
      "type": "grammar | vocabulary | spelling | word_order"
    }
  ],
  "improved": "a more natural, fluent rephrasing at slightly higher than ${level} level — keep it learnable",
  "score": 0-100 (accuracy percentage — how correct the grammar/spelling is),
  "encouragement_vn": "1 short encouraging sentence in Vietnamese — focus on what they did well"
}

Rules:
- errors array must list EVERY distinct error found (empty array if none)
- All explanation_vn and encouragement_vn MUST be in Vietnamese
- corrected and improved MUST be in English
- Score 90-100 = no/minor errors, 70-89 = small errors, 50-69 = several errors, below 50 = major errors
- Keep the improved version comprehensible for ${level} learners`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      return { success: false as const, error: "Lỗi kết nối Gemini API." };
    }

    const resData = await response.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const raw = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return { success: false as const, error: "Gemini trả về kết quả rỗng." };
    }

    const feedback = JSON.parse(raw.trim()) as WritingFeedback;
    return { success: true as const, feedback };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false as const, error: `Lỗi hệ thống: ${msg}` };
  }
}
