"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const aiCoachLimiter = createRateLimiter(20, 60 * 1000, "ai-coach");

// ── Input schema ──────────────────────────────────────────────────────────────
const AICoachSchema = z.object({
  text: z
    .string()
    .min(3, "Văn bản quá ngắn")
    .max(800, "Văn bản quá dài (tối đa 800 ký tự)")
    .trim(),
  unitTopic: z.string().max(100).optional(),
  cefrLevel: z.enum(["A1", "A2", "B1", "B2"]).optional(),
});

// ── Response types ─────────────────────────────────────────────────────────────
export interface AICoachError {
  original: string;
  fixed: string;
  explanation_vn: string;
  error_type: "grammar" | "vocabulary" | "spelling" | "punctuation" | "word_order";
  rule_vn: string;
}

export interface AICoachResult {
  success: true;
  corrected: string;
  hasErrors: boolean;
  score: number;
  errors: AICoachError[];
  encouragement_vn: string;
  next_focus_vn: string;
}

export interface AICoachFailure {
  success: false;
  error: string;
}

// ── Gemini prompt ─────────────────────────────────────────────────────────────
function buildPrompt(text: string, unitTopic?: string, cefrLevel?: string): string {
  const context = unitTopic
    ? `Học viên đang học chủ đề: "${unitTopic}" (trình độ ${cefrLevel ?? "A1"}).`
    : `Học viên trình độ ${cefrLevel ?? "A1"}.`;

  return `Bạn là gia sư tiếng Anh chuyên dạy người Việt Nam học tiếng Anh.
${context}

Hãy phân tích đoạn tiếng Anh sau, sửa lỗi và giải thích bằng tiếng Việt:
"${text}"

Trả về JSON hợp lệ với định dạng chính xác này (không có markdown, chỉ JSON thuần):
{
  "corrected": "toàn bộ văn bản đã sửa (nếu không có lỗi thì giữ nguyên)",
  "hasErrors": true,
  "score": 75,
  "errors": [
    {
      "original": "phần sai trong văn bản gốc",
      "fixed": "cách viết đúng",
      "explanation_vn": "Giải thích tại sao sai và tại sao phải sửa — chú ý lỗi hay gặp của người Việt",
      "error_type": "grammar",
      "rule_vn": "Quy tắc cần ghi nhớ ngắn gọn"
    }
  ],
  "encouragement_vn": "Lời khen ngợi cụ thể và khích lệ bằng tiếng Việt (2-3 câu)",
  "next_focus_vn": "Gợi ý 1 điểm cụ thể nên tập trung học tiếp theo"
}

Quy tắc quan trọng:
- Tất cả giải thích PHẢI bằng tiếng Việt
- Chỉ nêu tối đa 3 lỗi quan trọng nhất (không nêu hết để tránh choáng ngợp)
- Nếu văn bản không có lỗi: hasErrors=false, errors=[], score=100
- score từ 0-100 (số nguyên)
- Luôn khích lệ, không chỉ trích nặng
- Chú ý các lỗi đặc trưng của người Việt: thiếu 's' ngôi ba số ít, nhầm a/an, bỏ sót article, thứ tự tính từ sai, v.v.`;
}

// ── Main action ───────────────────────────────────────────────────────────────
export async function analyzeWriting(
  text: string,
  unitTopic?: string,
  cefrLevel?: string
): Promise<AICoachResult | AICoachFailure> {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Vui lòng đăng nhập." };

  // Rate limit
  const reqHeaders = await headers();
  const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
  const rl = await aiCoachLimiter.check(ip);
  if (!rl.success) return { success: false, error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." };

  // Validate input
  const parsed = AICoachSchema.safeParse({ text, unitTopic, cefrLevel });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Demo mode: return a mock response so the UI works without a key
    return buildDemoResponse(parsed.data.text);
  }

  try {
    const prompt = buildPrompt(parsed.data.text, parsed.data.unitTopic, parsed.data.cefrLevel);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!res.ok) return { success: false, error: "AI tạm thời không khả dụng. Thử lại sau." };

    const json = await res.json() as { candidates?: { content: { parts: { text: string }[] } }[] };
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const result = JSON.parse(rawText) as Omit<AICoachResult, "success">;
    return {
      success: true,
      corrected: result.corrected ?? parsed.data.text,
      hasErrors: result.hasErrors ?? false,
      score: Math.min(100, Math.max(0, Number(result.score) || 100)),
      errors: Array.isArray(result.errors) ? result.errors.slice(0, 3) : [],
      encouragement_vn: result.encouragement_vn ?? "Tốt lắm! Tiếp tục cố gắng!",
      next_focus_vn: result.next_focus_vn ?? "Hãy luyện tập thêm mỗi ngày.",
    };
  } catch {
    return { success: false, error: "Không thể kết nối AI. Vui lòng thử lại." };
  }
}

// ── Demo mode (no API key) ────────────────────────────────────────────────────
function buildDemoResponse(text: string): AICoachResult {
  const lower = text.toLowerCase();
  const errors: AICoachError[] = [];

  // Simple heuristic checks for demo
  if (/\bi is\b/i.test(text)) {
    errors.push({
      original: "I is",
      fixed: "I am",
      explanation_vn: "Với chủ ngữ 'I' (tôi), động từ 'be' phải dùng 'am', không phải 'is'.",
      error_type: "grammar",
      rule_vn: "I → am | He/She/It → is | You/We/They → are",
    });
  }
  if (/\ba [aeiou]/i.test(text)) {
    errors.push({
      original: text.match(/\ba [aeiouAEIOU]\w*/)?.[0] ?? "a [nguyên âm]",
      fixed: "an " + (text.match(/\ba ([aeiouAEIOU]\w*)/)?.[1] ?? "[nguyên âm]"),
      explanation_vn: "Trước danh từ bắt đầu bằng nguyên âm (a, e, i, o, u) phải dùng 'an' thay vì 'a'.",
      error_type: "grammar",
      rule_vn: "a + phụ âm | an + nguyên âm (a, e, i, o, u)",
    });
  }

  const score = errors.length === 0 ? 100 : Math.max(60, 100 - errors.length * 15);
  const isGood = lower.includes("hello") || lower.includes("my name") || lower.includes("i am");

  return {
    success: true,
    corrected: text,
    hasErrors: errors.length > 0,
    score,
    errors,
    encouragement_vn: isGood
      ? "Tuyệt vời! Câu của bạn rõ ràng và tự nhiên. Hãy tiếp tục luyện tập như vậy!"
      : "Bạn đang làm rất tốt! Tiếp tục viết mỗi ngày để cải thiện nhanh hơn.",
    next_focus_vn: "Thêm GEMINI_API_KEY vào .env.local để kích hoạt AI chấm điểm thực. (Miễn phí tại ai.google.dev)",
  };
}
