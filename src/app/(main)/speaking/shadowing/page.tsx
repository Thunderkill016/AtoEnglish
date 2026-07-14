import type { Metadata } from "next";
import { SpeakingSubShell } from "../SpeakingSubShell";
import { ShadowingPractice } from "../shadowing-practice";

export const metadata: Metadata = {
  title: "Shadowing Practice | Luyện nói — AtoEnglish",
  description:
    "Luyện nói đuổi theo audio bản xứ để xây phản xạ phát âm và ngữ điệu.",
  robots: { index: false },
};

export default function ShadowingPage() {
  return (
    <SpeakingSubShell
      title="Shadowing Practice"
      subtitle="Nói đuổi theo audio bản xứ"
    >
      <ShadowingPractice />
    </SpeakingSubShell>
  );
}
