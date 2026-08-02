# AtoEnglish current priority

**Updated:** 2026-08-02  
**Owner:** Thunderkill016  
**Primary product:** Real Talk

## North star

Make a Vietnamese adult able to understand, repeat, and reuse useful English
from a short real conversation, then return to review it.

## Active delivery sequence

### 1. Speaking evidence in Post-Watch

Replace the visual-only microphone with a working browser speech flow:

- listen to a model phrase;
- speak through Web Speech when supported;
- show transcript-match score, missing words, and one Vietnamese retry tip;
- provide local self-practice when browser speech is unavailable;
- never label transcript match as pronunciation assessment.

### 2. Learner progress and rewards

Persist Real Talk completion with Supabase RLS. A completion record contains
the completed phase, quiz score, sentence-match results, saved vocabulary, and
learning time. Award XP and update the daily streak through one server-side,
idempotent transaction.

### 3. Curated catalog expansion

Add five verified YouTube lessons:

- ordering coffee, A1;
- asking for directions, A1;
- self-introduction at work, A2;
- shopping for clothes, A2;
- job interview basics, B1.

Each source must be publicly playable, attributed, segmented to three minutes
or less, and reviewed for a concrete can-do outcome before publishing.

## Out of scope for this release

- a general chatbot or open-ended conversation tutor;
- claims of phoneme-level accuracy without an acoustic assessment provider;
- storing raw learner audio or unrestricted transcripts;
- downloading YouTube audio or video;
- a broad A0–B2 curriculum rewrite;
- payments, leagues, social features, or deployment automation.

## Completion criteria

This phase is complete only when the learner can finish a Real Talk lesson on a
phone or desktop, receives honest speaking feedback, sees saved progress and
XP after sign-in, and can open all seven curated lessons without broken media
or malformed content.
