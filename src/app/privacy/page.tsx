import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy | AtoEnglish",
};

export default function PrivacyPage() {
  return (
    <Page narrow={false}>
      <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-4")}>
        ← Home
      </Link>
      <PageHeader
        description="Cách AtoEnglish thu thập và bảo vệ dữ liệu của bạn."
      />
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          AtoEnglish dùng Supabase (Auth + Postgres) với Row Level Security. Dữ liệu
          học tập gắn với tài khoản của bạn; chúng tôi không bán dữ liệu cá nhân.
        </p>
        <p>
          Tiến độ guest lưu trên trình duyệt (localStorage). Khi đăng nhập, tiến độ
          v2 có thể đồng bộ lên server khi đã cấu hình.
        </p>
        <p>
          Liên hệ: dùng form hỗ trợ trong app hoặc email chủ dự án trên GitHub.
        </p>
      </div>
    </Page>
  );
}
