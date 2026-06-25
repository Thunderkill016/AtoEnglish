/**
 * Integration tests: saveChallengeResult()
 */

import { describe, it, expect, beforeEach } from "vitest";
import { adminClient, testUserId } from "../setup-integration";

const getActions = () => import("@/app/actions/challenge");

async function cleanChallenge() {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  await adminClient
    .from("challenge_results")
    .delete()
    .eq("user_id", testUserId)
    .eq("challenge_date", today);
  await adminClient
    .from("user_progress")
    .update({ total_xp: 0, streak: 0 })
    .eq("user_id", testUserId);
}

describe("saveChallengeResult()", () => {
  beforeEach(async () => {
    await cleanChallenge();
  });

  it("persists result and awards XP on first completion", async () => {
    const { saveChallengeResult } = await getActions();
    const today = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    const { data: before } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    const result = await saveChallengeResult({
      score: 4,
      total: 5,
      date: today,
    });

    expect(result.success).toBe(true);
    expect(result.xpEarned).toBe(42);

    const { data: row } = await adminClient
      .from("challenge_results")
      .select("score, xp_earned")
      .eq("user_id", testUserId)
      .eq("challenge_date", today)
      .single();

    expect(row?.score).toBe(4);
    expect(row?.xp_earned).toBe(42);

    const { data: after } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    expect(after!.total_xp).toBe((before?.total_xp ?? 0) + 42);
  });

  it("is idempotent — second save same day does not double XP", async () => {
    const { saveChallengeResult } = await getActions();
    const today = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    await saveChallengeResult({ score: 3, total: 5, date: today });

    const { data: mid } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    const second = await saveChallengeResult({ score: 5, total: 5, date: today });
    expect(second.success).toBe(true);
    expect(second.alreadyCompleted).toBe(true);

    const { data: after } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    expect(after!.total_xp).toBe(mid!.total_xp);
  });
});