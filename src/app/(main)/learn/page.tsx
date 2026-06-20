import type { Metadata } from "next";
import {
  getUserProgress,
  getCurrentUnit,
} from "@/app/actions/progress";
import { UNITS } from "@/lib/constants/units";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import LearnClient from "./components/LearnClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bài học",
  description: "Khám phá lộ trình học tiếng Anh A1–B2 với các bài học tương tác, từ vựng và luyện nói.",
};

export const revalidate = 0; // Disable caching

export default async function LearnPage() {
  const [progressRes, activeUnitRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
  ]);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const completedUnitIds: string[] = [];
  let userLevel = "A1";
  let totalXp = 0;

  if (progressRes.success && progressRes.progress) {
    userLevel = progressRes.progress.current_level || "A1";
    totalXp = progressRes.progress.total_xp || 0;
  }

  // Get completed unit list + XP earned from database
  const completedXpMap = new Map<string, number>();
  if (user) {
    const { data: completedLessons } = await supabase
      .from("user_lesson_progress")
      .select("unit_id, xp_earned")
      .eq("user_id", user.id);
    
    if (completedLessons) {
      completedLessons.forEach(l => {
        completedUnitIds.push(l.unit_id);
        completedXpMap.set(l.unit_id, l.xp_earned || 0);
      });
    }
  }

  // Check how many cards have been saved in SRS for vocab progress calculation
  let savedWords = new Set<string>();
  if (user) {
    const allWords = UNITS.flatMap(unit =>
      (UNIT_VOCABULARY[unit.id] || []).map(v => v.word.toLowerCase().trim())
    );

    const { data: userCards } = await supabase
      .from("cards")
      .select("word")
      .eq("user_id", user.id)
      .in("word", allWords);

    if (userCards) {
      savedWords = new Set(userCards.map(c => c.word.toLowerCase().trim()));
    }
  }

  const unitStatuses = UNITS.map((unit) => {
    const isCompleted = completedUnitIds.includes(unit.id);
    const vocab = UNIT_VOCABULARY[unit.id] || [];
    const savedCount = vocab.filter(v => savedWords.has(v.word.toLowerCase().trim())).length;
    
    let progress = 0;
    if (isCompleted) {
      progress = 100;
    } else if (vocab.length > 0 && savedCount > 0) {
      if (savedCount < vocab.length) {
        progress = 40;
      } else {
        progress = 75;
      }
    }

    const xpEarned = completedXpMap.get(unit.id) ?? 0;
    const starCount = isCompleted
      ? xpEarned >= unit.xp ? 3 : xpEarned >= Math.round(unit.xp * 0.82) ? 2 : 1
      : 0;

    return {
      id: unit.id,
      title: unit.title,
      description: unit.description,
      level: unit.level,
      route: unit.route,
      xp: unit.xp,
      estimatedTime: unit.estimatedTime,
      completed: isCompleted,
      progress,
      vocabCount: vocab.length,
      starCount,
    };
  });

  const activeUnitId = activeUnitRes.success && activeUnitRes.unitId ? activeUnitRes.unitId : "unit-1";

  return (
    <LearnClient
      userLevel={userLevel}
      totalXp={totalXp}
      completedUnitIds={completedUnitIds}
      activeUnitId={activeUnitId}
      unitStatuses={unitStatuses}
    />
  );
}