import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  Languages,
  Lightbulb,
  MessageCircle,
  Mic,
  Mic2,
  Puzzle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { IPOR_META, type IporPhase } from "@/lib/lessons/learning-flow";

export interface SectionTheme {
  icon: LucideIcon;
  title: string;
  duration: string;
  phase: IporPhase;
}

export const SECTION_THEME: Record<number, SectionTheme> = {
  1: { icon: Lightbulb, title: "Khởi động", duration: "~3 phút", phase: "input" },
  2: { icon: BookOpen, title: "Từ vựng", duration: "~5 phút", phase: "input" },
  3: { icon: BookMarked, title: "Ngữ pháp", duration: "~5 phút", phase: "processing" },
  4: { icon: Puzzle, title: "Luyện tập", duration: "~8 phút", phase: "processing" },
  5: { icon: MessageCircle, title: "Hội thoại", duration: "~5 phút", phase: "input" },
  10: { icon: Zap, title: "Phản xạ", duration: "~4 phút", phase: "processing" },
  9: { icon: Languages, title: "Dịch câu", duration: "~5 phút", phase: "output" },
  6: { icon: Mic, title: "Shadowing", duration: "~5 phút", phase: "output" },
  7: { icon: Mic2, title: "Luyện nói", duration: "~5 phút", phase: "output" },
  8: { icon: CheckCircle2, title: "Hoàn thành", duration: "~5 phút", phase: "review" },
};

export function getSectionTheme(sectionId: number): SectionTheme {
  return (
    SECTION_THEME[sectionId] ?? {
      icon: BookOpen,
      title: "Bài học",
      duration: "",
      phase: "input",
    }
  );
}

export function phaseAccentRing(phase: IporPhase): string {
  const map: Record<IporPhase, string> = {
    input: "from-sky-500/20 to-emerald-500/10",
    processing: "from-violet-500/20 to-indigo-500/10",
    output: "from-amber-500/20 to-orange-500/10",
    review: "from-emerald-500/20 to-teal-500/10",
  };
  return map[phase];
}

export function phaseIconColor(phase: IporPhase): string {
  return IPOR_META[phase].activeColor.split(" ")[0] ?? "text-emerald-400";
}