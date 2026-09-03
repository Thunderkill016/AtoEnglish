# AtoEnglish Pronunciation Engine — frontier research program (2026)

**Branch:** `frontier/pronunciation-engine-rd-v1`  
**Status:** research + reversible implementation only  
**Goal:** build and validate an original, free/open pronunciation-assessment stack that can eventually outperform existing learner-facing systems on the metrics that matter to AtoEnglish.

## 1. What “best” means

AtoEnglish must not claim to be the best because it has more outputs or a prettier score. It earns that claim only if it wins on held-out human-rated learner speech.

The target system must optimize all of these, not one scalar:

1. **Phone-level assessment:** correlation with human phone scores and strong correct-vs-mispronounced separation.
2. **Mispronunciation detection:** low false acceptance and low false rejection, reported together with F1/MCC/AUC.
3. **Diagnosis:** identify substitution/deletion/insertion and the most plausible produced sound.
4. **Articulatory diagnosis:** explain *how* a production differs (place, manner, voicing, vowel height/backness/rounding), not just “wrong phone”.
5. **Word/utterance assessment:** accuracy, completeness, stress, fluency, prosody, and total quality at the appropriate granularity.
6. **Uncertainty:** abstain when evidence is weak instead of inventing a precise score.
7. **Multiple valid pronunciations:** never penalize a legitimate target variant simply because one reference string was chosen.
8. **Speaker robustness:** speaker-disjoint evaluation; inspect age, gender, L1/accent, microphone and noise slices instead of fitting speakers seen in training.
9. **Learning value:** feedback must improve the next production and delayed production, not merely correlate with a rater.
10. **Privacy/cost:** prefer local inference and free/open components; raw learner audio is not persisted by default.

A native-accent imitation score is explicitly **not** the objective. Intelligibility and target contrast control matter more than sounding like one prestige accent.

## 2. Frontier findings that change the design

### 2.1 GOP is still useful, but plain softmax GOP is not enough

Kaldi’s SpeechOcean762 recipe formalizes neural GOP from phone posteriors and phone posterior ratios. It remains an important baseline, but modern work shows two weaknesses:

- forced alignment can be wrong on non-native speech;
- softmax posteriors can be overconfident and poorly separated.

Interspeech 2025 reported that **logit-based GOP** can outperform probability-based GOP for mispronunciation classification, with hybrid probability/logit evidence useful across datasets.

**Design consequence:** preserve raw logits/top-k evidence where a sensor exposes them. Do not reduce a model to top-1 text before scoring.

### 2.2 Context-aware CTC is a stronger direction than ordinary CTC-GOP

BEA 2026 showed that standard CTC is too peaky and context-independent for stable GOP. Context-aware CTC with output-context dependency plus label-prior and entropy regularization improved SpeechOcean762 phone PCC from the classic GOPT baseline region to **0.641** and improved word total PCC as well.

**Design consequence:** our long-term trainable acoustic scorer should be frame/context aware. Browser top-1 phoneme recognition is only one sensor, never the scoring architecture.

### 2.3 MDD should be jointly modeled with assessment

Interspeech 2023 showed joint pronunciation assessment + MDD multi-task learning improves assessment correlation and MDD relative to isolated tasks.

**Design consequence:** score prediction and error diagnosis must share evidence. Do not build an independent “score service” and “mistake service” with incompatible representations.

### 2.4 Prompt-free / acoustically faithful MDD is now a serious frontier

CROTTC-IF (2026) explicitly attacks CTC acoustic sparsity and canonical-prompt bias. The reported L2-ARCTIC F1 is **71.77%**. The core idea is important even when we do not copy the implementation: preserve acoustic deviations first, then inject canonical knowledge after acoustic evidence has been formed.

**Design consequence:** target text must not force the acoustic sensor to “hear what it expects”. Canonical pronunciation belongs in alignment/fusion, not in a way that overwrites acoustic evidence.

### 2.5 Articulatory features improve diagnosis

2024–2026 work on phonological/articulatory-level MDD reports lower false acceptance/rejection/diagnosis error than phone-only approaches in multiple settings. SLaTE 2025 specifically found articulatory-feature integration improves diagnostic quality.

