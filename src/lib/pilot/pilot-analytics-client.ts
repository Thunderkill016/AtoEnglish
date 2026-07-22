"use client";

import { recordPilotEvent } from "@/app/actions/pilot-analytics";
import type { PilotEventInput, PilotEventName } from "@/lib/pilot/pilot-analytics";

const ANONYMOUS_ID_KEY = "ato_pilot_anonymous_id";
const PILOT_STARTED_AT_KEY = "ato_pilot_started_at";
const EVENT_ONCE_PREFIX = "ato_pilot_event_once";
const PERSISTENT_EVENT_ONCE_PREFIX = "ato_pilot_event_persistent_once";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PilotEventClientPayload = Omit<PilotEventInput, "eventName" | "anonymousId">;

function getOrCreateAnonymousId(): string | null {
  if (typeof window === "undefined" || !globalThis.crypto?.randomUUID) return null;

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
    if (existing && UUID_PATTERN.test(existing)) return existing;

    const created = globalThis.crypto.randomUUID();
    window.localStorage.setItem(ANONYMOUS_ID_KEY, created);
    return created;
  } catch {
    return globalThis.crypto.randomUUID();
  }
}

function rememberPilotStartedAt(): void {
  try {
    if (!window.localStorage.getItem(PILOT_STARTED_AT_KEY)) {
      window.localStorage.setItem(PILOT_STARTED_AT_KEY, String(Date.now()));
    }
  } catch {
    // Analytics must never block navigation or learning.
  }
}

async function sendPilotEvent(
  eventName: PilotEventName,
  payload: PilotEventClientPayload,
): Promise<boolean> {
  const anonymousId = getOrCreateAnonymousId();
  if (!anonymousId) return false;
  if (eventName === "pilot_started") rememberPilotStartedAt();

  try {
    const result = await recordPilotEvent({ eventName, anonymousId, ...payload });
    return result.success;
  } catch {
    return false;
  }
}

export function trackPilotEvent(
  eventName: PilotEventName,
  payload: PilotEventClientPayload = {},
): void {
  if (typeof window === "undefined") return;
  void sendPilotEvent(eventName, payload);
}

export function trackPilotEventOnce(
  eventName: PilotEventName,
  dedupeKey: string,
  payload: PilotEventClientPayload = {},
): void {
  if (typeof window === "undefined") return;

  const storageKey = `${EVENT_ONCE_PREFIX}:${eventName}:${dedupeKey}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "pending");
  } catch {
    // Continue without deduplication when storage is unavailable.
  }

  void sendPilotEvent(eventName, payload).then((success) => {
    try {
      if (success) window.sessionStorage.setItem(storageKey, "1");
      else window.sessionStorage.removeItem(storageKey);
    } catch {
      // Analytics must never block the product.
    }
  });
}

export function trackPilotEventPersistentlyOnce(
  eventName: PilotEventName,
  dedupeKey: string,
  payload: PilotEventClientPayload = {},
): void {
  if (typeof window === "undefined") return;

  const persistentKey = `${PERSISTENT_EVENT_ONCE_PREFIX}:${eventName}:${dedupeKey}`;
  const pendingKey = `${EVENT_ONCE_PREFIX}:pending:${eventName}:${dedupeKey}`;
  try {
    if (window.localStorage.getItem(persistentKey)) return;
    if (window.sessionStorage.getItem(pendingKey)) return;
    window.sessionStorage.setItem(pendingKey, "1");
  } catch {
    // Continue without deduplication when storage is unavailable.
  }

  void sendPilotEvent(eventName, payload).then((success) => {
    try {
      window.sessionStorage.removeItem(pendingKey);
      if (success) window.localStorage.setItem(persistentKey, "1");
    } catch {
      // Analytics must never block the product.
    }
  });
}

export function trackDaySevenReturnIfDue(): void {
  if (typeof window === "undefined") return;

  try {
    const startedAt = Number(window.localStorage.getItem(PILOT_STARTED_AT_KEY));
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < SEVEN_DAYS_MS) return;
  } catch {
    return;
  }

  trackPilotEventPersistentlyOnce("day_7_returned", "day-7", {
    source: "app",
    dayNumber: 7,
  });
}
