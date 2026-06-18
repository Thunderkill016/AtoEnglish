import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
      
      // Kiểm tra xem user_progress đã tồn tại chưa
      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle(); // sử dụng maybeSingle để tránh ném lỗi khi không tìm thấy record
        
      if (progressError || !progress) {
        // Tự động khởi tạo bản ghi tiến trình học tập cho user mới đăng nhập lần đầu
        await supabase.from("user_progress").insert({
          user_id: user.id,
          current_level: "A1",
          streak: 0,
          total_xp: 0,
        });
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
