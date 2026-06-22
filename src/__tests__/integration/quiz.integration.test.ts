/**
 * Integration tests: saveQuizResult()
 */

import { describe, it, expect, beforeEach } from "vitest";
import { adminClient, testUserId } from "../setup-integration";

const getAction = () => import("@/app/actions/quiz");

async function cleanQuizResults() {
  await adminClient
    .from("quiz_results")
    .delete()
    .eq("user_id", testUserId);
}

describe("saveQuizResult()", () => {
  beforeEach(async () => {
    await cleanQuizResults();
  });

  it("persists quiz result and awards XP", async () => {
    const { saveQuizResult } = await getAction();

    const result = await saveQuizResult({
      unitId: "unit-1",
      score: 8,
      total: 10,
    });

    expect(result.success).toBe(true);
    expect(result.xpEarned).toBe(15);
    expect(result.totalXpEarned).toBe(15);

    const { data, count } = await adminClient
      .from("quiz_results")
      .select("*", { count: "exact" })
      .eq("user_id", testUserId);

    expect(count).toBe(1);
    expect(data![0].unit_id).toBe("unit-1");
    expect(data![0].pct).toBe(80);
    expect(data![0].xp_earned).toBe(15);
  });

  it("does not double-award XP on same-day retry with same score", async () => {
    const { saveQuizResult } = await getAction();

    await saveQuizResult({ unitId: "unit-1", score: 5, total: 10 });
    const retry = await saveQuizResult({ unitId: "unit-1", score: 5, total: 10 });

    expect(retry.success).toBe(true);
    expect(retry.alreadyRecorded).toBe(true);
    expect(retry.xpEarned).toBe(0);

    const { count } = await adminClient
      .from("quiz_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", testUserId);

    expect(count).toBe(1);
  });

  it("awards XP delta when retry improves score same day", async () => {
    const { saveQuizResult } = await getAction();

    await saveQuizResult({ unitId: "unit-2", score: 5, total: 10 });
    const improved = await saveQuizResult({ unitId: "unit-2", score: 9, total: 10 });

    expect(improved.success).toBe(true);
    expect(improved.xpEarned).toBe(5);
    expect(improved.totalXpEarned).toBe(15);

    const { data } = await adminClient
      .from("quiz_results")
      .select("xp_earned, pct")
      .eq("user_id", testUserId)
      .eq("unit_id", "unit-2")
      .single();

    expect(data!.xp_earned).toBe(15);
    expect(data!.pct).toBe(90);
  });
});