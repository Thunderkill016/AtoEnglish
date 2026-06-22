export interface DashboardQuest {
  id: number;
  text: string;
  xp: number;
  completed: boolean;
}

/**
 * Merge server-derived quest state with optional localStorage overrides.
 * Server auto-detection (lessons, SRS, speaking) always wins; localStorage
 * can only add manual checkbox completions.
 */
export function mergeDashboardQuests(
  serverQuests: DashboardQuest[],
  savedQuests: DashboardQuest[] | null | undefined,
): DashboardQuest[] {
  if (!savedQuests?.length) return serverQuests;

  return serverQuests.map((serverQuest) => {
    const saved = savedQuests.find((q) => q.id === serverQuest.id);
    if (!saved) return serverQuest;
    return {
      ...serverQuest,
      completed: serverQuest.completed || saved.completed,
    };
  });
}