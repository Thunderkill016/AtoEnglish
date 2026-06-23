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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user progress + active unit + completed lessons + saved vocab words in parallel
  const allWords = user ? UNITS.flatMap(unit =>
    (UNIT_VOCABULARY[unit.id] || []).map(v => v.word.toLowerCase().trim())
  ) : [];

  const [progressRes, activeUnitRes, completedLessonsRes, userCardsRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
    user
      ? supabase.from("user_lesson_progress").select("unit_id, xp_earned").eq("user_id", user.id)
      : Promise.resolve({ data: null }),
    user && allWords.length > 0
      ? supabase.from("cards").select("word").eq("user_id", user.id).in("word", allWords)
      : Promise.resolve({ data: null }),
  ]);

  let userLevel = "A1";
  let totalXp = 0;

  if (progressRes.success && progressRes.progress) {
    userLevel = progressRes.progress.current_level || "A1";
    totalXp = progressRes.progress.total_xp || 0;
  }

  // Build completed units and vocab maps from parallel results
  const completedUnitIds: string[] = [];
  const completedXpMap = new Map<string, number>();
  const completedLessons = completedLessonsRes.data;
  if (completedLessons) {
    completedLessons.forEach((l: { unit_id: string; xp_earned: number | null }) => {
      completedUnitIds.push(l.unit_id);
      completedXpMap.set(l.unit_id, l.xp_earned || 0);
    });
  }

  const savedWords = new Set(
    (userCardsRes.data || []).map((c: { word: string }) => c.word.toLowerCase().trim())
  );

  const unitStatuses = UNITS.map((unit) => {
    const isCompleted = completedUnitIds.includes(unit.id);
    const vocab = UNIT_VOCABULARY[unit.id] || [];
    const savedCount = vocab.filter(v => savedWords.has(v.word.toLowerCase().trim())).length;
    
    let progress = 0;
    if (isCompleted) {
      progress = 100;
    } else if (vocab.length > 0 && savedCount > 0) {
      // Proportional: 5%–70% based on how many vocab words are saved to SRS
      // Cap at 70% — completion (100%) only happens when unit is fully done
      const ratio = Math.min(savedCount / vocab.length, 1);
      progress = Math.round(5 + ratio * 65); // 5%–70%
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