import {
  generationFailure,
  type GenerationFailure,
} from "@/features/real-talk/domain/generation-result";

const DEFAULT_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const CURRENT_API_REVISION = "2026-05-20";

export type GeminiInteractionInput =
  | { type: "text"; text: string }
  | { type: "video"; uri: string }
  | { type: "audio"; uri: string }
  | { type: "image"; uri: string };

export type GeminiInteractionResult =
  | {
      success: true;
      text: string;
      model: string;
      interactionId: string | null;
    }
  | {
      success: false;
      failure: GenerationFailure;
      retryable: boolean;
      status?: number;
    };

interface GeminiInteractionResponse {
  id?: unknown;
  model?: unknown;
  status?: unknown;
  steps?: Array<{
    type?: unknown;
    content?: Array<{
      type?: unknown;
      text?: unknown;
    }>;
  }>;
}

function readOutputText(payload: GeminiInteractionResponse) {
  return (payload.steps ?? [])
    .filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .filter((content) => content.type === "text")
    .map((content) =>
      typeof content.text === "string" ? content.text : "",
    )
    .join("")
    .trim();
}

export async function requestGeminiInteraction(params: {
  apiKey: string;
  model: string;
  input: readonly GeminiInteractionInput[];
  responseJsonSchema?: unknown;
  maxOutputTokens?: number;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  endpoint?: string;
  apiRevision?: string;
}): Promise<GeminiInteractionResult> {
  if (params.input.length === 0) {
    return {
      success: false,
      failure: generationFailure(
        "INVALID_INPUT",
        "Gemini interaction requires at least one input item.",
      ),
      retryable: false,
    };
  }

  const fetchImpl = params.fetchImpl ?? fetch;
  const responseFormat = params.responseJsonSchema
    ? {
        type: "text",
        mime_type: "application/json",
        schema: params.responseJsonSchema,
      }
    : { type: "text" };

  try {
    const response = await fetchImpl(params.endpoint ?? DEFAULT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": params.apiKey,
        "Api-Revision": params.apiRevision ?? CURRENT_API_REVISION,
      },
      body: JSON.stringify({
        model: params.model,
        input: params.input,
        response_format: responseFormat,
        store: false,
        generation_config: {
          max_output_tokens: params.maxOutputTokens ?? 12_000,
          thinking_level: "low",
          thinking_summaries: "none",
        },
      }),
      signal: AbortSignal.timeout(params.timeoutMs ?? 120_000),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          failure: generationFailure(
            "MODEL_RATE_LIMITED",
            "Gemini đang vượt quota. Hãy đợi rồi thử lại.",
            { retryAfterSeconds: 60 },
          ),
          retryable: true,
          status: response.status,
        };
      }

      return {
        success: false,
        failure: generationFailure(
          "MODEL_UNAVAILABLE",
          "Gemini video analysis tạm thời không khả dụng.",
          { retryAfterSeconds: response.status >= 500 ? 30 : undefined },
        ),
        retryable: response.status >= 500,
        status: response.status,
      };
    }

    const payload = (await response.json()) as GeminiInteractionResponse;
    const text = readOutputText(payload);
    if (!text || payload.status !== "completed") {
      return {
        success: false,
        failure: generationFailure(
          "MODEL_OUTPUT_INVALID",
          "Gemini không trả về video analysis hoàn chỉnh.",
        ),
        retryable: false,
        status: response.status,
      };
    }

    return {
      success: true,
      text,
      model:
        typeof payload.model === "string" ? payload.model : params.model,
      interactionId: typeof payload.id === "string" ? payload.id : null,
    };
  } catch {
    return {
      success: false,
      failure: generationFailure(
        "MODEL_UNAVAILABLE",
        "Không thể kết nối với Gemini video analysis.",
        { retryAfterSeconds: 30 },
      ),
      retryable: true,
    };
  }
}
