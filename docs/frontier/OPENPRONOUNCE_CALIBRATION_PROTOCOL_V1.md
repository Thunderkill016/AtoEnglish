# OpenPronounce Vietnamese-English Calibration Protocol V1

## Purpose

This protocol decides whether any OpenPronounce shadow signal is safe and useful enough to become learner-facing feedback for Vietnamese English learners.

It does **not** attempt to prove that OpenPronounce produces phonetic ground truth. It tests narrower claims such as:

> For target /θ/ in a bounded word context, when the shadow provider flags a high-confidence /θ/ substitution, is that flag precise enough to show a cautious corrective hint?

No pronunciation score or mastery update is allowed before this protocol passes.

## Runtime fingerprint

Every calibration run must freeze and record:

- AtoEnglish commit SHA;
- OpenPronounce version;
- word-ASR checkpoint;
- phone-recognition checkpoint;
- reference TTS backend and voice;
- relevant OpenPronounce thresholds/constants;
- hosting CPU class when latency is measured.

For Shadow V1 the intended reference runtime is:

```text
openpronounce: 0.3.0
word ASR:      facebook/wav2vec2-large-960h
phone model:   facebook/wav2vec2-lv-60-espeak-cv-ft
TTS:           piper / en_US-lessac-medium
```

Changing any of these starts a new calibration version.

## Phase 0 — Runtime smoke

Before collecting calibration evidence:

1. deploy the provider with persistent model storage;
2. confirm `/health`;
3. send at least one real Vietnamese learner microphone recording through:
   `browser -> AtoEnglish -> provider -> bounded observation`;
4. repeat after the provider has gone idle and wakes again;
5. confirm no raw audio/transcript is persisted or returned;
6. record p50/p95 end-to-end latency for a small smoke set;
7. verify the same audio produces structurally stable output across repeated runs.

Failure here blocks calibration.

## Phase 1 — Collection design

Use short prompted words first, not free speech.

Each clip receives a random `clip_id`. Keep identity/contact data outside the calibration table. The analysis table should contain only the minimum research metadata needed for stratification.

Required dimensions:

- target sound;
- word;
- sound position: initial / medial / final;
- adjacent phonetic context;
- speaker pseudonymous id;
- broad English proficiency band if available;
- recording device class;
- provider observation;
- independent human labels.

Do not build the first dataset only from clips that the model flags. Include positive and negative controls so precision, recall and false-positive rate are measurable.

## Phase 2 — Target inventory

Start with high-value Vietnamese-English contrasts rather than all English phones at once. Candidate families include:

- /θ/ and /ð/ substitutions;
- final consonant deletion or weakening;
- /s/–/ʃ/, /tʃ/–/dʒ/;
- /r/–/l/ where relevant;
- /v/–/w/;
- tense/lax or nearby vowel contrasts;
- consonant clusters.

The actual inventory must be selected from AtoEnglish learning content and observed learner errors, not from stereotype alone.

Each target needs multiple words and contexts. A model that works on `think` is not assumed to work on every /θ/ word.

## Phase 3 — Human annotation

Use at least two independent annotators who do not see model output.

For each target event they label:

```text
acceptable
clearly problematic
uncertain
```

They may additionally record the perceived substitution when confident.

Rules:

- `uncertain` is never treated as a model success or learner error;
- disagreements are adjudicated by a third pass or excluded from the primary binary benchmark;
- inter-rater agreement is reported before model metrics;
- annotation instructions and example anchors are versioned.

The benchmark should prefer narrow target-specific judgments over a single holistic 0–100 pronunciation score.

## Phase 4 — Metrics

For every sound/context with enough evidence, compute at minimum:

- precision / positive predictive value;
- recall / sensitivity;
- false-positive rate;
- false-negative rate;
- confusion counts by observed substitution;
- calibration of provider confidence buckets;
- metrics by word and phone position;
- metrics by speaker, not only pooled clips.

Use speaker-level train/calibration/test splits. Recordings from the same speaker must not leak across threshold selection and final evaluation.

Report confidence intervals. Do not promote a rule from a tiny subgroup merely because its point estimate looks strong.

## Promotion gate

Learner-facing corrective feedback is asymmetric: a false accusation damages trust more than a missed hint. Therefore promotion is precision-first.

A target-specific rule may move beyond shadow only when all are true:

1. blind-human annotation quality is acceptable;
2. held-out speaker evaluation is available;
3. the lower confidence bound for precision meets the product threshold chosen before looking at the test result;
4. recall is high enough that the feature adds practical value;
5. no major subgroup/context shows a clearly unacceptable false-positive rate;
6. repeated real-mic smoke tests match offline evaluation;
7. feedback language remains probabilistic/cautious unless the evidence supports a stronger claim.

There is **no global provider pass**. `/θ/` can pass while another phone remains shadow-only.

## Suggested initial acceptance target

For the first learner-facing phone-specific hint, use a conservative working target:

```text
held-out precision target: >= 0.90
minimum useful recall:     >= 0.60
```

The decisive quantity should be the confidence interval, not only the point estimate. These are product safety targets for feedback quality, not claims about linguistic truth, and may be tightened after pilot data.

## Data stages

Keep three separate artifacts:

```text
raw research audio
  -> access-controlled calibration storage only

human labels + clip metadata
  -> calibration table

sanitized provider observations
  -> model-evaluation table
```

Do not write any of them into normal pronunciation mastery tables.

Raw research audio requires explicit research consent and a retention/deletion policy. Shadow preview recordings remain ephemeral unless the learner explicitly enters a calibration study with separate consent.

## Exit outcomes

A calibration cycle must end in one of four explicit outcomes per target/context:

- `reject` — signal is not useful enough;
- `shadow` — keep collecting evidence;
- `hint-only` — cautious learner feedback allowed, no mastery effect;
- `mastery-candidate` — eligible for a separate mastery validation study.

`hint-only` does not automatically imply `mastery-candidate`.

## Immediate next experiment

The first live experiment after Railway deployment should remain intentionally small:

```text
target: /θ/
canonical word: think
speakers: Vietnamese English learners + a few proficient controls
recordings: multiple takes per speaker, including intentionally altered pronunciations
output: raw provider observation + blind human target judgment
```

Its purpose is to validate the pipeline and expose failure modes. It is not large enough to set production thresholds by itself.
