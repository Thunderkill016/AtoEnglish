import {
  generationFailure,
  type GenerateLessonResult,
} from "@/features/real-talk/domain/generation-result";
import type { PersistPrivateDraftResult } from "@/features/real-talk/server/draft-repository";
import type { PrivateLessonCompilationResult } from "@/features/real-talk/server/private-lesson-compiler";
import { generateRealTalkInputSchema } from "@/lib/real-talk/generation-contract";
import type { RealTalkLevel } from "@/types/real-talk";

export interface GenerationRateLimitDecision {
  success: boolean;
  retryAfterSeconds?: number;
}

export interface GeneratePrivateLessonDependencies {
  getAuthenticatedUserId(): Promise<string | null>;
  checkRateLimit(userId: string): Promise<GenerationRateLimitDecision>;
  compile(params: {
    youtubeUrl: string;
    level: RealTalkLevel;
  }): Promise<PrivateLessonCompilationResult>;
  persist(params: {
    video: Extract<PrivateLessonCompilationResult, { success: true }>["video"];
    draft: Extract<PrivateLessonCompilationResult, { success: true }>["draft"];
    model: string;
    warnings: string[];
    userId: string;
  }): Promise<PersistPrivateDraftResult>;
}

/**
 * Application-level orchestration for private Real Talk generation.
 *
 * This module intentionally owns ordering and result semantics while transport,
 * auth, rate limiting, providers, and persistence are injected. That keeps the
 * Next.js server action thin and makes the critical "auth before external work"
 * and "no persistence after compiler failure" contracts independently testable.
 */
export async function generatePrivateLesson(
  input: { youtubeUrl: string; level: RealTalkLevel },
  dependencies: GeneratePrivateLessonDependencies,
): Promise<GenerateLessonResult> {
  try {
    const parsedInput = generateRealTalkInputSchema.safeParse(input);
    if (!parsedInput.success) {
      return generationFailure(
        "INVALID_INPUT",
        "Link YouTube hoặc cấp độ không hợp lệ.",
      );
    }

    const userId = await dependencies.getAuthenticatedUserId();
    if (!userId) {
      return generationFailure(
        "AUTH_REQUIRED",
        "Bạn cần đăng nhập để tạo bài học bằng Gemini.",
      );
    }

    const rateLimit = await dependencies.checkRateLimit(userId);
    if (!rateLimit.success) {
      return generationFailure(
        "RATE_LIMITED",
        "Bạn đang tạo quá nhiều bài. Hãy thử lại sau.",
        {
          ...(rateLimit.retryAfterSeconds
            ? { retryAfterSeconds: rateLimit.retryAfterSeconds }
            : {}),
        },
      );
    }

    const compiled = await dependencies.compile({
      youtubeUrl: parsedInput.data.youtubeUrl,
      level: parsedInput.data.level,
    });
    if (!compiled.success) return compiled;

    const persisted = await dependencies.persist({
      video: compiled.video,
      draft: compiled.draft,
      model: compiled.model,
      warnings: compiled.warnings,
      userId,
    });
    if (!persisted.success) return persisted;

    const warnings =
      persisted.lesson.generation?.warnings ?? compiled.warnings;

    return {
      success: true,
      status: "ai_draft",
      persisted: true,
      persistence: "saved_private_draft",
      video: persisted.video,
      lesson: persisted.lesson,
      warnings,
      source: {
        provider: "youtube",
        externalId: persisted.video.youtubeId,
        watchUrl:
          persisted.video.source?.watchUrl ?? parsedInput.data.youtubeUrl,
        embedUrl: `https://www.youtube.com/embed/${persisted.video.youtubeId}`,
        selectedStartSeconds: persisted.video.segment.startSeconds,
        selectedEndSeconds: persisted.video.segment.endSeconds,
        acquisitionMode: compiled.transcriptMetadata.acquisitionMode,
      },
      generation: {
        model: compiled.model,
        warnings,
      },
    };
  } catch {
    return generationFailure(
      "INTERNAL_ERROR",
      "Đã xảy ra lỗi nội bộ khi tạo bài học. Không có bản nháp nào được xác nhận là đã lưu.",
      { retryAfterSeconds: 30 },
    );
  }
}
