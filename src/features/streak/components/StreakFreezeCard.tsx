"use client";

interface StreakFreezeCardProps {
  freezesAvailable: number;
  isAtRisk?: boolean;
  freezeActive?: boolean;
  onFreezeActivated?: (newCount: number) => void;
}

/**
 * Compatibility shell for the retired streak-freeze mechanic.
 * The active product no longer surfaces or encourages streak protection rewards.
 */
export default function StreakFreezeCard(_props: StreakFreezeCardProps) {
  return null;
}
