import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const ADAPTER_ID = "supabase-reviewed-transcript-v1";
const MAX_REFERENCE_LENGTH = 1_000;
const SECRET_REFERENCE_PATTERN =
  /(?:access[_-]?token|authorization|api[_-]?key|signature|x-goog-signature|x-amz-signature)=/i;

const RIGHTS_BY_MODE = {
  creator_provided: ["creator_owned"],
  authorized_export: ["creator_owned", "authorized_editor_export"],
  licensed_source: ["explicit_license"],
  public_domain: ["public_domain"],
  human_reviewed_upload: [
    "creator_owned",
    "authorized_editor_export",
    "explicit_license",
    "public_domain",
  ],
  approved_provider_api: ["authorized_editor_export", "explicit_license"],
} as const;

type AcquisitionMode = keyof typeof RIGHTS_BY_MODE;
type RightsBasis = (typeof RIGHTS_BY_MODE)[AcquisitionMode][number];
type TranscriptCue = { text: string; offset: number; duration: number };

type ValidatedSubmission = {
  provider: string;
  sourceExternalId: string;
  canonicalSourceUrl: string;
  sourceReference: string;
  language: string;
  acquisitionMode: AcquisitionMode;
  rightsBasis: RightsBasis;
  rightsReference: string;
  cues: TranscriptCue[];
  warnings: string[];
  cueDigest: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function response(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireBoundedString(
  value: unknown,
  label: string,
  maxLength = MAX_REFERENCE_LENGTH,
): string {
  if (typeof value !== "string") throw new Error(`${label} is required`);
  const normalized = value.trim();
  if (
    !normalized ||
    normalized.length > maxLength ||
    /[\r\n\0]/.test(normalized)
  ) {
    throw new Error(`${label} is invalid`);
  }
  return normalized;
}

function requireSafeReference(value: unknown, label: string): string {
  const normalized = requireBoundedString(value, label);
  if (SECRET_REFERENCE_PATTERN.test(normalized)) {
    throw new Error(`${label} cannot contain secret material`);
  }
  return normalized;
}

function canonicalizeUrl(value: unknown): string {
  const raw = requireBoundedString(value, "canonicalSourceUrl");
  const url = new URL(raw);
  if (url.protocol !== "https:") {
    throw new Error("canonicalSourceUrl must use HTTPS");
  }
  url.hash = "";
  return url.toString();
}

function normalizeCues(value: unknown): TranscriptCue[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 200) {
    throw new Error("cues must contain between 2 and 200 timed items");
  }

  let previousOffset = -1;
  return value.map((item, index) => {
    if (!isRecord(item)) throw new Error(`cue ${index} is invalid`);
    const text = requireBoundedString(item.text, `cue ${index} text`, 500).replace(
      /\s+/g,
      " ",
    );
    const offset = Number(item.offset);
    const duration = Number(item.duration);
    if (
      !Number.isFinite(offset) ||
      offset < 0 ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      offset < previousOffset
    ) {
      throw new Error(`cue ${index} timing is invalid or out of order`);
    }
    previousOffset = offset;
    return {
      text,
      offset: Number(offset.toFixed(3)),
      duration: Number(duration.toFixed(3)),
    };
  });
}

function normalizeWarnings(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 20) {
    throw new Error("warnings must be a bounded string array");
  }
  return value.map((warning, index) =>
    requireBoundedString(warning, `warning ${index}`, 500),
  );
}

