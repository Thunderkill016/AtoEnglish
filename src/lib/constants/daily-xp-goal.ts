export const DEFAULT_DAILY_XP_GOAL = 50;

export const DAILY_XP_GOAL_MIN = 5;
export const DAILY_XP_GOAL_MAX = 200;

/** Onboarding time preference → daily XP goal */
export const ONBOARDING_XP_GOAL_MAP: Record<string, number> = {
  "5min": 20,
  "15min": 50,
  "30min": 100,
  "60min": 200,
};

/** Dashboard quick-select options */
export const DASHBOARD_XP_GOAL_OPTIONS = [30, 50, 80, 100] as const;

/** Settings page dropdown options */
export const SETTINGS_XP_GOAL_OPTIONS = [20, 30, 50, 80, 100, 200] as const;

export function isValidDailyXpGoal(goal: number): boolean {
  return (
    Number.isInteger(goal) &&
    goal >= DAILY_XP_GOAL_MIN &&
    goal <= DAILY_XP_GOAL_MAX
  );
}

export function resolveDailyXpGoal(goal: number | null | undefined): number {
  if (goal != null && isValidDailyXpGoal(goal)) return goal;
  return DEFAULT_DAILY_XP_GOAL;
}

export function goalFromOnboardingTime(time: string | null | undefined): number {
  if (!time) return DEFAULT_DAILY_XP_GOAL;
  return resolveDailyXpGoal(ONBOARDING_XP_GOAL_MAP[time]);
}