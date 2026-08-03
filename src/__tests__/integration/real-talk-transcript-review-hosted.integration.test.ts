import { writeFileSync } from "node:fs";

import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { acquireTranscriptForCompilation } from "@/features/real-talk/server/transcript-source-policy";
import { computeTranscriptCueDigest } from "@/features/real-talk/server/transcript-provenance";
import { createSupabaseReviewedTranscriptSource } from "@/features/real-talk/server/transcript-sources/supabase-reviewed";
import type { AppDatabase } from "@/types/app-database";
import type { Json } from "@/types/supabase";

const SOURCE = {
  id: "1000496",
  url: "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm",
  transcript: "https://commons.wikimedia.org/wiki/TimedText:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm.en.srt",
  rights: "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm#Licensing",
};
const CUES = [
  { text: "one big one left for the end of April,", offset: 21.317, duration: 2.222 },
  { text: "and it's going to be the Iwauni Incredible Race. Iwauni Incredible Race.", offset: 23.539, duration: 3.778 },
  { text: "Yes, so we're gonna have that Saturday, April 25th, from 8 to 1", offset: 27.317, duration: 4.977 },
  { text: "p.m. OK, OK.", offset: 32.294, duration: 2.36 },
];

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

type Client = SupabaseClient<AppDatabase>;
type Payload = Record<string, unknown>;

async function invoke(token: string, body: Payload) {
  const response = await fetch(
    `${env("SPEC001_T061_SUPABASE_URL")}/functions/v1/real-talk-transcript-review`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: env("SPEC001_T061_PUBLISHABLE_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  return {
    status: response.status,
    payload: (await response.json()) as Payload,
  };
}

let submitter: Client;
let reviewer: Client;
let anonymous: Client;
let submitterSession: Session;
let reviewerSession: Session;

beforeAll(async () => {
  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  } as const;
  const url = env("SPEC001_T061_SUPABASE_URL");
  const key = env("SPEC001_T061_PUBLISHABLE_KEY");
  submitter = createClient<AppDatabase>(url, key, options);
  reviewer = createClient<AppDatabase>(url, key, options);
  anonymous = createClient<AppDatabase>(url, key, options);

  const [submitterLogin, reviewerLogin] = await Promise.all([
    submitter.auth.signInWithPassword({
      email: env("SPEC001_T061_SUBMITTER_EMAIL"),
      password: env("SPEC001_T061_SUBMITTER_PASSWORD"),
    }),
    reviewer.auth.signInWithPassword({
      email: env("SPEC001_T061_REVIEWER_EMAIL"),
      password: env("SPEC001_T061_REVIEWER_PASSWORD"),
    }),
  ]);
  if (
    submitterLogin.error ||
    reviewerLogin.error ||
    !submitterLogin.data.session ||
    !reviewerLogin.data.session ||
    submitterLogin.data.user?.id !== env("SPEC001_T061_SUBMITTER_ID") ||
    reviewerLogin.data.user?.id !== env("SPEC001_T061_REVIEWER_ID")
  ) {
    throw new Error("Could not establish bounded T061 Auth sessions");
  }
  submitterSession = submitterLogin.data.session;
  reviewerSession = reviewerLogin.data.session;
});

afterAll(async () => {
  if (submitter) await submitter.auth.signOut();
  if (reviewer) await reviewer.auth.signOut();
});

