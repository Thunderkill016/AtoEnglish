"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { SpeakingSessionSchema } from "@/lib/security/validation";

const speakingLimiter = createRateLimiter(20, 60 * 1000, "speaking");
const aiLimiter = createRateLimiter(30, 60 * 1000, "ai-gen");

const SCENARIO_DETAILS: Record<string, { title: string; character: string; difficulty: string }> = {
  "hotel-checkin": { title: "Hotel Check-in", character: "Receptionist (Lễ tân)", difficulty: "Easy" },
  "job-interview": { title: "Job Interview", character: "Hiring Manager (Nhà tuyển dụng)", difficulty: "Medium" },
  "coffee-shop": { title: "Ordering Coffee", character: "Barista (Nhân viên pha chế)", difficulty: "Easy" },
  "airport-security": { title: "Airport Security", character: "Border Officer (Nhân viên hải quan)", difficulty: "Medium" },
  "restaurant-dining": { title: "Restaurant Dining", character: "Waiter (Phục vụ nhà hàng)", difficulty: "Easy" },
  "doctors-appointment": { title: "Doctor's Appointment", character: "Doctor (Bác sĩ)", difficulty: "Hard" },
  "saas-product-demo": { title: "Product Demo", character: "Potential Customer (Khách hàng tiềm năng)", difficulty: "Hard" },
  "investor-pitch": { title: "Investor Pitch", character: "Angel Investor (Nhà đầu tư)", difficulty: "Hard" },
  "customer-support": { title: "Customer Support", character: "Unhappy Customer (Khách hàng không hài lòng)", difficulty: "Medium" }
};

interface ChatMessageParam {
  sender: "ai" | "user";
  text: string;
}

interface SaveSpeakingSessionParams {
  practiceType: "shadowing" | "roleplay" | "journal";
  duration: number;
  transcript?: string | null;
  accuracyScore?: number | null;
  scenarioId?: string | null;
}

/**
 * Server Action lưu lại lịch sử một buổi luyện nói vào bảng speaking_sessions.
 */
export async function saveSpeakingSession(params: SaveSpeakingSessionParams) {
  try {
    // Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await speakingLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau."
      };
    }

    // Input Validation
    const validated = SpeakingSessionSchema.safeParse(params);
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
        error: "Bạn cần đăng nhập để lưu lịch sử luyện nói."
      };
    }

    // 2. Chèn bản ghi mới
    const { error } = await supabase
      .from("speaking_sessions")
      .insert({
        user_id: user.id,
        practice_type: cleanParams.practiceType,
        duration: cleanParams.duration,
        transcript: cleanParams.transcript || null,
        accuracy_score: cleanParams.accuracyScore !== undefined ? cleanParams.accuracyScore : null,
        scenario_id: cleanParams.scenarioId || null
      });

    if (error) {
      return {
        success: false,
        error: `Lỗi lưu lịch sử: ${error.message}`
      };
    }

    // 3. Award XP for speaking practice + update streak
    const XP_BY_TYPE: Record<string, number> = {
      shadowing: 5,
      roleplay: 8,
      journal: 5,
    };
    const xpEarned = XP_BY_TYPE[cleanParams.practiceType] ?? 5;
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("total_xp, streak, last_active_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userProgress) {
      const lastActive = userProgress.last_active_date;
      let nextStreak = 1;
      if (lastActive === today) {
        nextStreak = userProgress.streak;
      } else {
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        const yesterday = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        nextStreak = lastActive === yesterday ? userProgress.streak + 1 : 1;
      }
      await supabase
        .from("user_progress")
        .update({
          total_xp: userProgress.total_xp + xpEarned,
          streak: nextStreak,
          last_active_date: today,
        })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          current_level: "A0",
          streak: 1,
          total_xp: xpEarned,
          last_active_date: today,
        });
    }

    // Revalidate speaking + dashboard so XP and streak update immediately
    revalidatePath("/speaking");
    revalidatePath("/dashboard");

    return {
      success: true,
      xpEarned,
      message: `Đã lưu! +${xpEarned} XP`,
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
 * Server Action lấy danh sách lịch sử luyện nói gần đây của người dùng.
 */
export async function getRecentSpeakingSessions(limit: number = 5) {
  try {
    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lấy lịch sử luyện tập."
      };
    }

    // 2. Truy vấn
    const { data, error } = await supabase
      .from("speaking_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        error: `Lỗi truy vấn lịch sử: ${error.message}`
      };
    }

    return {
      success: true,
      sessions: data || []
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
 * Server Action gọi Gemini Flash tạo câu thoại tiếp theo của AI và gợi ý câu thoại cho User.
 * v2: Native multi-turn contents array + systemInstruction + grammar feedback (Speak.com pattern)
 */
export async function generateRoleplayTurn(
  scenarioId: string,
  history: ChatMessageParam[],
  userMessage: string
) {
  try {
    // 1. Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await aiLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau." };
    }

    // 2. Check Auth (relaxed for guest self-study)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // guest allowed, user may be null

    const scenario = SCENARIO_DETAILS[scenarioId];
    if (!scenario) return { success: false, error: "Kịch bản không tồn tại." };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Zero-cost fallback for self-study (best free practice)
      const turn = Math.floor((history?.length || 0) / 2);
      const suggestions = [
        { en: "Hello, I would like to check in please.", vi: "Chào bạn, tôi muốn nhận phòng ạ." },
        { en: "Yes, is breakfast included?", vi: "Vâng, bữa sáng có bao gồm không ạ?" },
        { en: "Thank you very much for your help.", vi: "Cảm ơn bạn rất nhiều." },
      ];
      const s = suggestions[Math.min(turn, suggestions.length-1)];
      // Simple free similarity scoring (Levenshtein inspired)
      const similarity = (a: string, b: string) => {
        const longer = a.length > b.length ? a : b;
        const shorter = a.length > b.length ? b : a;
        if (longer.length === 0) return 1;
        const dist = longer.length - shorter.length; // simplified
        return Math.max(0, 100 - Math.floor((dist / longer.length) * 100));
      };
      const score = userMessage ? similarity(userMessage.toLowerCase(), s.en.toLowerCase()) : 70;
      const feedback = score > 85 ? "Excellent pronunciation and flow!" : score > 70 ? "Good, keep practicing natural rhythm." : "Focus on clear words and add politeness.";
      return {
        success: true,
        aiPrompt: "Thank you. How else can I help you?",
        userSuggestion: s.en,
        userSuggestionVi: s.vi,
        grammarFeedback: feedback,
        grammarCorrection: "",
        isEnd: turn >= 3,
      };
    }

    // 3. Build native multi-turn contents array (Gemini multi-turn format)
    // History alternates user → model. Gemini requires this strict alternation.
    const turnNumber = Math.floor(history.length / 2) + 1;
    const difficultyNote =
      turnNumber <= 2 ? "Use simple vocabulary (A1-A2 CEFR). Short sentences." :
      turnNumber <= 5 ? "Use natural conversational English (A2-B1 CEFR)." :
      "Use richer vocabulary and more complex structures (B1-B2 CEFR). Challenge the learner.";

    // System instruction sets persistent AI behavior across all turns
    const systemInstruction = `You are roleplaying as "${scenario.character}" in the scenario: "${scenario.title}" (${scenario.difficulty}).
You are talking to a Vietnamese English learner at approximately A1-B1 level.
RULES:
- Stay fully in character. Never break the roleplay.
- Keep AI responses to 1-3 sentences max.
- ${difficultyNote}
- After each user message, provide inline grammar/naturalness feedback if there is an error (max 1 correction per turn).
- Always suggest a helpful next reply the user could give (in English + Vietnamese translation).
- Reply in strict JSON only.`;

    // Convert history to Gemini multi-turn contents format
    // Gemini requires strict user→model→user→model alternation
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    for (const msg of history) {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }
    // Add current user message as the final turn
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    // JSON schema embedded in the final user turn for reliable structured output
    const schemaInstruction = `\n\nRespond ONLY with valid JSON matching this schema exactly:
{
  "aiPrompt": "your in-character response (1-3 sentences)",
  "userSuggestion": "suggested English reply for next turn",
  "userSuggestionVi": "Vietnamese translation of suggestion",
  "grammarFeedback": "brief correction if user made an error, or empty string if correct",
  "grammarCorrection": "the corrected sentence, or empty string if no error",
  "isEnd": false
}
Set isEnd=true only if the conversation reached a natural conclusion.`;

    // Inject schema hint into the last user message
    if (contents.length > 0) {
      const last = contents[contents.length - 1];
      if (last) {
        last.parts = [{ text: (last.parts[0]?.text ?? "") + schemaInstruction }];
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.85,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Gemini API error: ${errText}` };
    }

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) return { success: false, error: "Gemini returned empty response." };

    const cleanJson = JSON.parse(responseText.trim());
    return {
      success: true,
      aiPrompt: cleanJson.aiPrompt || "",
      userSuggestion: cleanJson.userSuggestion || "",
      userSuggestionVi: cleanJson.userSuggestionVi || "",
      grammarFeedback: cleanJson.grammarFeedback || "",
      grammarCorrection: cleanJson.grammarCorrection || "",
      isEnd: !!cleanJson.isEnd,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Lỗi hệ thống: ${errorMessage}` };
  }
}

