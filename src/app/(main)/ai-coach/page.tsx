import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AICoachClient from "./AICoachClient";

export const metadata: Metadata = {
  title: "AI Writing Coach | AtoEnglish",
  description: "Viết tiếng Anh và nhận phản hồi tức thì từ AI — sửa lỗi ngữ pháp, giải thích bằng tiếng Việt, theo dõi tiến bộ.",
};

export default async function AICoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <AICoachClient />;
}
