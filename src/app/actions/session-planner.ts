"use server";

import { headers } from "next/headers";

import {
  collectPlannerTargetIds,
  deriveRecentPlannerHistory,
  mapLearnerSkillStateRow,
  normalizeSessionSize,
  PLANNER_RECENT_ATTEMPT_SELECT,
  PLANNER_SKILL_STATE_SELECT,
  type LearnerSkillStateRow,
  type RecentLearningAttemptRow,
} from "@/lib/learning/session-input";
import { planSession } from "@/lib/learning/session-planner";
import { nepSessionCatalogV1 } from "@/lib/nep/session-catalog.v1";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const plannerReadLimiter = createRateLimiter(90, 60 * 1000, "session-planner-read");

type QueryError = { message: string } | null;
type QueryResult<T> = Promise<{ data: T[] | null; error: QueryError }>;

type PlannerQuery<T> = {
  select: (columns: string) => PlannerQuery<T>;
  eq: (column: string, value: string) => PlannerQuery<T>;
  in: (column: string, values: string[]) => PlannerQuery<T>;
  order: (column: string, options: { ascending: boolean }) => PlannerQuery<T>;
  limit: (count: number) => QueryResult<T>;
};

type PlannerReadClient = {
  from: <T>(table: string) => PlannerQuery<T>;
};

export type GetNếpSessionPlanInput = {
  sessionSize?: number;
};

/**
 * Read-only authenticated boundary for Session Planner V1.
 * It deliberately selects no raw response/transcript content and does not mutate learner state.
 * This action is not yet wired to the learner-facing route.
 */
export async function getNếpSessionPlan(input: GetNếpSessionPlanInput = {}) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await plannerReadLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau." };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để tạo session học thích ứng." };
    }

    const sessionSize = normalizeSessionSize(
      typeof input.sessionSize === "number" ? input.sessionSize : undefined,
    );
    const targetIds = collectPlannerTargetIds(nepSessionCatalogV1);
    const readClient = supabase as unknown as PlannerReadClient;

    const stateQuery = readClient
      .from<LearnerSkillStateRow>("learner_skill_states")
      .select(PLANNER_SKILL_STATE_SELECT)
      .eq("user_id", user.id)
      .in("target_id", targetIds)
      .limit(100);

    // Attempts are exposure history only. Project just the semantic planner keys from JSON;
    // do not fetch response_text or the full metadata object.
    const recentAttemptQuery = readClient
      .from<RecentLearningAttemptRow>("learning_attempts")
      .select(PLANNER_RECENT_ATTEMPT_SELECT)
      .eq("user_id", user.id)
      .in("capability_id", targetIds)
      .order("created_at", { ascending: false })
      .limit(40);

    const [stateResult, recentAttemptResult] = await Promise.all([stateQuery, recentAttemptQuery]);
    if (stateResult.error) {
      return { success: false, error: `Không thể đọc learner state: ${stateResult.error.message}` };
    }
    if (recentAttemptResult.error) {
      return { success: false, error: `Không thể đọc lịch sử practice gần đây: ${recentAttemptResult.error.message}` };
    }

    const states = (stateResult.data ?? []).map(mapLearnerSkillStateRow);
    const recentHistory = deriveRecentPlannerHistory(recentAttemptResult.data ?? []);
    const plan = planSession({
      candidates: nepSessionCatalogV1,
      states,
      sessionSize,
      now: new Date().toISOString(),
      recentTargetIds: recentHistory.recentTargetIds,
      recentCandidateIds: recentHistory.recentCandidateIds,
    });

    return {
      success: true,
      plan,
      diagnostics: {
        sessionSize,
        catalogSize: nepSessionCatalogV1.length,
        stateCount: states.length,
        recentAttemptCount: recentAttemptResult.data?.length ?? 0,
        rawResponseSelected: false,
        fullMetadataSelected: false,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Lỗi hệ thống khi tạo session plan: ${message}` };
  }
}