async function computeCueDigest(cues: TranscriptCue[]): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(cues));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function validateSubmission(value: unknown): Promise<ValidatedSubmission> {
  if (!isRecord(value)) throw new Error("submission payload is invalid");

  const provider = requireBoundedString(value.provider, "provider", 120);
  const sourceExternalId = requireBoundedString(
    value.sourceExternalId,
    "sourceExternalId",
    160,
  );
  const canonicalSourceUrl = canonicalizeUrl(value.canonicalSourceUrl);
  const sourceReference = requireSafeReference(
    value.sourceReference,
    "sourceReference",
  );
  const language = requireBoundedString(value.language, "language", 40).toLowerCase();
  if (!/^[a-z]{2}(-[a-z0-9]+)*$/.test(language)) {
    throw new Error("language is invalid");
  }

  const acquisitionMode = value.acquisitionMode as AcquisitionMode;
  if (!(acquisitionMode in RIGHTS_BY_MODE)) {
    throw new Error("acquisitionMode is not approved");
  }
  const rightsBasis = value.rightsBasis as RightsBasis;
  const allowedRights = RIGHTS_BY_MODE[acquisitionMode] as readonly string[];
  if (!allowedRights.includes(rightsBasis)) {
    throw new Error("rightsBasis is incompatible with acquisitionMode");
  }

  const rightsReference = requireSafeReference(
    value.rightsReference,
    "rightsReference",
  );
  const cues = normalizeCues(value.cues);
  const warnings = normalizeWarnings(value.warnings);
  const cueDigest = await computeCueDigest(cues);

  return {
    provider,
    sourceExternalId,
    canonicalSourceUrl,
    sourceReference,
    language,
    acquisitionMode,
    rightsBasis,
    rightsReference,
    cues,
    warnings,
    cueDigest,
  };
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return response(405, { error: "method_not_allowed" });
  }

  const token = bearerToken(request);
  if (!token) return response(401, { error: "auth_required" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response(503, { error: "service_not_configured" });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(token);
  if (userError || !user) return response(401, { error: "auth_required" });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response(400, { error: "invalid_json" });
  }
  if (!isRecord(body)) return response(400, { error: "invalid_request" });

  try {
    if (body.action === "submit") {
      const submission = await validateSubmission(body.submission);
      const { data: existing, error: existingError } = await admin
        .from("real_talk_transcript_sources")
        .select("id, submitted_by, review_status")
        .eq("adapter_id", ADAPTER_ID)
        .eq("source_external_id", submission.sourceExternalId)
        .eq("language", submission.language)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing?.review_status === "human_verified") {
        return response(409, { error: "verified_source_is_immutable" });
      }
      if (existing && existing.submitted_by !== user.id) {
        return response(403, { error: "source_owned_by_another_submitter" });
      }

      const payload = {
        adapter_id: ADAPTER_ID,
        provider: submission.provider,
        source_external_id: submission.sourceExternalId,
        canonical_source_url: submission.canonicalSourceUrl,
        source_reference: submission.sourceReference,
        language: submission.language,
        acquisition_mode: submission.acquisitionMode,
        rights_basis: submission.rightsBasis,
        rights_reference: submission.rightsReference,
        cues: submission.cues,
        cue_digest: submission.cueDigest,
        review_status: "unreviewed",
        submitted_by: user.id,
        submitted_at: new Date().toISOString(),
        reviewed_by: null,
        reviewed_at: null,
        warnings: submission.warnings,
      };

      const write = existing
        ? admin
            .from("real_talk_transcript_sources")
            .update(payload)
            .eq("id", existing.id)
            .select("id, review_status, cue_digest")
            .single()
        : admin
            .from("real_talk_transcript_sources")
            .insert(payload)
            .select("id, review_status, cue_digest")
            .single();
      const { data, error } = await write;
      if (error || !data) throw error ?? new Error("submission write failed");

      return response(200, {
        sourceId: data.id,
        reviewStatus: data.review_status,
        cueDigest: data.cue_digest,
      });
    }

    if (body.action === "approve") {
      if (user.app_metadata?.real_talk_reviewer !== true) {
        return response(403, { error: "reviewer_role_required" });
      }
      const sourceId = requireBoundedString(body.sourceId, "sourceId", 64);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sourceId)) {
        return response(400, { error: "invalid_source_id" });
      }

      const { data: row, error: rowError } = await admin
        .from("real_talk_transcript_sources")
        .select("*")
        .eq("id", sourceId)
        .single();
      if (rowError || !row) return response(404, { error: "source_not_found" });
      if (row.review_status === "human_verified") {
        return response(409, { error: "verified_source_is_immutable" });
      }
      if (row.submitted_by === user.id) {
        return response(403, { error: "independent_reviewer_required" });
      }

      const reviewed = await validateSubmission({
        provider: row.provider,
        sourceExternalId: row.source_external_id,
        canonicalSourceUrl: row.canonical_source_url,
        sourceReference: row.source_reference,
        language: row.language,
        acquisitionMode: row.acquisition_mode,
        rightsBasis: row.rights_basis,
        rightsReference: row.rights_reference,
        cues: row.cues,
        warnings: row.warnings,
      });
      if (reviewed.cueDigest !== row.cue_digest) {
        return response(409, { error: "cue_integrity_mismatch" });
      }

      const reviewedAt = new Date().toISOString();
      const { data, error } = await admin
        .from("real_talk_transcript_sources")
        .update({
          review_status: "human_verified",
          reviewed_by: user.id,
          reviewed_at: reviewedAt,
        })
        .eq("id", sourceId)
        .eq("review_status", "unreviewed")
        .select("id, review_status, cue_digest, reviewed_at")
        .single();
      if (error || !data) throw error ?? new Error("review write failed");

      return response(200, {
        sourceId: data.id,
        reviewStatus: data.review_status,
        cueDigest: data.cue_digest,
        reviewedAt: data.reviewed_at,
      });
    }

    return response(400, { error: "unsupported_action" });
  } catch (error) {
    console.error("real-talk-transcript-review failed", error);
    return response(400, { error: "transcript_review_request_failed" });
  }
});
