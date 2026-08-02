import {
  buildNaturalLessonPrompt,
  type NaturalLessonPromptMetadata,
} from "@/features/real-talk/domain/lesson-prompt";
import {
  generationFailure,
  type GenerationFailure,
} from "@/features/real-talk/domain/generation-result";
import type { TranscriptCue } from "@/features/real-talk/domain/transcript-source";
import {
  generatedLessonDraftSchema,
  validateGeneratedDraftEvidence,
  type GeneratedLessonDraft,
} from "@/lib/real-talk/generation-contract";
import type { RealTalkLevel } from "@/types/real-talk";

export const GEMINI_LESSON_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
] as const;

const DEFAULT_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiTextRequestResult =
  | {
      success: true;
      text: string;
      model: string;
    }
  | {
      success: false;
      failure: GenerationFailure;
      retryable: boolean;
      status?: number;
    };

export type ParsedLessonTextResult =
  | { success: true; draft: GeneratedLessonDraft }
  | GenerationFailure;

export interface GeminiLessonProviderOptions {
  apiKey?: string;
  models?: readonly string[];
  attemptsPerModel?: number;
  fetchImpl?: typeof fetch;
  sleep?: (milliseconds: number) => Promise<void>;
  timeoutMs?: number;
  endpointBase?: string;
  parseText?: (
    text: string,
    source: readonly TranscriptCue[],
  ) => ParsedLessonTextResult;
}

export async function requestGeminiText(params: {
  apiKey: string;
  model: string;
  prompt: string;
  responseJsonSchema?: unknown;
  maxOutputTokens?: number;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  endpointBase?: string;
}): Promise<GeminiTextRequestResult> {
  const fetchImpl = params.fetchImpl ?? fetch;
  const endpointBase = (params.endpointBase ?? DEFAULT_ENDPOINT).replace(
    /\/$/,
    "",
  );
  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: params.maxOutputTokens ?? 12_000,
  };

  if (params.responseJsonSchema) {
    generationConfig.responseMimeType = "application/json";
    generationConfig.responseJsonSchema = params.responseJsonSchema;
  }

  try {
    const response = await fetchImpl(
      `${endpointBase}/${encodeURIComponent(params.model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": params.apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: params.prompt }] }],
          generationConfig,
        }),
        signal: AbortSignal.timeout(params.timeoutMs ?? 90_000),
      },
    );

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
          "Gemini tạm thời không khả dụng. Hãy thử lại sau.",
          { retryAfterSeconds: response.status >= 500 ? 30 : undefined },
        ),
        retryable: response.status >= 500,
        status: response.status,
      };
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return {
        success: false,
        failure: generationFailure(
          "MODEL_OUTPUT_INVALID",
          "Gemini không trả về nội dung bài học hợp lệ.",
        ),
        retryable: false,
        status: response.status,
      };
    }

    return { success: true, text, model: params.model };
  } catch {
    return {
      success: false,
      failure: generationFailure(
        "MODEL_UNAVAILABLE",
        "Không thể kết nối với Gemini. Hãy thử lại sau.",
        { retryAfterSeconds: 30 },
      ),
      retryable: true,
    };
  }
}

export function parseEvidenceBoundLessonText(
  text: string,
  source: readonly TranscriptCue[],
): ParsedLessonTextResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text.trim());
  } catch {
    return generationFailure(
      "MODEL_OUTPUT_INVALID",
      "Gemini trả về JSON không hợp lệ.",
    );
  }

  const parsed = generatedLessonDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return generationFailure(
      "MODEL_OUTPUT_INVALID",
      "Bản nháp Gemini không đúng cấu trúc bài học bắt buộc.",
    );
  }

  const evidenceFailures = validateGeneratedDraftEvidence(parsed.data, source);
  if (evidenceFailures.length > 0) {
    return generationFailure(
      "SOURCE_EVIDENCE_FAILED",
      "Bản nháp chứa nội dung không được transcript nguồn hỗ trợ.",
      { evidenceFailures },
    );
  }

  return { success: true, draft: parsed.data };
}

export async function generateEvidenceBoundLessonWithGemini(
  params: {
    source: readonly TranscriptCue[];
    metadata: NaturalLessonPromptMetadata;
    level: RealTalkLevel;
  },
  options: GeminiLessonProviderOptions = {},
): Promise<
  | { success: true; draft: GeneratedLessonDraft; model: string }
  | GenerationFailure
> {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return generationFailure(
      "MODEL_UNAVAILABLE",
      "Gemini chưa được cấu hình cho môi trường này.",
    );
  }

  const models = options.models ?? GEMINI_LESSON_MODELS;
  const attemptsPerModel = Math.max(1, options.attemptsPerModel ?? 2);
  const sleep =
    options.sleep ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  const parseText = options.parseText ?? parseEvidenceBoundLessonText;
  const prompt = buildNaturalLessonPrompt(params);
  const responseJsonSchema = generatedLessonDraftSchema.toJSONSchema();
  let lastFailure: GenerationFailure = generationFailure(
    "MODEL_UNAVAILABLE",
    "Gemini chưa phản hồi thành công. Hãy thử lại sau.",
    { retryAfterSeconds: 30 },
  );

  for (const model of models) {
    for (let attempt = 1; attempt <= attemptsPerModel; attempt += 1) {
      const transport = await requestGeminiText({
        apiKey,
        model,
        prompt,
        responseJsonSchema,
        fetchImpl: options.fetchImpl,
        timeoutMs: options.timeoutMs,
        endpointBase: options.endpointBase,
      });

      if (!transport.success) {
        lastFailure = transport.failure;
        if (transport.retryable && attempt < attemptsPerModel) {
          await sleep(1_500 * attempt);
          continue;
        }
        break;
      }

      const parsed = parseText(transport.text, params.source);
      if (parsed.success) {
        return { success: true, draft: parsed.draft, model };
      }

      lastFailure = parsed;
      break;
    }
  }

  return lastFailure;
}
