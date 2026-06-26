/**
 * Integration tests: completeUnit()
 * Tests XP award, idempotency, and DB writes.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { adminClient, testUserId } from "../setup-integration";

const getAction = () => import("@/app/actions/unit");

async function cleanProgress() {
  await adminClient
    .from("user_lesson_progress")
    .delete()
    .eq("user_id", testUserId);

  const today = new Date().toISOString().split("T")[0];

  await adminClient
    .from("user_progress")
    .update({
      total_xp: 0,
      streak: 0,
      current_level: "A0",
      starting_unit_index: 0,
      placement_completed_at: null,
      last_active_date: today,
    })
    .eq("user_id", testUserId);
}

describe("completeUnit()", () => {
  beforeEach(async () => {
    await cleanProgress();
  });

  it("adds XP when completing a unit for the first time", async () => {
    const { completeUnit } = await getAction();

    const { data: before } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    const xpBefore = before?.total_xp ?? 0;

    const result = await completeUnit("unit-1");
    expect(result.success, "error" in result ? result.error : "").toBe(true);
    expect(result.alreadyCompleted).not.toBe(true);

    const { data: after } = await adminClient
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", testUserId)
      .single();

    expect(after!.total_xp).toBeGreaterThan(xpBefore);
  });

  it("is idempotent — completing same unit twice does not award XP twice", async () => {
    const { completeUnit } = await getAction();
    const uid = globalThis.__testUserId ?? testUserId;

    const xp = async () => {
      const { data } = await adminClient
        .from("user_progress")
        .select("total_xp")
        .eq("user_id", uid)
        .single();
      return data?.total_xp ?? 0;
    };

    const xpBefore = await xp();

    // First completion — must award XP
    await completeUnit("unit-2");
    const xpAfterFirst = await xp();
    expect(xpAfterFirst).toBeGreaterThan(xpBefore);

    // Second completion of SAME unit — must NOT award more XP
    await completeUnit("unit-2");
    const xpAfterSecond = await xp();

    // Key invariant: XP frozen after duplicate completion
    expect(xpAfterSecond).toBe(xpAfterFirst);
  });

  it("creates a user_lesson_progress record", async () => {
    const { completeUnit } = await getAction();
    await completeUnit("unit-3");

    const { data, count } = await adminClient
      .from("user_lesson_progress")
      .select("*", { count: "exact" })
      .eq("user_id", testUserId)
      .eq("unit_id", "unit-3");

    expect(count).toBe(1);
    expect(data![0].unit_id).toBe("unit-3");
  });

  it("rejects invalid unitId (SQL injection attempt)", async () => {
    const { completeUnit } = await getAction();
    const result = await completeUnit("'; DROP TABLE user_progress; --");
    expect(result.success).toBe(false);
  });

  it("rejects empty unitId", async () => {
    const { completeUnit } = await getAction();
    const result = await completeUnit("");
    expect(result.success).toBe(false);
  });
});
