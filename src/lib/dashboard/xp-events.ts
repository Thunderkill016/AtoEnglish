/** Notify mounted Dashboard to bump today's XP bar immediately. */
export function dispatchXpEarned(xp: number): void {
  if (typeof window === "undefined" || xp <= 0) return;
  window.dispatchEvent(new CustomEvent("ato:xp-earned", { detail: { xp } }));
}