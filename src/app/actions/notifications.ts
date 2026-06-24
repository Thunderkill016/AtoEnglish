"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";

const notifLimiter = createRateLimiter(5, 60 * 1000, "notif-prefs");

const PreferencesSchema = z.object({
  notificationHour: z.number().int().min(0).max(23),
  emailNotifications: z.boolean(),
});

/**
 * Save notification preferences (preferred hour + email opt-in) to user_progress.
 */
export async function saveNotificationPreferences(
  prefs: z.infer<typeof PreferencesSchema>
): Promise<{ success: boolean; error?: string }> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rl = await notifLimiter.check(ip);
  if (!rl.success) return { success: false, error: "Tốc độ quá giới hạn." };

  const validated = PreferencesSchema.safeParse(prefs);
  if (!validated.success) return { success: false, error: "Dữ liệu không hợp lệ." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  const { error } = await supabase
    .from("user_progress")
    // `as never` bypasses strict generated types for columns added by migration
    // 20260625000000_notification_preferences.sql. Remove after `npm run db:types`.
    .update({
      notification_hour: validated.data.notificationHour,
      email_notifications: validated.data.emailNotifications,
    } as never)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };

}

/**
 * Get current notification preferences for the settings page.
 */
export async function getNotificationPreferences(): Promise<{
  notificationHour: number;
  emailNotifications: boolean;
} | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_progress")
    .select("notification_hour, email_notifications")
    .eq("user_id", user.id)
    .maybeSingle();

  // Cast through unknown until migration types are generated
  const row = data as unknown as { notification_hour?: number; email_notifications?: boolean } | null;
  return {
    notificationHour: row?.notification_hour ?? 20,
    emailNotifications: row?.email_notifications ?? true,
  };

}
