# AtoEnglish product truth

**Status:** current product decision source  
**Updated:** 2026-08-02  
**Primary product:** Real Talk

## What AtoEnglish is now

AtoEnglish is a Vietnamese-first web product that turns short, lawful YouTube
conversation segments into guided English practice. It serves Vietnamese adults
at A1–B1 who can recognize some English but struggle to follow and use it in
daily or workplace conversations.

The core journey is a Real Talk lesson:

```text
short real video
→ Vietnamese scaffold
→ active listening task
→ controlled retrieval
→ repeat key phrases
→ immediate feedback and retry
→ save useful vocabulary to FSRS
→ return for review
```

The legacy 28-day scripted-speaking pilot and broad unit curriculum are
historical reference material. They are not the current product roadmap or
implementation authority.

## Product promise

Each lesson helps the learner understand a short real interaction and use a
small set of useful phrases in a comparable situation. The product does not
promise native pronunciation, CEFR certification, or IELTS results.

## Learning contract

Every curated lesson must contain:

- one observable can-do outcome;
- a segment no longer than three minutes;
- Pre-Watch, While-Watch, and Post-Watch activities;
- 3–5 key phrases with Vietnamese meaning and use guidance;
- a speaking task that moves from model to attempt;
- a retrieval task, not recognition only;
- concise Vietnamese feedback and an immediate retry opportunity;
- FSRS-ready vocabulary selected for usefulness, not volume.

Curated video topics must progress from routine A1 transactions to A2/B1
workplace communication. A lesson may simplify the task, but must not falsify
the source video or manufacture a transcript.

## Speech evidence contract

There are two distinct modes:

1. **Transcript-match mode:** browser Web Speech compares recognized words with
   the model phrase. It reports a `0–100` sentence-match score and missing or
   extra words. It is not a pronunciation score.
2. **Pronunciation-assessment mode:** an approved acoustic provider such as
   Azure Speech returns accuracy, fluency, completeness, and prosody. This mode
   is unavailable until valid credentials, provider tests, and calibration are
   present.

The UI must always name the active mode. When assessment is unavailable, the
learner can still listen, record locally, replay, and self-practice without a
fabricated score.

## Progress and privacy contract

Completion records phase, quiz outcome, sentence-match evidence, learning time,
and saved vocabulary. It can grant XP and update the learner's daily streak.

Raw recordings, full transcripts, names, employers, and free learner text are
not stored by default. Browser recordings stay local to the session unless a
future, separately approved recording feature explicitly changes this policy.

## Evidence hierarchy

1. **Technical evidence:** schema, RLS, tests, and production behavior work.
2. **Lesson evidence:** source, can-do outcome, activities, and assessment align.
3. **Learner evidence:** learners complete a task, retry, return, and retain key phrases.
4. **Product evidence:** learners choose and pay for recurring Real Talk practice.

Passing tests does not prove learning or market value. It only proves the
implemented contract is internally consistent.
