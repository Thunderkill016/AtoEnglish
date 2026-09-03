export const OPENAI_REALTIME_MODEL = "gpt-realtime-2.1" as const;
export const OPENAI_REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe" as const;
export const OPENAI_REALTIME_VOICE = "marin" as const;

export const MAX_REALTIME_SDP_BYTES = 64 * 1024;

export type OpenAIRealtimeMode = "capture" | "conversation";

export type OpenAIRealtimeSessionConfig = {
  type: "realtime";
  model: typeof OPENAI_REALTIME_MODEL;
  instructions: string;
  max_output_tokens: number;
  audio: {
    input: {
      transcription: {
        model: typeof OPENAI_REALTIME_TRANSCRIPTION_MODEL;
        language: "en";
      };
      turn_detection: {
        type: "semantic_vad";
        eagerness: "low";
        create_response: boolean;
        interrupt_response: boolean;
      };
    };
    output: {
      voice: typeof OPENAI_REALTIME_VOICE;
    };
  };
};

const CAPTURE_ONLY_INSTRUCTIONS = [
  "This session is capture-only for AtoEnglish learning evidence.",
  "Do not produce a conversational response.",
  "Do not grade, score, declare mastery, or claim pronunciation accuracy.",
  "AtoEnglish's trusted server evaluates the transient input transcript separately.",
].join(" ");

/**
 * Transport-level policy.
 *
 * `capture` can be created without task context. `conversation` fails closed unless the server has
 * already resolved a canonical Nếp task and supplied task-specific roleplay instructions.
 */
export function buildOpenAIRealtimeSessionConfig(
  mode: OpenAIRealtimeMode = "capture",
  conversationInstructions?: string,
): OpenAIRealtimeSessionConfig {
  const conversation = mode === "conversation";
  const instructions = conversation
    ? conversationInstructions?.trim()
    : CAPTURE_ONLY_INSTRUCTIONS;

  if (conversation && !instructions) {
    throw new Error("Realtime conversation requires canonical task instructions.");
  }

  return {
    type: "realtime",
    model: OPENAI_REALTIME_MODEL,
    instructions: instructions ?? CAPTURE_ONLY_INSTRUCTIONS,
    max_output_tokens: conversation ? 128 : 1,
    audio: {
      input: {
        transcription: {
          model: OPENAI_REALTIME_TRANSCRIPTION_MODEL,
          language: "en",
        },
        turn_detection: {
          type: "semantic_vad",
          eagerness: "low",
          create_response: conversation,
          interrupt_response: conversation,
        },
      },
      output: {
        voice: OPENAI_REALTIME_VOICE,
      },
    },
  };
}

export function isOpenAIRealtimeMode(value: string | null): value is OpenAIRealtimeMode {
  return value === "capture" || value === "conversation";
}

export function isPlausibleRealtimeSdpOffer(sdp: string): boolean {
  const bytes = new TextEncoder().encode(sdp).byteLength;
  if (bytes <= 0 || bytes > MAX_REALTIME_SDP_BYTES) return false;

  const normalized = sdp.replace(/\r\n/g, "\n").trim();
  return normalized.startsWith("v=0") && normalized.includes("\nm=audio ");
}
