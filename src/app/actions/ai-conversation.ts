"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const aiConvLimiter = createRateLimiter(30, 60 * 1000, "ai-conversation");

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ConvMessage {
  role: "ai" | "user";
  text: string;
}

const TurnSchema = z.object({
  userMessage: z.string().min(1).max(600).trim(),
  scenario: z.string().max(200).optional(),
  cefrLevel: z.enum(["A1", "A2", "B1", "B2"]).optional(),
  history: z
    .array(z.object({ role: z.enum(["ai", "user"]), text: z.string().max(400) }))
    .max(20)
    .optional(),
});

export interface AITurnResult {
  success: true;
  aiReply: string;
  feedback_vn: string | null;
  corrections: { original: string; fixed: string; note_vn: string }[];
  score: number;
}

export interface AITurnFailure {
  success: false;
  error: string;
}

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(scenario?: string, cefrLevel?: string): string {
  const level = cefrLevel ?? "A1";
  const ctx = scenario
    ? `Bối cảnh hội thoại: ${scenario}`
    : "Hội thoại tự do về bất kỳ chủ đề hàng ngày nào.";

  return `Bạn là gia sư tiếng Anh AI cho người Việt Nam học tiếng Anh. 
${ctx}
Trình độ học viên: ${level}.

Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Anh như một người bạn thân thiện, tự nhiên — phù hợp với trình độ ${level}
2. Sau mỗi tin nhắn của học viên, đánh giá tiếng Anh của họ
3. Duy trì cuộc hội thoại tự nhiên, đặt câu hỏi tiếp theo để học viên tiếp tục nói

Trả về JSON hợp lệ:
{
  "aiReply": "Câu trả lời tiếng Anh của bạn (tự nhiên, phù hợp trình độ ${level}, 1-3 câu)",
  "feedback_vn": "Nhận xét ngắn bằng tiếng Việt về tiếng Anh vừa dùng (chỉ khi có điều cần chú ý, nếu tốt thì null)",
  "corrections": [
    {
      "original": "phần sai",
      "fixed": "cách đúng",
      "note_vn": "giải thích ngắn bằng tiếng Việt"
    }
  ],
  "score": 85
}

Quy tắc:
- aiReply LUÔN bằng tiếng Anh
- feedback_vn và note_vn LUÔN bằng tiếng Việt
- corrections tối đa 2 lỗi quan trọng nhất
- score từ 0-100
- Nếu tiếng Anh tốt: feedback_vn=null, corrections=[]
- Với trình độ A1: dùng từ đơn giản, câu ngắn`;
}

// ── Main action ───────────────────────────────────────────────────────────────
export async function sendConversationTurn(
  userMessage: string,
  scenario?: string,
  cefrLevel?: string,
  history?: ConvMessage[]
): Promise<AITurnResult | AITurnFailure> {
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Vui lòng đăng nhập." };

  // Rate limit
  const reqHeaders = await headers();
  const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
  const rl = await aiConvLimiter.check(ip);
  if (!rl.success) return { success: false, error: "Quá nhiều yêu cầu. Thử lại sau." };

  // Validate
  const parsed = TurnSchema.safeParse({ userMessage, scenario, cefrLevel, history });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return buildDemoTurn(parsed.data.userMessage);

  // Build conversation context for Gemini
  const systemPrompt = buildSystemPrompt(scenario, cefrLevel);
  const convHistory = (history ?? []).map(m => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const contents = [
    ...convHistory,
    { role: "user", parts: [{ text: parsed.data.userMessage }] },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(12_000),
      }
    );

    if (!res.ok) return { success: false, error: "AI tạm thời không khả dụng." };

    const json = await res.json() as { candidates?: { content: { parts: { text: string }[] } }[] };
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const result = JSON.parse(raw) as Omit<AITurnResult, "success">;

    return {
      success: true,
      aiReply: result.aiReply ?? "Could you say that again?",
      feedback_vn: result.feedback_vn ?? null,
      corrections: Array.isArray(result.corrections) ? result.corrections.slice(0, 2) : [],
      score: Math.min(100, Math.max(0, Number(result.score) || 80)),
    };
  } catch {
    return { success: false, error: "Không kết nối được AI. Thử lại." };
  }
}

// ── Demo mode ─────────────────────────────────────────────────────────────────
function buildDemoTurn(userMessage: string): AITurnResult {
  const lower = userMessage.toLowerCase();
  let aiReply = "That's interesting! Can you tell me more about yourself?";
  let feedback_vn: string | null = null;
  const corrections: AITurnResult["corrections"] = [];

  if (lower.includes("hello") || lower.includes("hi")) {
    aiReply = "Hello! Nice to meet you! How are you today?";
  } else if (lower.includes("my name")) {
    aiReply = "Nice to meet you! Where are you from?";
  } else if (lower.includes("vietnam") || lower.includes("viet")) {
    aiReply = "Vietnam is beautiful! I've heard great things about it. What city are you from?";
  } else if (lower.includes("i am") || lower.includes("i'm")) {
    aiReply = "Great! Tell me more — what do you like to do in your free time?";
  }

  if (/\bi is\b/i.test(userMessage)) {
    corrections.push({ original: "I is", fixed: "I am", note_vn: "Với chủ ngữ 'I' dùng 'am', không phải 'is'" });
    feedback_vn = "Chú ý động từ 'be' với chủ ngữ 'I' nhé!";
  }

  return {
    success: true,
    aiReply: aiReply + " (Demo — thêm GEMINI_API_KEY để dùng AI thật)",
    feedback_vn,
    corrections,
    score: corrections.length === 0 ? 90 : 70,
  };
}
