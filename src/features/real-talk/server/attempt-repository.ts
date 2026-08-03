import "server-only";

import type {
  RealTalkAttemptEvidence,
  SaveAttemptResult,
} from "@/features/real-talk/domain/learner-attempt";
import { createClient } from "@/lib/supabase/server";
import type { SaveRealTalkAttemptRpcClient } from "@/types/real-talk-database";
import type { Json } from "@/types/supabase";

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
