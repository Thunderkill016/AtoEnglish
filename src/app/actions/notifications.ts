"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";

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
  const rateErr = await checkActionRateLimit(notifLimiter, "Tốc độ quá giới hạn.");
  if (rateErr) return { success: false, error: rateErr };

  const validated = PreferencesSchema.safeParse(prefs);
  if (!validated.success) return { success: false, error: "Dữ liệu không hợp lệ." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  const { error } = await supabase
    .from("user_progress")
    .update({
      notification_hour: validated.data.notificationHour,
      email_notifications: validated.data.emailNotifications,
    })
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

  return {
    notificationHour: data?.notification_hour ?? 20,
    emailNotifications: data?.email_notifications ?? true,
  };

}
