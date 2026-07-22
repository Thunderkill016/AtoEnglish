import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { PILOT_EVENT_NAMES, PilotEventInputSchema } from "./pilot-analytics";

describe("pilot analytics taxonomy", () => {
  it("keeps the roadmap event names exact and complete", () => {
    expect(PILOT_EVENT_NAMES).toEqual([
      "pilot_landing_viewed",
      "pilot_started",
      "unit_started",
      "first_speaking_started",
      "first_speaking_completed",
      "unit_completed",
      "day_7_returned",
      "checkpoint_completed",
      "final_speaking_completed",
    ]);
  });

  it("accepts only flat non-sensitive scalar fields", () => {
    expect(
      PilotEventInputSchema.parse({
        eventName: "unit_completed",
        anonymousId: "71d6aa6e-9182-4a71-9945-d4895da6c1f2",
        source: "lesson",
        unitId: "unit-a0-1",
        score: 82,
        starCount: 2,
        passed: true,
      }),
    ).toMatchObject({ eventName: "unit_completed", unitId: "unit-a0-1" });

    expect(
      PilotEventInputSchema.safeParse({
        eventName: "first_speaking_completed",
        unitId: "unit-a0-1",
        score: 70,
        transcript: "My name is...",
      }).success,
    ).toBe(false);

    expect(
      PilotEventInputSchema.safeParse({
        eventName: "first_speaking_completed",
        unitId: "unit-a0-1",
        score: 70,
        audio: { url: "https://example.com/recording.mp3" },
      }).success,
    ).toBe(false);
  });

  it("requires unit ids and bounded scores for lesson outcome events", () => {
    expect(
      PilotEventInputSchema.safeParse({
        eventName: "unit_started",
        source: "lesson",
      }).success,
    ).toBe(false);

    expect(
      PilotEventInputSchema.safeParse({
        eventName: "first_speaking_completed",
        unitId: "unit-a0-1",
        score: 101,
      }).success,
    ).toBe(false);
  });

  it("keeps the database boundary free of learner content fields", () => {
    const migration = readFileSync(
      resolve(process.cwd(), "supabase/migrations/20260722090000_pilot_events.sql"),
      "utf8",
    );
    const tableDefinition = migration.match(
      /create table if not exists public\.pilot_events \(([\s\S]*?)\n\);/,
    )?.[1];

    expect(tableDefinition).toBeDefined();
    expect(tableDefinition).not.toMatch(
      /\b(audio|transcript|email|name|employer|payload|metadata|content)\b/i,
    );
  });

  it("keeps the seven-day return event deterministic", () => {
    expect(
      PilotEventInputSchema.safeParse({
        eventName: "day_7_returned",
        dayNumber: 7,
      }).success,
    ).toBe(true);

    expect(
      PilotEventInputSchema.safeParse({
        eventName: "day_7_returned",
        dayNumber: 8,
      }).success,
    ).toBe(false);
  });
});
