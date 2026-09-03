export const OPENAI_REALTIME_MODEL = "gpt-realtime-2.1" as const;
export const OPENAI_REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe" as const;
export const OPENAI_REALTIME_VOICE = "marin" as const;

export const MAX_REALTIME_SDP_BYTES = 64 * 1024;

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
        create_response: true;
        interrupt_response: true;
      };
    };
    output: {
      voice: typeof OPENAI_REALTIME_VOICE;
    };
  };
};

/**
 * Transport-level policy only.
 *
 * Canonical Nếp actions remain the authority for what the learner should practice and what counts
 * as evidence. The realtime model is deliberately prohibited from declaring mastery or producing
 * pronunciation scores. Task-specific instructions can be layered on later from server-resolved
 * canonical practice metadata.
 */
export function buildOpenAIRealtimeSessionConfig(): OpenAIRealtimeSessionConfig {
  return {
    type: "realtime",
    model: OPENAI_REALTIME_MODEL,
    instructions: [
      "You are AtoEnglish's realtime English speaking partner.",
      "Keep each reply concise and natural, normally one short conversational turn.",
      "Let the learner finish speaking; beginners may pause while formulating an answer.",
      "Do not grade, score, declare mastery, or claim pronunciation accuracy.",
      "Do not reveal hidden answer keys or invent learner progress.",
      "AtoEnglish's trusted server evaluates learning evidence separately.",
    ].join(" "),
    max_output_tokens: 128,
    audio: {
      input: {
        transcription: {
          model: OPENAI_REALTIME_TRANSCRIPTION_MODEL,
          language: "en",
        },
        turn_detection: {
          type: "semantic_vad",
          eagerness: "low",
          create_response: true,
          interrupt_response: true,
        },
      },
      output: {
        voice: OPENAI_REALTIME_VOICE,
      },
    },
  };
}

export function isPlausibleRealtimeSdpOffer(sdp: string): boolean {
  const bytes = new TextEncoder().encode(sdp).byteLength;
  if (bytes <= 0 || bytes > MAX_REALTIME_SDP_BYTES) return false;

  const normalized = sdp.replace(/\r\n/g, "\n").trim();
  return normalized.startsWith("v=0") && normalized.includes("\nm=audio ");
}
