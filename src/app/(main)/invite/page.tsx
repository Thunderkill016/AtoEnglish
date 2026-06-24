import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InviteClient from "./InviteClient";

export const metadata: Metadata = {
  title: "Mời Bạn Học Cùng | AtoEnglish",
  description: "Chia sẻ AtoEnglish với bạn bè — học tiếng Anh cùng nhau hiệu quả hơn!",
};

export default async function InvitePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Use first 8 chars of UUID as referral code — unique enough, no migration needed
  const refCode = user.id.replace(/-/g, "").slice(0, 10).toUpperCase();
  const displayName = user.user_metadata?.full_name?.split(" ")[0] || "bạn";

  return <InviteClient refCode={refCode} displayName={displayName} />;
}
