"use server";

import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import { z } from "zod";

const phonemeLimiter = createRateLimiter(20, 60_000, "phoneme");

const phonemeSchema = z.object({
  target: z.string().min(1).max(200),
  spoken: z.string().min(1).max(200),
});

export interface PhonemeError {
  word: string;           // The word with the error
  ipa_target: string;     // Correct IPA for Vietnamese learners to aim for
  common_mistake_vn: string; // What Vietnamese speakers typically say instead
  tip_vn: string;         // Concrete practice tip in Vietnamese
}

export interface PhonemeResult {
  score: number;          // 0–100 pronunciation accuracy
  matched: boolean;       // Whether spoken matches target well enough
  phoneme_errors: PhonemeError[];
  praise_vn: string;      // Positive feedback in Vietnamese
  overall_tip_vn: string; // One overall improvement tip in Vietnamese
}

/**
 * assessPronunciation — compares learner's spoken text to target using Gemini.
 * Identifies specific phoneme errors common to Vietnamese speakers.
 * Rate-limited: 20 req/min.
 */
export async function assessPronunciation(params: {
  target: string;  // The sentence they should have said
  spoken: string;  // What the SpeechRecognition API heard
}) {
  try {
    const rateErr = await checkActionRateLimit(
      phonemeLimiter,
      "Quá nhiều yêu cầu. Thử lại sau 1 phút.",
    );
    if (rateErr) {
      return { success: false as const, error: rateErr };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false as const, error: "Bạn cần đăng nhập." };
    }

    const parsed = phonemeSchema.safeParse(params);
    if (!parsed.success) {
      return { success: false as const, error: "Dữ liệu không hợp lệ." };
    }
    const { target, spoken } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Demo mode
      const demoScore = Math.floor(Math.random() * 30) + 65;
      return {
        success: true as const,
        result: {
          score: demoScore,
          matched: demoScore >= 70,
          phoneme_errors: [
            {
              word: "example",
              ipa_target: "/ɪɡˈzæmpəl/",
              common_mistake_vn: "Người Việt thường đọc /ek-zam-pol/",
              tip_vn: "Nhấn trọng âm vào âm tiết thứ 2: ig-ZAM-pəl",
            },
          ],
          praise_vn: "Bạn đã thử rất tốt! (Demo mode — thêm GEMINI_API_KEY để bật AI thực)",
          overall_tip_vn: "Luyện tập các âm cuối /t/, /d/, /s/ — người Việt hay bỏ qua các âm này.",
        } satisfies PhonemeResult,
      };
    }

    const prompt = `You are a pronunciation coach for Vietnamese learners of English.

Target sentence (what they should say): "${target}"
What the speech recognizer heard: "${spoken}"

Analyze the pronunciation differences and respond in STRICT JSON:
{
  "score": number 0-100 (how close spoken is to target — 100 = perfect match, 0 = completely different),
  "matched": boolean (true if score >= 70),
  "phoneme_errors": [
    {
      "word": "specific word in target with error",
      "ipa_target": "IPA transcription of correct pronunciation",
      "common_mistake_vn": "what Vietnamese speakers typically say instead — in Vietnamese",
      "tip_vn": "concrete, actionable practice tip in Vietnamese — mention mouth position or contrast with Vietnamese sounds"
    }
  ],
  "praise_vn": "1 genuine encouraging sentence in Vietnamese about what they did well",
  "overall_tip_vn": "1 most important overall pronunciation tip in Vietnamese"
}

Rules:
- phoneme_errors: list only REAL errors inferred from the difference between target and spoken (max 3 errors)
- If spoken and target are very similar (score >= 85), phoneme_errors can be empty []
- Focus on errors common to Vietnamese speakers: final consonants (/t/ /d/ /k/ /s/ /z/), /θ/ /ð/, /æ/ vs /a/, word stress
- All Vietnamese text MUST be in Vietnamese (không dùng tiếng Anh trong tip_vn/praise_vn/common_mistake_vn)
- Be encouraging — Vietnamese learners are beginners`;

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

    const result = JSON.parse(raw.trim()) as PhonemeResult;
    return { success: true as const, result };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false as const, error: `Lỗi hệ thống: ${msg}` };
  }
}
