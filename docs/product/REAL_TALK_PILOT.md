# Real Talk public-domain pilot

**Status:** internal product experiment  
**Branch:** `agent/real-talk-public-domain-pilot`  
**Public release:** blocked until transcript review and learner testing

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
→ optional FSRS seeding
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
6. add the resulting chunks to the existing FSRS deck.

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
- replacing the current Mission Engine.

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

## Next implementation boundary

After this pilot is validated, the next change should be an authoring workflow that accepts already-authorized media and requires a human reviewer. AI may draft segmentation, translation, chunks, and questions, but it must never publish directly or remove source evidence.
