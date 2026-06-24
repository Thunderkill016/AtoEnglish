import type { Metadata } from "next";
import { Suspense } from "react";
import { getChallengeLevel } from "@/app/actions/challenge";
import ChallengeClient from "./ChallengeClient";

export const metadata: Metadata = {
  title: "Thử Thách Hôm Nay | AtoEnglish",
  description:
    "5 câu hỏi từ vựng mỗi ngày — hoàn thành để nhận tối đa 50 XP. Thử thách mới reset lúc nửa đêm.",
  robots: { index: false },
};

export default async function ChallengePage() {
  const level = await getChallengeLevel();

  return (
    <main id="main-content" className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ChallengeClient level={level} />
      </Suspense>
    </main>
  );
}
