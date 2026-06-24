// ── League types and constants — safe to import from both client and server ───
// Separated from leagues.ts (which has "use server") to avoid Next.js build error:
// "A 'use server' file can only export async functions"

export type LeagueTier = "bronze" | "silver" | "gold" | "emerald" | "diamond";

export const TIER_CONFIG: Record<
  LeagueTier,
  { label: string; emoji: string; gradient: string; nextTier: LeagueTier | null }
> = {
  bronze:  { label: "Bronze",  emoji: "🥉", gradient: "from-amber-700 to-amber-500",   nextTier: "silver"  },
  silver:  { label: "Silver",  emoji: "🥈", gradient: "from-zinc-400 to-zinc-300",     nextTier: "gold"    },
  gold:    { label: "Gold",    emoji: "🥇", gradient: "from-yellow-500 to-amber-400",  nextTier: "emerald" },
  emerald: { label: "Emerald", emoji: "💚", gradient: "from-emerald-500 to-teal-400",  nextTier: "diamond" },
  diamond: { label: "Diamond", emoji: "💎", gradient: "from-cyan-400 to-blue-400",     nextTier: null      },
};

export interface LeagueMember {
  user_id: string;
  display_name: string;
  xp_this_week: number;
  rank: number;
  isMe: boolean;
}

export interface LeagueData {
  league_id: string;
  tier: LeagueTier;
  week_start: string;
  members: LeagueMember[];
  myXp: number;
  myRank: number;
  daysLeft: number;
  isPromotionZone: boolean;   // top 5
  isRelegationZone: boolean;  // bottom 5 (if ≥10 members)
}