**Design consequence:** every English phone gets an articulatory feature representation. Alignment cost and learner feedback can then express `θ → s` as a structured place/manner contrast rather than an arbitrary character edit.

### 2.6 Prosody needs dedicated evidence

Speech Prosody 2024 and SLaTE 2025 show that F0, loudness/energy and duration/rhythm features add information beyond GOP for prosody and fluency.

**Design consequence:** never derive prosody/fluency from segmental GOP alone. Build a separate suprasegmental evidence stream.

### 2.7 Hierarchical scoring is better aligned with human rubrics

GOPT established multi-aspect, multi-granularity scoring. HierTFR (ACL 2024) and HiPPO (2025) go further by modeling linguistic hierarchy and ordinal/correlation structure rather than predicting every score in parallel.

**Design consequence:** the eventual learned scorer should follow the hierarchy:

```text
frames -> phones -> syllables/words -> utterance
```

and preserve relations among accuracy, stress, fluency, prosody, completeness and total score.

### 2.8 Uncertainty and alternate valid pronunciations are mandatory

Prior MDD work shows that treating one recognized phone string and one canonical pronunciation as certain creates false alarms. Uncertainty-aware approaches improve precision.

**Design consequence:** use candidate distributions/N-best evidence where available; support multiple target variants; expose `abstain` when confidence is inadequate.

## 3. Free/open research stack and license boundary

### Commercially usable foundations

| Component | Use | License/status |
|---|---|---|
| SpeechOcean762 | human-rated non-native English training/evaluation | CC BY 4.0; commercial use allowed |
| LibriSpeech | native English acoustic/pretraining/reference speech | CC BY 4.0 |
| GOPT code | multi-aspect/multi-granularity baseline and evaluation ideas | BSD-3-Clause |
| Kaldi GOP recipe | GOP definitions/baseline | Kaldi Apache-2.0 project |
| PanPhon concepts/data | IPA articulatory feature representation and feature edit distance | MIT family license |
| Apache-licensed Wav2Vec2/XLS-R/ONNX checkpoints | acoustic/phone sensors where model card and training-data terms are compatible | verify each checkpoint individually |

### Research-only / do not copy into production without explicit rights review

| Resource | Why restricted |
|---|---|
| L2-ARCTIC | CC BY-NC 4.0; useful for Vietnamese/L1 research and benchmarking, not assumed production-training safe |
| IF-MDD repository | public research source currently has no repository license file; learn from papers/results, do not copy source into AtoEnglish |
| HierTFR repository | public code repository currently reports no license; learn from paper architecture, do not copy source |

A model’s own license label does not automatically erase restrictions inherited from its training data. Every production checkpoint needs a model-and-data license review.

## 4. Architecture

```text
Microphone / WAV
      |
      v
[Signal quality gate]
 clipping · RMS · silence · duration · SNR proxy
      |
      +------------------------------+
      |                              |
      v                              v
[Acoustic phone sensors]       [Prosody DSP]
 logits/top-k/timestamps        F0 · energy · duration
 multiple independent views    pauses · rhythm · stress
      |                              |
      v                              |
[Acoustic evidence]                  |
      |                              |
      +-------------+----------------+
                    |
                    v
       [Canonical pronunciation lattice]
       multiple valid pronunciations/stress
                    |
                    v
       [Phonological weighted alignment]
       posterior-aware dynamic programming
       match/substitution/deletion/insertion
                    |
                    v
       [Articulatory diagnosis layer]
       place/manner/voice/vowel geometry
                    |
                    v
             [Evidence fusion]
       segmental + completeness + prosody
       uncertainty + sensor agreement
                    |
                    v
        [Human-score calibration layer]
       monotonic/ordinal; speaker-disjoint
                    |
                    v
          PronunciationAssessment
                    |
       +------------+-------------+
       |                          |
       v                          v
 learner feedback            research metrics
 corrective retry            PCC/F1/MCC/ECE/FAR/FRR
```

## 5. Core representation

The engine should distinguish these concepts:

```text
sensor observation != diagnosis != calibrated score != learning decision
```

A sensor may say:

```json
{
  "expected": "θ",
  "candidates": [
    { "phone": "s", "probability": 0.62 },
    { "phone": "θ", "probability": 0.24 },
    { "phone": "t", "probability": 0.14 }
  ]
}
```

