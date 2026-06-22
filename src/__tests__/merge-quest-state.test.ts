import { describe, it, expect } from "vitest";

import { mergeDashboardQuests } from "@/lib/dashboard/merge-quest-state";

describe("mergeDashboardQuests", () => {
  const server = [
    { id: 1, text: "Lesson", xp: 20, completed: true },
    { id: 2, text: "SRS", xp: 15, completed: false },
    { id: 3, text: "Speaking", xp: 15, completed: false },
  ];

  it("returns server quests when no local save", () => {
    expect(mergeDashboardQuests(server, null)).toEqual(server);
    expect(mergeDashboardQuests(server, [])).toEqual(server);
  });

  it("never un-completes server-detected quests", () => {
    const saved = [
      { id: 1, text: "Lesson", xp: 20, completed: false },
      { id: 2, text: "SRS", xp: 15, completed: true },
    ];
    const merged = mergeDashboardQuests(server, saved);
    expect(merged[0].completed).toBe(true);
    expect(merged[1].completed).toBe(true);
    expect(merged[2].completed).toBe(false);
  });

  it("preserves manual checkbox completions from localStorage", () => {
    const saved = [{ id: 3, text: "Speaking", xp: 15, completed: true }];
    const merged = mergeDashboardQuests(server, saved);
    expect(merged[2].completed).toBe(true);
  });
});