/**
 * Integration tests: atomic award_user_xp RPC
 */

import { describe, it, expect, beforeEach } from "vitest";
import { adminClient, testUserId } from "../setup-integration";
import { awardXpAndUpdateStreak } from "@/lib/progress/award-xp";

function testClient() {
  const client = globalThis.__testSupabaseClient;
  if (!client) throw new Error("Integration test client not initialized");
  return client;
}

async function resetProgress() {
  await adminClient
    .from("user_progress")
    .update({ total_xp: 0, streak: 0, last_active_date: null })
    .eq("user_id", testUserId);
}

describe("awardXpAndUpdateStreak (RPC)", () => {
  beforeEach(async () => {
    await resetProgress();
  });

  it("increments total_xp atomically on sequential awards", async () => {
    const client = testClient();
    const first = await awardXpAndUpdateStreak(client, testUserId, 30);
    const second = await awardXpAndUpdateStreak(client, testUserId, 20);

    expect(first?.totalXp).toBe(30);
    expect(second?.totalXp).toBe(50);

    const { data } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    expect(data!.total_xp).toBe(50);
  });

  it("does not lose XP under parallel awards", async () => {
    const client = testClient();

    await Promise.all([
      awardXpAndUpdateStreak(client, testUserId, 10),
      awardXpAndUpdateStreak(client, testUserId, 20),
      awardXpAndUpdateStreak(client, testUserId, 15),
    ]);

    const { data } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    expect(data!.total_xp).toBe(45);
  });

  it("syncs streak with zero XP (flashcard-only path)", async () => {
    const client = testClient();
    const result = await awardXpAndUpdateStreak(client, testUserId, 0);

    expect(result?.streak).toBe(1);
    expect(result?.totalXp).toBe(0);
    expect(result?.lastActiveDate).toBeTruthy();
  });
});