The alignment layer may infer a likely substitution. The articulatory layer describes the contrast. Only a human-calibrated model is allowed to turn this into a learner-facing score.

## 6. Algorithms to implement in AtoEnglish first

### Kernel A — phonological feature distance

Replace binary Levenshtein substitution cost (`same=0`, `different=1`) with a weighted articulatory distance.

For consonants compare at least:

- manner;
- place;
- voicing;
- sonorancy/laterality/nasality where relevant.

For vowels compare at least:

- height;
- backness;
- rounding;
- length/tenseness proxy;
- diphthong trajectory.

The weights are a **prior**, not truth. They must later be fitted/validated against human labels.

### Kernel B — posterior-aware alignment

Dynamic programming should align a canonical sequence to observed phone candidates. Substitution cost is the expected articulatory/acoustic cost under the candidate distribution, not merely the top-1 phone.

Insertion/deletion stay explicit because final consonant deletion and cluster reduction are important learner errors.

### Kernel C — alternate-reference lattice

Score all legitimate canonical variants and keep the best-supported variant. Never punish a learner for a dictionary-supported variant.

### Kernel D — uncertainty/abstention

Inputs that fail signal quality, have weak posterior margin, severe sensor disagreement, or fall outside calibrated support should return `abstain`/`needs_retry`, not a fake exact score.

### Kernel E — monotonic human calibration

Use a monotonic calibrator (initially isotonic regression/PAVA) to map a raw model signal to human-score scale without assuming a linear relationship. Fit calibration only on speaker-disjoint calibration data.

### Kernel F — rigorous metrics

Implement and track:

- phone/word/utterance Pearson and Spearman correlations;
- MAE/RMSE;
- precision/recall/F1;
- Matthews correlation coefficient;
- FAR/FRR;
- diagnosis accuracy/error rate;
- ROC AUC where probability/ranking evidence exists;
- Brier score and Expected Calibration Error for confidence quality.

## 7. Model roadmap

### V0 — deterministic evidence kernel (now)

No training. Build the original AtoEnglish representation, phonological distance, posterior-aware alignment, calibration and evaluation utilities. Existing browser phoneme output can feed this kernel if it works, but the kernel must not depend on that one model.

### V1 — multi-sensor browser benchmark

Benchmark at least two independently trained commercial-safe phone recognizers on identical audio. Record model identity, quantization/runtime, latency, candidate sequence, and agreement. Do not fuse models until each is evaluated separately.

### V2 — SpeechOcean762 scoring baseline

Reproduce GOPT/Kaldi or a modern equivalent as a **benchmark**, then train an original small hierarchical scorer on SpeechOcean762 with speaker-disjoint splits. Preserve the official human labels and avoid test-speaker leakage.

### V3 — modern acoustic scorer

Train an original CTC/logit model with ideas validated by 2025–2026 work:

- logit-GOP evidence;
- context-aware/non-peaky frame representation;
- joint APA + MDD objectives;
- articulatory auxiliary target;
- canonical information injected after acoustically faithful representation.

### V4 — suprasegmental model

Fuse phone evidence with F0/energy/duration/pause/rhythm/stress features. Validate prosody and fluency separately from segmental accuracy.

### V5 — Vietnamese calibration dataset

L2-ARCTIC can be used as non-commercial research reference, especially because it includes Vietnamese speakers, but the production system needs AtoEnglish-owned consented Vietnamese learner data or another commercially compatible corpus.

Start with high-value contrasts and positions:

- `/θ/`, `/ð/` substitutions;
- final consonant deletion/weakening;
- consonant-cluster reduction/epenthesis;
- `/ɪ/` vs `/iː/` and other vowel contrasts;
- stress placement;
- later rhythm/intonation.

Do not hard-code these as automatic errors merely because they are common in literature. They are priors for targeted data collection and testing.

## 8. Evaluation protocol

### Split rule

**All primary results are speaker-disjoint.** No utterances from a speaker in training may appear in validation/test.

### Required test slices

- adult vs child where data allows;
- male/female/other metadata where available and appropriate;
- L1/accent groups when available;
- quiet vs noisy/device conditions;
- phone identity and word position;
- correct vs mispronounced prevalence;
- short word vs sentence;
- seen vs unseen lexical items where possible.

