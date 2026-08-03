import "server-only";

import type {
  RealTalkAttemptEvidence,
  RestoredRealTalkAttempt,
  SaveAttemptResult,
} from "@/features/real-talk/domain/learner-attempt";
import { createClient } from "@/lib/supabase/server";
import type {
  GetRealTalkAttemptRpcClient,
  SaveRealTalkAttemptRpcClient,
} from "@/types/real-talk-database";
import type { Json } from "@/types/supabase";

function boundedSupportLevel(value: number): 0 | 1 | 2 | 3 {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  return 3;
}

export async function persistRealTalkAttempt(
  evidence: RealTalkAttemptEvidence,
): Promise<SaveAttemptResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        code: "AUTH_REQUIRED",
        error: "Bạn cần đăng nhập để lưu tiến độ.",
      };
    }

    const rpcClient = supabase as unknown as SaveRealTalkAttemptRpcClient;
    const { data, error } = await rpcClient.rpc("save_real_talk_attempt", {
      p_lesson_slug: evidence.lessonSlug,
      p_evidence: {
        firstListenCompleted: evidence.firstListenCompleted,
        comprehensionCorrect: evidence.comprehensionCorrect,
        comprehensionTotal: evidence.comprehensionTotal,
        maxSupportLevel: evidence.maxSupportLevel,
        retrievalAttempted: evidence.retrievalAttempted,
        speakConfirmed: evidence.speakConfirmed,
        transferAttempted: evidence.transferAttempted,
      } as Json,
    });
    const row = data?.[0];

    if (error || !row) {
      return {
        success: false,
        code: "PERSISTENCE_FAILED",
        error: "Không thể lưu checkpoint. Hãy thử lại sau.",
      };
    }

    return {
      success: true,
      attemptId: row.attempt_id,
      status: row.attempt_status,
      checkpoint: row.attempt_checkpoint,
      completedAt: row.attempt_completed_at,
    };
  } catch {
    return {
      success: false,
      code: "PERSISTENCE_FAILED",
      error: "Không thể kết nối kho tiến độ.",
    };
  }
}

export async function loadRealTalkAttempt(
  lessonSlug: string,
): Promise<RestoredRealTalkAttempt | null> {
  const normalizedSlug = lessonSlug.trim();
  if (!normalizedSlug || normalizedSlug.length > 180) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const rpcClient = supabase as unknown as GetRealTalkAttemptRpcClient;
    const { data, error } = await rpcClient.rpc("get_real_talk_attempt", {
      p_lesson_slug: normalizedSlug,
    });
    const row = data?.[0];
    if (error || !row) return null;

    return {
      attemptId: row.attempt_id,
      status: row.attempt_status,
      checkpoint: row.attempt_checkpoint,
      firstListenCompleted: row.first_listen_completed,
      comprehensionCorrect: row.comprehension_correct,
      comprehensionTotal: row.comprehension_total,
      maxSupportLevel: boundedSupportLevel(row.max_support_level),
      retrievalAttempted: row.retrieval_attempted,
      speakConfirmed: row.speak_confirmed,
      transferAttempted: row.transfer_attempted,
      completedAt: row.attempt_completed_at,
    };
  } catch {
    return null;
  }
}
