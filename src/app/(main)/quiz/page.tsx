import type { Metadata } from "next";
import VocabQuizClient from "./VocabQuizClient";

export const metadata: Metadata = {
  title: "Quiz Từ vựng",
  description: "Kiểm tra từ vựng tiếng Anh theo unit với bài quiz trắc nghiệm. Chọn nghĩa đúng và xem kết quả ngay.",
  robots: { index: false },
};

export default function QuizPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <VocabQuizClient />
    </main>
  );
}
