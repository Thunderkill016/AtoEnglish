"use server";

import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import {
  CompleteV2LessonSchema,
  SyncV2ProgressSchema,
} from "@/lib/security/validation";
import type { LessonProgressRecord } from "@/lib/v2/progress";

const completeLimiter = createRateLimiter(40, 60_000, "v2-progress-complete");
const syncLimiter = createRateLimiter(20, 60_000, "v2-progress-sync");
const fetchLimiter = createRateLimiter(60, 60_000, "v2-progress-fetch");

export type V2ProgressActionResult =
  | { success: true; upserted?: number }
  | { success: false; error: string; guestMode?: boolean; upserted?: number };

export type V2ProgressFetchResult =
  | { success: true; records: LessonProgressRecord[] }
  | { success: false; error: string; records: LessonProgressRecord[]; guestMode?: boolean };

/**
 * Upsert one v2 lesson completion for the authenticated user.
 * Guest / unauth → guestMode no-op (fire-and-forget safe from player).
 */
export async function completeV2Lesson(params: {
  lessonId: string;
  quizCorrect: number;
  quizTotal: number;
  taskDone: boolean;
  completedAt?: string;
}): Promise<V2ProgressActionResult> {
  try {
    const rateErr = await checkActionRateLimit(
      completeLimiter,
      "Quá nhiều yêu cầu. Thử lại sau.",
    );
    if (rateErr) return { success: false, error: rateErr };

    const validated = CompleteV2LessonSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }
    const clean = validated.data;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Chưa đăng nhập.", guestMode: true };
    }

    const completedAt = clean.completedAt ?? new Date().toISOString();
    const now = new Date().toISOString();

    const { error } = await supabase.from("user_v2_lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: clean.lessonId,
        completed_at: completedAt,
        quiz_correct: clean.quizCorrect,
        quiz_total: clean.quizTotal,
        task_done: clean.taskDone,
        updated_at: now,
      },
      { onConflict: "user_id,lesson_id" },
    );

    if (error) return { success: false, error: "Không lưu được tiến độ." };
    return { success: true };
  } catch {
    return { success: false, error: "Lỗi hệ thống." };
  }
}

/**
 * Fetch all v2 completions for current user (hydrate multi-device).
 */
export async function fetchV2LessonProgress(): Promise<V2ProgressFetchResult> {
  try {
    const rateErr = await checkActionRateLimit(fetchLimiter);
    if (rateErr) {
      return { success: false, error: rateErr, records: [] };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Chưa đăng nhập.",
        records: [],
        guestMode: true,
      };
    }

    const { data, error } = await supabase
      .from("user_v2_lesson_progress")
      .select("lesson_id, completed_at, quiz_correct, quiz_total, task_done")
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: "Không tải được tiến độ.", records: [] };
    }

    const records: LessonProgressRecord[] = (data ?? []).map((row) => ({
      lessonId: row.lesson_id,
      completedAt: row.completed_at,
      quizCorrect: row.quiz_correct,
      quizTotal: row.quiz_total,
      taskDone: row.task_done,
    }));

    return { success: true, records };
  } catch {
    return { success: false, error: "Lỗi hệ thống.", records: [] };
  }
}

/**
 * Push localStorage records to DB (auth only). Used once after login.
 * ignoreDuplicates-style: upsert overwrites scores on conflict.
 */
export async function syncV2ProgressFromLocal(params: {
  records: LessonProgressRecord[];
}): Promise<V2ProgressActionResult> {
  try {
    const rateErr = await checkActionRateLimit(
      syncLimiter,
      "Quá nhiều yêu cầu. Thử lại sau.",
    );
    if (rateErr) return { success: false, error: rateErr };

    const validated = SyncV2ProgressSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }
    const { records } = validated.data;

    if (records.length === 0) return { success: true, upserted: 0 };

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Chưa đăng nhập.", guestMode: true };
    }

    const now = new Date().toISOString();
    const rows = records.map((r) => ({
      user_id: user.id,
      lesson_id: r.lessonId,
      completed_at: r.completedAt,
      quiz_correct: r.quizCorrect,
      quiz_total: r.quizTotal,
      task_done: r.taskDone,
      updated_at: now,
    }));

    const { error } = await supabase
      .from("user_v2_lesson_progress")
      .upsert(rows, { onConflict: "user_id,lesson_id" });

    if (error) return { success: false, error: "Không đồng bộ được tiến độ." };
    return { success: true, upserted: rows.length };
  } catch {
    return { success: false, error: "Lỗi hệ thống." };
  }
}
