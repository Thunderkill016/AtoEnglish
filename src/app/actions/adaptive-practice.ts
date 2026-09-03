"use server";

import { getNếpSessionPlan } from "@/app/actions/session-planner";
import type { NếpPracticeEnvelope } from "@/lib/nep/practice-execution.v1";

export type GetNếpAdaptivePracticeQueueResult =
  | {
      success: false;
      error: string;
      authRequired: boolean;
    }
  | {
      success: true;
      practices: NếpPracticeEnvelope[];
      summary: {
        practiceCount: number;
        catalogSize: number;
        recurringErrorCount: number;
        stateCount: number;
      };
    };

/**
 * Learner-facing planner boundary.
 *
 * The internal planner action remains useful for diagnostics, but a browser learning surface must
 * not receive planner scores, target IDs, evidence types, evaluator identifiers or ranking reasons.
 * This action deliberately strips those fields and returns only safe practice envelopes plus a
 * minimal operational summary.
 */
export async function getNếpAdaptivePracticeQueue(
  sessionSize = 2,
): Promise<GetNếpAdaptivePracticeQueueResult> {
  const result = await getNếpSessionPlan({ sessionSize });
  if (!result.success) {
    const error = result.error ?? "Không thể tạo session học thích ứng.";
    return {
      success: false,
      error,
      authRequired: error.includes("đăng nhập"),
    };
  }

  return {
    success: true,
    practices: result.practices,
    summary: {
      practiceCount: result.practices.length,
      catalogSize: result.diagnostics.catalogSize,
      recurringErrorCount: result.diagnostics.recurringErrorCount,
      stateCount: result.diagnostics.stateCount,
    },
  };
}
