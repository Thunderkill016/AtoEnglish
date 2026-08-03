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

const GEMINI_SCHEMA_KEYS = new Set([
  "$id",
  "$defs",
  "$ref",
  "$anchor",
  "type",
  "format",
  "title",
  "description",
  "enum",
  "items",
  "prefixItems",
  "minItems",
  "maxItems",
  "minimum",
  "maximum",
  "anyOf",
  "oneOf",
  "properties",
  "additionalProperties",
  "required",
  "propertyOrdering",
]);

const LESSON_TOP_LEVEL_KEYS = new Set([
  "title",
  "titleVi",
  "level",
  "estimatedMinutes",
  "canDoStatement",
  "canDoStatementVi",
  "topics",
  "environment",
  "speakers",
  "transcript",
  "communicationEvents",
  "preWatch",
  "whileWatch",
  "postWatch",
  "transferTask",
]);

export type GeminiRequestPart =
  | { text: string }
  | {
      file_data: {
        file_uri: string;
        mime_type?: string;
      };
      video_metadata?: {
        start_offset?: string;
        end_offset?: string;
        fps?: number;
      };
    };

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Gemini accepts only a documented subset of JSON Schema. Zod remains the
 * authoritative runtime validator; this function removes unsupported prompt-
 * time keywords so the provider cannot reject an otherwise valid request.
 */
export function sanitizeGeminiJsonSchema(schema: unknown): unknown {
  if (!isRecord(schema)) return schema;

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (!GEMINI_SCHEMA_KEYS.has(key)) continue;

    if ((key === "properties" || key === "$defs") && isRecord(value)) {
      sanitized[key] = Object.fromEntries(
        Object.entries(value).map(([name, child]) => [
          name,
          sanitizeGeminiJsonSchema(child),
        ]),
      );
      continue;
    }

    if (
      (key === "items" || key === "additionalProperties") &&
      isRecord(value)
    ) {
      sanitized[key] = sanitizeGeminiJsonSchema(value);
      continue;
    }

    if (
      (key === "anyOf" || key === "oneOf" || key === "prefixItems") &&
      Array.isArray(value)
    ) {
      sanitized[key] = value.map((child) => sanitizeGeminiJsonSchema(child));
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

function normalizeRequestParts(params: {
  prompt?: string;
  parts?: readonly GeminiRequestPart[];
}) {
  const parts = params.parts?.length
    ? [...params.parts]
    : params.prompt
      ? [{ text: params.prompt }]
      : [];

  if (parts.length === 0) {
    throw new TypeError("Gemini request requires at least one content part.");
  }

  return parts;
}

export async function requestGeminiText(params: {
  apiKey: string;
  model: string;
  prompt?: string;
  parts?: readonly GeminiRequestPart[];
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
    const parts = normalizeRequestParts(params);
    const response = await fetchImpl(
      `${endpointBase}/${encodeURIComponent(params.model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": params.apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
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

  if (
    isRecord(raw) &&
    Object.keys(raw).some((key) => !LESSON_TOP_LEVEL_KEYS.has(key))
  ) {
    return generationFailure(
      "MODEL_OUTPUT_INVALID",
      "Bản nháp Gemini chứa trường cấp cao không được phép.",
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
  const responseJsonSchema = sanitizeGeminiJsonSchema(
    generatedLessonDraftSchema.toJSONSchema(),
  );
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
