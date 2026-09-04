type JsonRecord = Record<string, unknown>;

export type AtoEnglishRealtimeSignal =
  | {
      kind: "session-ready";
      sessionId: string | null;
    }
  | {
      kind: "learner-transcript";
      transcript: string;
      itemId: string | null;
    }
  | {
      kind: "assistant-transcript";
      transcript: string;
      itemId: string | null;
      responseId: string | null;
    }
  | {
      kind: "response-done";
      responseId: string | null;
    }
  | {
      kind: "provider-error";
      code: string | null;
      message: string;
    };

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(record: JsonRecord, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function decodeEvent(raw: unknown): JsonRecord | null {
  if (isRecord(raw)) return raw;
  if (typeof raw !== "string") return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Convert the small subset of OpenAI Realtime server events that AtoEnglish needs into a
 * provider-independent signal contract.
 *
 * Input transcription is diagnostic language evidence only. OpenAI documents the transcript as a
 * rough guide to the audio; this parser deliberately exposes no pronunciation score or mastery
 * interpretation.
 */
export function parseOpenAIRealtimeServerEvent(
  raw: unknown,
): AtoEnglishRealtimeSignal | null {
  const event = decodeEvent(raw);
  if (!event) return null;

  const type = stringField(event, "type");
  if (!type) return null;

  if (type === "session.created") {
    const session = isRecord(event.session) ? event.session : null;
    return {
      kind: "session-ready",
      sessionId: session ? stringField(session, "id") : null,
    };
  }

  if (type === "conversation.item.input_audio_transcription.completed") {
    return {
      kind: "learner-transcript",
      transcript: stringField(event, "transcript")?.trim() ?? "",
      itemId: stringField(event, "item_id"),
    };
  }

  if (type === "response.output_audio_transcript.done") {
    return {
      kind: "assistant-transcript",
      transcript: stringField(event, "transcript")?.trim() ?? "",
      itemId: stringField(event, "item_id"),
      responseId: stringField(event, "response_id"),
    };
  }

  if (type === "response.done") {
    const response = isRecord(event.response) ? event.response : null;
    return {
      kind: "response-done",
      responseId: response ? stringField(response, "id") : null,
    };
  }

  if (type === "error") {
    const providerError = isRecord(event.error) ? event.error : null;
    return {
      kind: "provider-error",
      code: providerError ? stringField(providerError, "code") : null,
      message:
        (providerError ? stringField(providerError, "message") : null) ??
        "Realtime provider reported an unknown error.",
    };
  }

  return null;
}