### Threshold rule

Do not choose a global `0.5` threshold by habit. Optimize/report thresholds on validation data (e.g. MCC or cost-weighted FAR/FRR), then freeze them before test evaluation. Consider phone-specific thresholds only when sample sizes support them.

### Calibration rule

A system is not “confident” because a neural network emitted `0.93`. Report calibration error and reliability. Confidence is allowed to control learner-facing feedback only after calibration.

### Human ceiling

Where multiple human ratings exist, report inter-rater agreement/reliability. The model must be compared against the variability of the human target, not an imaginary perfectly deterministic label.

## 9. Product output contract

The eventual production object should look conceptually like this:

```ts
{
  calibration: "unvalidated" | "calibrating" | "validated",
  decision: "evidence" | "feedback" | "abstain",
  target: {
    word: "think",
    selectedPronunciation: ["θ", "ɪ", "ŋ", "k"]
  },
  signalQuality: { ... },
  phones: [
    {
      expected: "θ",
      observedCandidates: [
        { phone: "s", probability: 0.62 },
        { phone: "θ", probability: 0.24 }
      ],
      diagnosis: "substitution",
      articulatoryDelta: {
        place: "dental -> alveolar",
        manner: "fricative -> fricative",
        voicing: "unchanged"
      },
      confidence: 0.0 // only after calibration
    }
  ],
  aspects: {
    segmentalAccuracy: null,
    completeness: null,
    stress: null,
    fluency: null,
    prosody: null,
    total: null
  },
  uncertainty: { ... }
}
```

Until calibrated, learner-facing numeric scores remain `null` even if research-only raw signals exist internally.

## 10. Stop conditions

Stop or replace a component when any of the following occurs:

- a phoneme sensor cannot separate deliberately large contrasts such as `θ/s/t` better than chance/reliable baselines;
- a new model improves aggregate PCC while materially worsening FAR on common learner errors;
- a model only works because target text leaks into acoustic recognition;
- a component has incompatible or ambiguous production licensing;
- a system cannot reproduce its result on a speaker-disjoint split;
- confidence is badly miscalibrated and no abstention path exists;
- learner feedback does not improve subsequent productions.

## 11. Primary references

- Zhang et al. 2021, SpeechOcean762: https://www.openslr.org/101/ and DOI `10.21437/Interspeech.2021-1259`
- Kaldi GOP SpeechOcean762 recipe: https://github.com/kaldi-asr/kaldi/tree/master/egs/gop_speechocean762
- Gong et al. 2022, GOPT: https://arxiv.org/abs/2205.03432 and https://github.com/YuanGongND/gopt
- Ryu et al. 2023, joint APA + MDD: DOI `10.21437/Interspeech.2023-337`
- Yan et al. 2024, HierTFR: https://aclanthology.org/2024.acl-long.95/
- Shahin & Ahmed 2024, phonological-level MDD: DOI `10.21437/Interspeech.2024-1874`
- Dong et al. 2024, L2 prosody acoustic + neural features: DOI `10.21437/SpeechProsody.2024-34`
- Parikh et al. 2025, logit GOP: DOI `10.21437/Interspeech.2025-1012`
- Parikh et al. 2025, phonological knowledge / restricted substitutions: DOI `10.21437/Interspeech.2025-829`
- Wei et al. 2025, articulatory-enhanced MDD: DOI `10.21437/SLaTE.2025-7` and `10.21437/SLaTE.2025-16`
- Dong et al. 2025, suprasegmental features for APA: DOI `10.21437/SLaTE.2025-5`
- Yan et al. 2025, HiPPO: https://aclanthology.org/2025.ijcnlp-long.45/
- Tu et al. 2025, training-free retrieval MDD: https://arxiv.org/abs/2511.20107
- Geng et al. 2026, CROTTC / prompt-free MDD: https://arxiv.org/abs/2604.22133
- Li et al. 2026, context-aware CTC APA: https://aclanthology.org/2026.bea-1.3/
- PanPhon articulatory features: https://aclanthology.org/C16-1328/
- L2-ARCTIC (research-only licensing for our purposes): https://psi.engr.tamu.edu/l2-arctic-corpus/