/**
 * Server Action gọi Gemini Flash phân tích hội thoại/nhật ký nói và trả về đánh giá chi tiết.
 */
export async function evaluateSpeakingSession(
  practiceType: "roleplay" | "journal",
  transcript: string
) {
  try {
    // 1. Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await aiLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau."
      };
    }

    // 2. Check Auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để thực hiện tác vụ này."
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Zero-cost fallback
      const w = (transcript || "").trim().split(/\s+/).filter(Boolean).length;
      return {
        success: true,
        feedback: `**Nhận xét chung**\nBạn đã thực hành ${w} từ. Tiếp tục luyện nhé!\n\n**Sửa lỗi & Gợi ý**\n- Thêm từ lịch sự (please, thank you).\n- Phát âm rõ âm cuối.\n\n**Mẹo cho người Việt**: Ghi âm lại và so với audio gốc.`,
      };
    }

    const prompt = `You are an expert English language tutor. Analyze the following English speaking practice session transcript of a Vietnamese learner.
Practice Type: ${practiceType}
Transcript:
"${transcript}"

Please provide a detailed, encouraging, and highly constructive evaluation in Vietnamese.
Break your response down into the following sections using Markdown:
1. **Nhận xét chung**: General assessment of their speaking flow, vocabulary level, and progress.
2. **Sửa lỗi Ngữ pháp & Từ vựng**: Point out any grammatical errors or unnatural word choices, and suggest the correct/more natural way to say them.
3. **Gợi ý diễn đạt hay hơn (Alternative Phrases)**: Give 2-3 alternative phrases or expressions that would make their speech sound more native and premium.
4. **Mẹo phát âm cho người Việt**: Based on typical pronunciation issues Vietnamese speakers face with these words (like final consonants /s/, /t/, /k/, /d/ or word stress), give 2 specific pronunciation tips.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Gemini API error: ${errText}`
      };
    }

    const resData = await response.json();
    const feedback = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!feedback) {
      return {
        success: false,
        error: "Gemini returned empty response."
      };
    }

    return {
      success: true,
      feedback: feedback.trim()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}
