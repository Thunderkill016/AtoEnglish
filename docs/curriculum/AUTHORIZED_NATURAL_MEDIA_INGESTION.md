# Authorized natural-media ingestion

Status: experimental implementation boundary, 2026-08-02.

## Product decision

Accurate listening lessons require access to both:

- the original synchronized audio or video signal;
- a timestamped caption or transcript track that can be checked against playback.

AtoEnglish therefore supports full media ingestion only when the exact source permits storage and derivative lesson creation.

## Supported acquisition modes

```text
creator_direct_upload
creator_oauth_export
owned_media
public_domain_source
cc_by_source
licensed_source
```

A standard-license YouTube video owned by another creator is not a valid downloadable core source. It remains an official-player companion unless the creator supplies media, authorizes access, or changes the applicable license.

## Required evidence

Every ingestion record must preserve:

- original source URL and provider;
- acquisition mode;
- rights basis and evidence URL;
- uploader or reviewer identity;
- exact allowed uses;
- original media file identity and checksum;
- caption file identity and checksum;
- language and caption provenance;
- duration and timestamp range;
- review state;
- takedown and retirement status.

## Processing pipeline

```text
rights grant
→ authorized media acquisition
→ media checksum and metadata inspection
→ caption acquisition
→ caption parse and normalization
→ timestamp validation
→ audio-caption alignment review
→ speaker and transcript review
→ Communication Clip extraction
→ lesson treatment authoring
→ publication gate
```

## Non-negotiable blocks

The system must reject:

- standard-license YouTube downloading;
- unofficial caption scraping;
- ASR on media acquired without permission;
- missing rights evidence;
- media without a cryptographic checksum;
- captions without a supported timed-text format;
- caption cues outside media duration;
- overlapping or reversed cue timestamps;
- learner-facing lessons created before human alignment review;
- sources whose rights were revoked or whose takedown status is active.

## Supported caption formats

The first implementation supports:

- WebVTT (`text/vtt`);
- SubRip (`application/x-subrip`);
- TTML (`application/ttml+xml`).

Captions may come from the creator, an official source, or a reviewed manual transcription. Machine output remains a draft until checked against playback.

## Lesson-readiness rule

A source is lesson-ready only when:

```text
rights permit storage and derivatives
+ media file is present and verified
+ caption track is present and parsed
+ timestamps fit the media
+ transcript and speaker labels are human-reviewed
+ audio-caption alignment is human-reviewed
+ source is not retired or under takedown
```

## Scope of this experiment

This branch defines TypeScript contracts, validators, and tests. It does not add a downloader, OAuth flow, object storage adapter, media processor, player UI, production database migration, or deployment.