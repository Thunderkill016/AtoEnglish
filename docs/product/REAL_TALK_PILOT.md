# Real Talk public-domain pilot

**Status:** owner-authorized internal product experiment  
**Branch:** `agent/real-talk-public-domain-pilot`  
**Public release:** blocked until transcript review and learner testing  
**Technical verification:** GitHub Verify run `30730753352` passed on final head `696d6e21b59e96cd2aeb0ad34b6cdfb53a745b35`

## Exception to the current roadmap

This experiment conflicts with the repository's existing 28-day speaking priority and do-not-build list. It exists only because the owner explicitly requested research and implementation of the authentic-video lesson idea.

The exception is bounded as follows:

1. **Current blocker:** the owner repeatedly rejected fabricated dialogue and engagement-first lesson flows because they do not feel like credible progress. The unresolved product question is whether authentic input plus retrieval produces a lesson worth returning to.
2. **Evidence available:** direct owner feedback identifies real spoken content and spaced retrieval as more trustworthy than generated conversation. This is product-direction evidence, not learner-effectiveness evidence.
3. **Why a simpler video embed is insufficient:** passive viewing cannot test whether the learner understood, located evidence, or retrieved language. It also does not solve transcript provenance or copyright boundaries.
4. **Smallest reversible implementation:** one public-domain clip, one route, one lesson record, no new database schema, no AI generation pipeline, no production release, and one removable entry in the learning hub.
5. **Acceptance criteria:** media playback, bounded clip replay, timestamp evidence, gist task, cloze retrieval, productive recall, source attribution, and technical validation.
6. **Explicitly excluded systems:** authentication changes, RLS, analytics taxonomy, XP, payments, AI publication, speech scoring, broad curriculum changes, and production deployment.

This document does not silently replace `PRODUCT_TRUTH.md` or `CURRENT_PRIORITY.md`. A separate owner decision is required before Real Talk becomes the primary product direction.

## Product hypothesis

AtoEnglish can turn a short piece of authentic spoken English into a useful lesson when every activity remains traceable to the original media and the learner must retrieve language rather than only watch it.

The experiment is intentionally narrower than “paste any YouTube URL and generate a lesson”. The first vertical slice proves this path:

```text
licensed real media
→ bounded clip
→ timestamped source transcript
→ learner-facing normalization with provenance preserved
→ gist listening
→ transcript evidence
→ contextual chunks
→ cloze retrieval
→ Vietnamese-to-English recall
→ optional FSRS seeding through the existing deck
```

## Source policy

A lesson may enter the public catalog only when its media is one of:

1. owned by AtoEnglish;
2. licensed directly by the creator or publisher;
3. published under a Creative Commons license that permits the intended commercial and derivative use;
4. in the public domain.

A standard YouTube upload may be embedded for an approved use case, but embedding alone does not grant AtoEnglish permission to copy its transcript, translate it, or sell derivative lesson content. The product must store source and permission evidence instead of treating a public URL as a license.

## Pilot source

The first lesson uses **Radio Around the Region: Interview with USO Volunteer**.

- Original publisher: Defense Visual Information Distribution Service (DVIDS)
- Author attribution: U.S. Marine Corps video by Lance Cpl. Saul Hernandez
- DVIDS video ID: `1000496`
- Media mirror and licensing record: Wikimedia Commons
- Copyright status: public domain as a work produced by a U.S. federal government employee in official duties
- Transcript source: Wikimedia TimedText English SRT

The lesson uses only the clip from approximately `00:21.317` to `00:34.654`.

## Provenance contract

`RealTalkLesson` separates:

- `sourceText`: verbatim text from the declared transcript source;
- `displayText`: editorial normalization shown to learners;
- `reviewStatus`: machine caption, editor-normalized, or human-verified;
- source, media, license, attribution, and transcript URLs;
- evidence segment IDs for every question, cloze, chunk, and recall task.

A lesson with `status: "approved"` fails validation unless its transcript has been human reviewed.

## Learning contract

The first pilot does not claim broad speaking improvement. It tests whether a learner can:

1. understand the gist of a short authentic clip without transcript support;
2. replay a precise timestamp and inspect bilingual evidence;
3. notice a small number of reusable chunks;
4. reconstruct one missing word;
5. recall one complete sentence from Vietnamese meaning;
6. optionally add the resulting chunks to the existing FSRS deck without changing FSRS rules.

Completion is blocked until both retrieval items are correct. Watching the clip or selecting the gist answer alone is not completion evidence.

## Deliberate non-goals

The first slice does not include:

- arbitrary YouTube ingestion;
- unofficial caption scraping;
- AI-generated lesson publication;
- automatic speaker diarization;
- pronunciation or accent scoring;
- storing raw learner audio or transcript;
- a new database schema;
- a large video catalog;
- replacing the current Mission Engine;
- changing FSRS parameters or review behavior.

## Human review gate

Before public release, an editor must:

1. listen to the exact clip at normal and reduced speed;
2. verify speaker boundaries and proper nouns;
3. compare every `sourceText` entry with the source caption;
4. confirm every `displayText` normalization against the audio;
5. verify the Vietnamese translation and pragmatic explanation;
6. confirm all activities point to valid evidence segments;
7. record the reviewer and review date in the content workflow.

The current lesson remains `internal_pilot` because the machine caption has not completed this gate.

## Validation plan

Run a small moderated test before adding another video.

Measure:

- whether learners can start playback successfully;
- whether timestamp replay works on desktop and mobile;
- first-watch gist accuracy;
- cloze and productive-recall success before and after transcript inspection;
- whether learners understand the source/licensing label;
- whether authenticated learners successfully seed the four chunks into FSRS;
- completion time and abandonment point;
- whether learners prefer this lesson to a fabricated dialogue covering the same language.

Continue only when the vertical slice works reliably and learners demonstrate better recall than passive video viewing.

## Verification record

GitHub Actions Verify run `30730753352` completed successfully on final head `696d6e21b59e96cd2aeb0ad34b6cdfb53a745b35`:

- dependency installation;
- ESLint;
- TypeScript;
- unit tests, including the Real Talk provenance and recall tests;
- existing content-standard suite.

A production build, remote-media browser playback and authenticated FSRS save still require manual or preview verification. No preview or production deployment is part of this branch.

## Next implementation boundary

After this pilot is validated, the next change should be an authoring workflow that accepts already-authorized media and requires a human reviewer. AI may draft segmentation, translation, chunks, and questions, but it must never publish directly or remove source evidence.
