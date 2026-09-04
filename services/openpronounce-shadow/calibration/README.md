# OpenPronounce Calibration Harness

Offline evaluator for the `shadow-unvalidated` pronunciation research stream.

This harness is intentionally separate from learner runtime. It consumes **sanitized event evidence plus blind human labels**, never raw audio, ASR transcript, raw model vectors or ordinary AtoEnglish mastery records.

The governing research protocol is:

`docs/frontier/OPENPRONOUNCE_CALIBRATION_PROTOCOL_V1.md`

## JSONL contract

One line = one prompted target event from one clip.

```json
{
  "schema_version": 1,
  "clip_id": "opaque-clip-id",
  "speaker_id": "pseudonymous-speaker-id",
  "split": "test",
  "target_sound_id": "th-voiceless",
  "target_phone": "θ",
  "word": "think",
  "phone_position": "initial",
  "context_key": "θ+ɪ",
  "provider": {
    "version": "0.3.0",
    "flagged": true,
    "confidence": 0.91,
    "observed_phone": "t"
  },
  "human": {
    "rater_a": "clearly_problematic",
    "rater_b": "clearly_problematic",
    "adjudicated": null
  }
}
```

Allowed human labels:

- `acceptable`
- `clearly_problematic`
- `uncertain`

If the two blind raters disagree, the record is excluded from binary model metrics until `human.adjudicated` is supplied. `uncertain` is always excluded from binary success/failure counts.

## Privacy boundary

The schema is allowlist-only. Unsupported fields fail closed.

Do **not** add:

- audio bytes or audio paths;
- learner name, email, account id or contact data;
- raw ASR transcript;
- OpenPronounce raw vectors/posteriors;
- free-form provider feedback;
- ordinary pronunciation mastery state.

`clip_id` and `speaker_id` must be opaque research identifiers. The access-controlled raw-audio store, if a consented calibration study uses one, must keep the mapping outside this JSONL evidence file and outside the normal learner database.

Real calibration datasets should not be committed to the repository. `example.synthetic.jsonl` is synthetic only.

## Split rule

A speaker may appear in **either** `calibration` **or** `test`, never both. The evaluator rejects speaker leakage before producing metrics.

Use the calibration split for threshold exploration. Freeze the decision rule before reading the held-out test result.

## Run

```bash
python services/openpronounce-shadow/calibration/evaluate.py \
  services/openpronounce-shadow/calibration/example.synthetic.jsonl \
  --split test
```

Optional confidence threshold:

```bash
python services/openpronounce-shadow/calibration/evaluate.py \
  evidence.jsonl \
  --split calibration \
  --min-confidence 0.85
```

Do not tune `--min-confidence` against the held-out test split.

## Report

The evaluator reports overall and per-`target_sound_id`:

- TP / FP / FN / TN;
- precision;
- recall;
- false-positive rate;
- false-negative rate;
- number of clips and speakers;
- clip-level 95% Wilson intervals for precision/recall;
- deterministic 95% **speaker-cluster bootstrap** intervals for precision/recall;
- raw double-rater agreement and Cohen's kappa;
- counts excluded because of uncertainty or unresolved disagreement.

The speaker bootstrap resamples speakers rather than clips, so repeated takes from one person do not masquerade as independent speakers. The clip-level Wilson interval is still reported as a transparent secondary diagnostic.

## Deliberate non-feature

This tool does **not** print `PASS`, `FAIL`, `hint-only`, or `mastery-candidate`.

Promotion is a product/research decision governed by the frozen protocol, evidence volume, confidence bounds, subgroup/context inspection and real-mic runtime validation. A script must not silently turn a threshold chosen after seeing test data into learner authority.
