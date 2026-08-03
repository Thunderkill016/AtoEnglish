"use server";

import { headers } from "next/headers";

import { generatePrivateLesson } from "@/features/real-talk/application/generate-private-lesson";
import type { GenerateLessonResult as GenerateLessonResultContract } from "@/features/real-talk/domain/generation-result";
import { persistOwnerPrivateDraft } from "@/features/real-talk/server/draft-repository";
import {
  fetchOwnerPrivateDraftBySlug,
  listOwnerPrivateDrafts,
} from "@/features/real-talk/server/private-draft-library";
import { compilePrivateNaturalLesson } from "@/features/real-talk/server/private-lesson-compiler";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type { RealTalkLevel } from "@/types/real-talk";

export type { GenerateLessonResult } from "@/features/real-talk/domain/generation-result";

const generateLimiter = createRateLimiter(5, 60 * 1000, "real-talk-generate");

export async function generateRealTalkLesson(
  youtubeUrl: string,
  level: RealTalkLevel = "A1",
): Promise<GenerateLessonResultContract> {
  return generatePrivateLesson(
    { youtubeUrl, level },
    {
      getAuthenticatedUserId: async () => {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        return error ? null : (user?.id ?? null);
      },
      checkRateLimit: async (userId) => {
        const requestHeaders = await headers();
        const ip =
          requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          requestHeaders.get("x-real-ip") ||
          "127.0.0.1";
        const result = await generateLimiter.check(`${userId}:${ip}`);
        if (result.success) return { success: true };

        return {
          success: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((result.resetTime - Date.now()) / 1000),
          ),
        };
      },
      compile: compilePrivateNaturalLesson,
      persist: persistOwnerPrivateDraft,
    },
  );
}

export async function fetchPrivateRealTalkLibrary() {
  return listOwnerPrivateDrafts();
}

export async function fetchPrivateRealTalkLesson(slug: string) {
  return fetchOwnerPrivateDraftBySlug(slug);
}
