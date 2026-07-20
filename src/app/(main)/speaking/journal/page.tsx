import { StatLine } from "@/components/ui/page";
import type { Metadata } from "next";
import { SpeakingSubShell } from "../SpeakingSubShell";
import { JournalMode } from "../journal-mode";

export const metadata: Metadata = {
  title: "Daily Journal | Luyện nói — AtoEnglish",
  description:
    "Nhật ký nói tự do — luyện fluency và ý tưởng bằng tiếng Anh mỗi ngày.",
  robots: { index: false },
};

export default function JournalPage() {
  return (
    <SpeakingSubShell title="Journal"
    >
      <JournalMode />
    </SpeakingSubShell>
  );
}
