"use server";

import { headers } from "next/headers";

import { materializeEvidence, type EvidenceEvent } from "@/lib/learning/evidence";
import type { RecordLearningAttemptInput } from "@/lib/learning/validation";
import {
  compileCanonicalNếpPracticeAttempt,
  NếpPracticeSubmissionSchema,
  type NếpPracticeSubmission,
} from "@/lib/nep/practice-execution.v1";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const learningAttemptLimiter = createRateLimiter(180, 60 * 1000, "learning-attempt");

type RpcError = { message: string } | null;
type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: RpcError }>;
};

function rpcArgs(
  attempt: RecordLearningAttemptInput["attempt"],
  evidence: EvidenceEvent | null,
): Record<string, unknown> {
  return {
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
  };
}

function isTransferPolicyRejection(message: string): boolean {
  return message.includes("Transfer requires")
    || message.includes("Evidence context must match attempted context");
}

/**
 * Trusted Nếp execution boundary.
 *
 * The browser sends only observed interaction data plus canonical action identity. The server
 * resolves the versioned lesson/action and recomputes correctness, target, evidence type,
 * evaluator, reveal semantics and remediation metadata. Raw learner response is used transiently
 * for deterministic evaluation and is never passed to the persistence RPC.
 */
export async function recordNếpPracticeAttempt(input: NếpPracticeSubmission) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await learningAttemptLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau." };
    }

    const parsed = NếpPracticeSubmissionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: `Dữ liệu practice không hợp lệ: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      };
    }

    const compiled = compileCanonicalNếpPracticeAttempt(parsed.data);
    if (!compiled) {
      return { success: false, error: "Lesson/action không tồn tại trong canonical Nếp contract." };
    }

    const { record, evaluation, feedback } = compiled;
    const { attempt, candidate } = record;
    const evidence = candidate
      ? materializeEvidence({
          attempt,
          candidate,
          // Transfer depends on persisted history, not caller-provided previous context.
          deferTransferContextCheck: candidate.type === "transfer",
        })
      : null;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: true,
        persisted: false,
        persistence: "local-only" as const,
        evaluation,
        feedback,
        evidenceRecorded: false,
        evidenceType: null,
        evidenceRejection: null,
      };
    }

    const rpcClient = supabase as unknown as RpcClient;
    let { data, error } = await rpcClient.rpc("record_learning_attempt", rpcArgs(attempt, evidence));
    let evidenceRecorded = evidence !== null;
    let evidenceRejection: string | null = null;

    // A changed-context decision depends on persisted history and can lose a race between
    // concurrent requests. Preserve the immutable attempt even when the DB correctly rejects
    // only transfer evidence. Infrastructure/permission errors are never downgraded.
    if (error && evidence?.type === "transfer" && isTransferPolicyRejection(error.message)) {
      evidenceRejection = error.message;
      const retry = await rpcClient.rpc("record_learning_attempt", rpcArgs(attempt, null));
      data = retry.data;
      error = retry.error;
      evidenceRecorded = false;
    }

    if (error) {
      return {
        success: false,
        error: `Không thể lưu learning event: ${error.message}`,
        evaluation,
        feedback,
      };
    }

    return {
      success: true,
      persisted: true,
      persistence: "database" as const,
      attemptId: typeof data === "string" ? data : null,
      evaluation,
      feedback,
      evidenceRecorded,
      evidenceType: evidenceRecorded ? evidence?.type ?? null : null,
      evidenceRejection,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Lỗi hệ thống khi ghi learning event: ${message}` };
  }
}