describe("T061 hosted trusted transcript ingestion", () => {
  it("runs submit, independent review, approved adapter, tamper lock, and cleanup boundary", async () => {
    const submitterId = env("SPEC001_T061_SUBMITTER_ID");
    const reviewerId = env("SPEC001_T061_REVIEWER_ID");
    const digest = computeTranscriptCueDigest(CUES);
    expect(submitterId).not.toBe(reviewerId);

    const directInsert = await submitter
      .from("real_talk_transcript_sources")
      .insert({
        provider: "forged_client",
        source_external_id: "forged-client-write",
        canonical_source_url: SOURCE.url,
        source_reference: SOURCE.transcript,
        language: "en",
        acquisition_mode: "public_domain",
        rights_basis: "public_domain",
        rights_reference: SOURCE.rights,
        cues: CUES as unknown as Json,
        cue_digest: digest,
        submitted_by: submitterId,
      });
    expect(directInsert.error).not.toBeNull();

    const submitted = await invoke(submitterSession.access_token, {
      action: "submit",
      submission: {
        provider: "wikimedia_commons",
        sourceExternalId: SOURCE.id,
        canonicalSourceUrl: SOURCE.url,
        sourceReference: SOURCE.transcript,
        language: "en",
        acquisitionMode: "public_domain",
        rightsBasis: "public_domain",
        rightsReference: SOURCE.rights,
        cues: CUES,
        warnings: [
          "Controlled T061 reviewer-flow fixture; this does not replace T075 human lesson review.",
        ],
      },
    });
    expect(submitted.status).toBe(200);
    expect(submitted.payload).toMatchObject({
      reviewStatus: "unreviewed",
      cueDigest: digest,
    });
    const sourceId = String(submitted.payload.sourceId ?? "");
    expect(sourceId).toMatch(/^[0-9a-f-]{36}$/i);

    const ownerPending = await submitter
      .from("real_talk_transcript_sources")
      .select("id, review_status, submitted_by, reviewed_by")
      .eq("id", sourceId)
      .single();
    expect(ownerPending.error).toBeNull();
    expect(ownerPending.data).toMatchObject({
      review_status: "unreviewed",
      submitted_by: submitterId,
      reviewed_by: null,
    });

    const reviewerPending = await reviewer
      .from("real_talk_transcript_sources")
      .select("id")
      .eq("id", sourceId);
    expect(reviewerPending.error).toBeNull();
    expect(reviewerPending.data).toEqual([]);

    const anonymousPending = await anonymous
      .from("real_talk_transcript_sources")
      .select("id")
      .eq("id", sourceId);
    expect(
      Boolean(anonymousPending.error) || anonymousPending.data?.length === 0,
    ).toBe(true);

    const selfReview = await invoke(submitterSession.access_token, {
      action: "approve",
      sourceId,
    });
    expect(selfReview).toMatchObject({
      status: 403,
      payload: { error: "reviewer_role_required" },
    });

    const approved = await invoke(reviewerSession.access_token, {
      action: "approve",
      sourceId,
    });
    expect(approved.status).toBe(200);
    expect(approved.payload).toMatchObject({
      sourceId,
      reviewStatus: "human_verified",
      cueDigest: digest,
    });

    const row = await reviewer
      .from("real_talk_transcript_sources")
      .select("*")
      .eq("id", sourceId)
      .single();
    expect(row.error).toBeNull();
    expect(row.data).toMatchObject({
      adapter_id: "supabase-reviewed-transcript-v1",
      source_external_id: SOURCE.id,
      acquisition_mode: "public_domain",
      rights_basis: "public_domain",
      review_status: "human_verified",
      submitted_by: submitterId,
      reviewed_by: reviewerId,
      cue_digest: digest,
    });

    const adapter = createSupabaseReviewedTranscriptSource(
      async () => reviewer,
    );
    const acquired = await acquireTranscriptForCompilation({
      adapter,
      request: {
        sourceId: SOURCE.id,
        sourceUrl: SOURCE.url,
        requestedLanguage: "en",
      },
      environment: { NODE_ENV: "production" },
    });
    expect(acquired).toMatchObject({
      cues: CUES,
      metadata: {
        adapterId: "supabase-reviewed-transcript-v1",
        trust: "approved",
        acquisitionMode: "public_domain",
        reviewStatus: "human_verified",
        provenance: {
          rightsBasis: "public_domain",
          submittedByUserId: submitterId,
          reviewedByUserId: reviewerId,
          cueDigestSha256: digest,
        },
      },
    });

    const directTamper = await submitter
      .from("real_talk_transcript_sources")
      .update({ rights_reference: "rights-review:tampered" })
      .eq("id", sourceId)
      .select("id");
    expect(directTamper.error).not.toBeNull();

    const resubmit = await invoke(submitterSession.access_token, {
      action: "submit",
      submission: {
        provider: "wikimedia_commons",
        sourceExternalId: SOURCE.id,
        canonicalSourceUrl: SOURCE.url,
        sourceReference: SOURCE.transcript,
        language: "en",
        acquisitionMode: "public_domain",
        rightsBasis: "public_domain",
        rightsReference: SOURCE.rights,
        cues: CUES,
      },
    });
    expect(resubmit).toMatchObject({
      status: 409,
      payload: { error: "verified_source_is_immutable" },
    });

    const secondApproval = await invoke(reviewerSession.access_token, {
      action: "approve",
      sourceId,
    });
    expect(secondApproval).toMatchObject({
      status: 409,
      payload: { error: "verified_source_is_immutable" },
    });

    writeFileSync(
      env("SPEC001_T061_EVIDENCE_PATH"),
      `${JSON.stringify(
        {
          sourceExternalId: SOURCE.id,
          sourceProvider: "wikimedia_commons",
          acquisitionMode: "public_domain",
          rightsBasis: "public_domain",
          submitterAndReviewerDistinct: submitterId !== reviewerId,
          directClientInsertRejected: Boolean(directInsert.error),
          pendingHiddenFromUnassignedReviewer:
            reviewerPending.data?.length === 0,
          selfReviewRejected: selfReview.status === 403,
          approvedAdapterLoadedInProductionPolicy: true,
          cueDigestMatched: approved.payload.cueDigest === digest,
          directTamperRejected: Boolean(directTamper.error),
          verifiedResubmissionRejected: resubmit.status === 409,
          secondApprovalRejected: secondApproval.status === 409,
          reviewStateBoundary: "controlled_test_identity",
          humanLessonReviewT075: "not_claimed",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  });
});
