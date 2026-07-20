import { StatLine } from "@/components/ui/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng Xếp Hạng | AtoEnglish",
  description:
    "Top học viên AtoEnglish theo XP. Cạnh tranh lành mạnh và cùng nhau tiến bộ.",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
