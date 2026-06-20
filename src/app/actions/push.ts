"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Save a Web Push subscription to the database
 */
export async function savePushSubscription(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("push_subscriptions")
    .upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys as any,
        user_agent: subscription.userAgent,
      },
      { onConflict: "user_id,endpoint" }
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Remove a push subscription from the database
 */
export async function removePushSubscription(
  endpoint: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  return { success: true };
}

/**
 * Check if user has an active push subscription
 */
export async function hasPushSubscription(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count } = await supabase
    .from("push_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (count ?? 0) > 0;
}
