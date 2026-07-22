import { z } from "zod";

export const PILOT_EVENT_NAMES = [
  "pilot_landing_viewed",
  "pilot_started",
  "unit_started",
  "first_speaking_started",
  "first_speaking_completed",
  "unit_completed",
  "day_7_returned",
  "checkpoint_completed",
  "final_speaking_completed",
] as const;

export type PilotEventName = (typeof PILOT_EVENT_NAMES)[number];

export const PILOT_EVENT_SOURCES = [
  "landing",
  "landing_hero",
  "landing_final_cta",
  "app",
  "lesson",
  "manual",
] as const;

const unitEventNames = new Set<PilotEventName>([
  "unit_started",
  "first_speaking_started",
  "first_speaking_completed",
  "unit_completed",
]);

const scoredEventNames = new Set<PilotEventName>([
  "first_speaking_completed",
  "checkpoint_completed",
  "final_speaking_completed",
]);

export const PilotEventInputSchema = z
  .object({
    eventName: z.enum(PILOT_EVENT_NAMES),
    anonymousId: z.string().uuid().optional(),
    source: z.enum(PILOT_EVENT_SOURCES).optional(),
    unitId: z.string().min(1).max(64).regex(/^unit-[a-z0-9-]+$/).optional(),
    dayNumber: z.number().int().min(1).max(28).optional(),
    score: z.number().int().min(0).max(100).optional(),
    starCount: z.number().int().min(1).max(3).optional(),
    passed: z.boolean().optional(),
  })
  .strict()
  .superRefine((input, ctx) => {
    if (unitEventNames.has(input.eventName) && !input.unitId) {
      ctx.addIssue({
        code: "custom",
        path: ["unitId"],
        message: "unitId is required for lesson events",
      });
    }

    if (scoredEventNames.has(input.eventName) && input.score === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["score"],
        message: "score is required for completed speaking events",
      });
    }

    if (input.eventName === "day_7_returned" && input.dayNumber !== 7) {
      ctx.addIssue({
        code: "custom",
        path: ["dayNumber"],
        message: "day_7_returned must use dayNumber 7",
      });
    }
  });

export type PilotEventInput = z.infer<typeof PilotEventInputSchema>;
