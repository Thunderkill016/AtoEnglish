"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import type { Database } from "@/types/supabase";

const pushLimiter = createRateLimiter(10, 60 * 1000, "push");

// Zod schema for Web Push subscription
const PushSubscriptionSchema = z.object({
  endpoint: z.string().url("endpoint phải là URL hợp lệ").max(2048),
  keys: z.object({
    p256dh: z.string().min(1).max(512),
    auth: z.string().min(1).max(256),
  }),
  userAgent: z.string().max(512).optional(),
});

type PushSubscriptionInsert =
  Database["public"]["Tables"]["push_subscriptions"]["Insert"];

/**
 * Save a Web Push subscription to the database
 */
export async function savePushSubscription(
  subscription: z.infer<typeof PushSubscriptionSchema>
): Promise<{ success: boolean; error?: string }> {
  const rateErr = await checkActionRateLimit(
    pushLimiter,
    "Tốc độ quá giới hạn. Thử lại sau.",
  );
  if (rateErr) return { success: false, error: rateErr };

  // Input validation
  const validated = PushSubscriptionSchema.safeParse(subscription);
  if (!validated.success) {
    return {
      success: false,
      error: `Dữ liệu không hợp lệ: ${validated.error.issues.map((e) => e.message).join(", ")}`,
    };
  }
  const { endpoint, keys, userAgent } = validated.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  const upsertData: PushSubscriptionInsert = {
    user_id: user.id,
    endpoint,
    keys: keys as Database["public"]["Tables"]["push_subscriptions"]["Row"]["keys"],
    user_agent: userAgent,
  };

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(upsertData, { onConflict: "user_id,endpoint" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Remove a push subscription from the database
 */
export async function removePushSubscription(
  endpoint: string
): Promise<{ success: boolean }> {
  const rateErr = await checkActionRateLimit(pushLimiter);
  if (rateErr) return { success: false };

  if (!endpoint || typeof endpoint !== "string") return { success: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint.slice(0, 2048)); // prevent oversized input

  return { success: true };
}

/**
 * Check if user has an active push subscription
 */
export async function hasPushSubscription(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { count } = await supabase
    .from("push_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (count ?? 0) > 0;
}
