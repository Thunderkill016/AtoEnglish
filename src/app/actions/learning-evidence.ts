"use server";

import { headers } from "next/headers";

import { materializeEvidence } from "@/lib/learning/evidence";
import {
  RecordLearningAttemptSchema,
  type RecordLearningAttemptInput,
} from "@/lib/learning/validation";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const learningAttemptLimiter = createRateLimiter(180, 60 * 1000, "learning-attempt");

type RpcError = { message: string } | null;
type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: RpcError }>;
};

/**
 * Canonical write path for the new learning core.
 * UI records what happened; domain policy decides what that attempt is allowed to prove;
 * PostgreSQL then commits Attempt -> Evidence -> LearnerSkillState atomically.
 */
export async function recordLearningAttempt(input: RecordLearningAttemptInput) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await learningAttemptLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau." };
    }

    const parsed = RecordLearningAttemptSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: `Dữ liệu attempt không hợp lệ: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      };
    }

    const { attempt, candidate, previousSuccessfulContextId } = parsed.data;
    const evidence = candidate
      ? materializeEvidence({ attempt, candidate, previousSuccessfulContextId })
      : null;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để ghi nhận tiến trình học." };
    }

    const rpcClient = supabase as unknown as RpcClient;
    const { data, error } = await rpcClient.rpc("record_learning_attempt", {
      p_knowledge_item_id: attempt.knowledgeItemId ?? null,
      p_capability_id: attempt.capabilityId ?? null,
      p_session_id: attempt.sessionId ?? null,
      p_exercise_type: attempt.exerciseType,
      p_response_modality: attempt.responseModality,
      p_prompt_id: attempt.promptId ?? null,
      p_context_id: attempt.contextId ?? null,
      p_response_text: attempt.responseText ?? null,
      p_correct: attempt.correct ?? null,
      p_latency_ms: attempt.latencyMs ?? null,
      p_hint_count: attempt.hintCount ?? 0,
      p_reveal_used: attempt.revealUsed ?? false,
      p_support_level: attempt.supportLevel ?? 0,
      p_metadata: attempt.metadata ?? {},
      p_evidence_type: evidence?.type ?? null,
      p_evidence_target_id: evidence?.targetId ?? null,
      p_evidence_success: evidence?.success ?? null,
      p_evidence_confidence: evidence?.confidence ?? null,
      p_evidence_context_id: evidence?.contextId ?? null,
      p_evaluator: evidence?.evaluator ?? null,
      p_evidence_metadata: evidence?.metadata ?? {},
    });

    if (error) {
      return { success: false, error: `Không thể lưu learning event: ${error.message}` };
    }

    return {
      success: true,
      attemptId: typeof data === "string" ? data : null,
      evidenceRecorded: evidence !== null,
      evidenceType: evidence?.type ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Lỗi hệ thống khi ghi learning event: ${message}` };
  }
}
