import {
  buildNếpRealtimeTutorInstructions,
  resolveNếpRealtimeTutorContext,
} from "@/lib/realtime/nep-tutor-context";

const MAX_LESSON_ID_LENGTH = 160;
const MAX_ACTION_ID_LENGTH = 120;

function boundedHeader(headers: Headers, name: string, maxLength: number): string | null {
  const value = headers.get(name)?.trim();
  if (!value || value.length > maxLength) return null;
  return value;
}

/**
 * Convert an untrusted browser task identity into trusted conversation instructions.
 *
 * Only identifiers cross the browser/server boundary. Lesson mission, prompt and roleplay policy are
 * resolved again from the canonical Nếp registry on the server. Invalid, unsupported or stale task
 * identities fail closed.
 */
export function resolveRealtimeConversationInstructions(headers: Headers): string | null {
  const lessonId = boundedHeader(headers, "x-atoenglish-lesson-id", MAX_LESSON_ID_LENGTH);
  const actionId = boundedHeader(headers, "x-atoenglish-action-id", MAX_ACTION_ID_LENGTH);
  const lessonVersionRaw = boundedHeader(headers, "x-atoenglish-lesson-version", 8);

  if (!lessonId || !actionId || !lessonVersionRaw) return null;

  const lessonVersion = Number(lessonVersionRaw);
  if (!Number.isInteger(lessonVersion) || lessonVersion <= 0) return null;

  const context = resolveNếpRealtimeTutorContext({ lessonId, lessonVersion, actionId });
  if (!context) return null;

  return buildNếpRealtimeTutorInstructions(context);
}
