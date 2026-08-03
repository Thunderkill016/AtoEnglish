import type { Metadata } from "next";

import PrivateLessonGenerator from "@/features/real-talk/components/PrivateLessonGenerator";

export const metadata: Metadata = {
  title: "Tạo bài học từ YouTube | AtoEnglish",
  description:
    "Dán một video YouTube có caption tiếng Anh và tạo bài học nghe–nói riêng tư bằng AI.",
};

export default function RealTalkCreatePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:py-16">
      <PrivateLessonGenerator />
    </main>
  );
}
