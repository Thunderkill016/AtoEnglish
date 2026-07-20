import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms | AtoEnglish",
};

export default function TermsPage() {
  return (
    <Page narrow={false}>
      <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-4")}>
        ← Home
      </Link>
      <PageHeader
        description="Open Beta — sản phẩm đang phát triển."
      />
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          AtoEnglish cung cấp công cụ tự học tiếng Anh miễn phí trong giai đoạn Open
          Beta. Nội dung mang tính giáo dục, không thay thế khóa học chính quy.
        </p>
        <p>
          Bạn chịu trách nhiệm về nội dung tự tạo (journal, ghi âm). Không lạm dụng
          hệ thống, spam, hoặc cố gắng phá hoại dịch vụ.
        </p>
        <p>
          Chúng tôi có thể thay đổi tính năng hoặc tạm dừng dịch vụ khi cần bảo trì.
        </p>
      </div>
    </Page>
  );
}
