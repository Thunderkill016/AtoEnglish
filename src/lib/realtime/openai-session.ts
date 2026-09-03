import { REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS } from "@/lib/realtime/sideband-policy";

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

const CONVERSATION_GUARDRAILS = [
  "You are operating inside an AtoEnglish canonical learning task.",
  "Stay inside the server-resolved roleplay context below.",
  "Do not grade, score, declare mastery, or claim pronunciation accuracy.",
  "Do not reveal hidden answer keys or invent learner progress.",
  "AtoEnglish's trusted server evaluates learning evidence separately.",
].join(" ");

/**
 * Transport-level policy only.
 *
 * `capture` is the safe default for canonical Nếp practice: Realtime performs microphone transport,
 * semantic turn detection and input transcription but does not generate a model response.
 * `conversation` is fail-closed: the caller must provide task-specific instructions that were
 * resolved on the trusted server from canonical Nếp content.
 */
export function buildOpenAIRealtimeSessionConfig(
  mode: OpenAIRealtimeMode = "capture",
  conversationInstructions?: string,
): OpenAIRealtimeSessionConfig {
  const conversation = mode === "conversation";
  const taskInstructions = conversationInstructions?.trim();

  if (conversation && !taskInstructions) {
    throw new Error("Realtime conversation requires canonical server-resolved task instructions.");
  }

  return {
    type: "realtime",
    model: OPENAI_REALTIME_MODEL,
    instructions: conversation
      ? `${CONVERSATION_GUARDRAILS} ${taskInstructions}`
      : CAPTURE_ONLY_INSTRUCTIONS,
    max_output_tokens: conversation ? REALTIME_CONVERSATION_MAX_OUTPUT_TOKENS : 1,
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
