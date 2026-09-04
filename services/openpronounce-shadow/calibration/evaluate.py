from __future__ import annotations

import argparse
import json
import math
import random
from pathlib import Path
from typing import Any, Iterable

SCHEMA_VERSION = 1
BOOTSTRAP_REPLICATES = 2000
BOOTSTRAP_SEED = 20260903

VALID_SPLITS = {"calibration", "test"}
VALID_LABELS = {"acceptable", "clearly_problematic", "uncertain"}
VALID_POSITIONS = {"initial", "medial", "final", "cluster", "other"}

TOP_LEVEL_KEYS = {
    "schema_version",
    "clip_id",
    "speaker_id",
    "split",
    "target_sound_id",
    "target_phone",
    "word",
    "phone_position",
    "context_key",
    "provider",
    "human",
}
PROVIDER_KEYS = {
    "version",
    "flagged",
    "confidence",
    "observed_phone",
}
HUMAN_KEYS = {
    "rater_a",
    "rater_b",
    "adjudicated",
}


class CalibrationDataError(ValueError):
    """Raised when calibration evidence violates the frozen research schema."""


def _reject_extra_keys(value: dict[str, Any], allowed: set[str], path: str) -> None:
    extras = sorted(set(value) - allowed)
    if extras:
        raise CalibrationDataError(f"{path} contains unsupported fields: {', '.join(extras)}")


def _bounded_string(value: Any, *, path: str, limit: int) -> str:
    if not isinstance(value, str):
        raise CalibrationDataError(f"{path} must be a string")
    normalized = value.strip()
    if not normalized:
        raise CalibrationDataError(f"{path} must not be empty")
    if len(normalized) > limit:
        raise CalibrationDataError(f"{path} exceeds {limit} characters")
    return normalized


def _optional_bounded_string(value: Any, *, path: str, limit: int) -> str | None:
    if value is None:
        return None
    return _bounded_string(value, path=path, limit=limit)


def _confidence(value: Any, *, path: str) -> float | None:
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise CalibrationDataError(f"{path} must be a number or null")
    result = float(value)
    if not math.isfinite(result) or result < 0.0 or result > 1.0:
        raise CalibrationDataError(f"{path} must be finite and inside [0, 1]")
    return result


def _label(value: Any, *, path: str, nullable: bool = False) -> str | None:
    if value is None and nullable:
        return None
    if not isinstance(value, str) or value not in VALID_LABELS:
        choices = ", ".join(sorted(VALID_LABELS))
        raise CalibrationDataError(f"{path} must be one of: {choices}")
    return value


def validate_record(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise CalibrationDataError("record must be a JSON object")
    _reject_extra_keys(raw, TOP_LEVEL_KEYS, "record")

    if raw.get("schema_version") != SCHEMA_VERSION:
        raise CalibrationDataError(f"schema_version must equal {SCHEMA_VERSION}")

    split = raw.get("split")
    if split not in VALID_SPLITS:
        raise CalibrationDataError("split must be 'calibration' or 'test'")

    position = raw.get("phone_position")
    if position not in VALID_POSITIONS:
        raise CalibrationDataError(
            "phone_position must be one of: " + ", ".join(sorted(VALID_POSITIONS))
        )

    provider = raw.get("provider")
    if not isinstance(provider, dict):
        raise CalibrationDataError("provider must be an object")
    _reject_extra_keys(provider, PROVIDER_KEYS, "provider")
    if not isinstance(provider.get("flagged"), bool):
        raise CalibrationDataError("provider.flagged must be a boolean")

    human = raw.get("human")
    if not isinstance(human, dict):
        raise CalibrationDataError("human must be an object")
    _reject_extra_keys(human, HUMAN_KEYS, "human")

    return {
        "schema_version": SCHEMA_VERSION,
        "clip_id": _bounded_string(raw.get("clip_id"), path="clip_id", limit=80),
        "speaker_id": _bounded_string(raw.get("speaker_id"), path="speaker_id", limit=80),
        "split": split,
        "target_sound_id": _bounded_string(
            raw.get("target_sound_id"), path="target_sound_id", limit=80
        ),
        "target_phone": _bounded_string(
            raw.get("target_phone"), path="target_phone", limit=32
        ),
        "word": _bounded_string(raw.get("word"), path="word", limit=120),
        "phone_position": position,
        "context_key": _optional_bounded_string(
            raw.get("context_key"), path="context_key", limit=120
        ),
        "provider": {
            "version": _bounded_string(
                provider.get("version"), path="provider.version", limit=40
            ),
            "flagged": provider["flagged"],
            "confidence": _confidence(
                provider.get("confidence"), path="provider.confidence"
            ),
            "observed_phone": _optional_bounded_string(
                provider.get("observed_phone"),
                path="provider.observed_phone",
                limit=32,
            ),
        },
        "human": {
            "rater_a": _label(human.get("rater_a"), path="human.rater_a"),
            "rater_b": _label(human.get("rater_b"), path="human.rater_b"),
            "adjudicated": _label(
                human.get("adjudicated"),
                path="human.adjudicated",
                nullable=True,
            ),
        },
    }


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            try:
                raw = json.loads(stripped)
            except json.JSONDecodeError as error:
                raise CalibrationDataError(
                    f"{path}:{line_number}: invalid JSON: {error.msg}"
                ) from None
            try:
                records.append(validate_record(raw))
            except CalibrationDataError as error:
                raise CalibrationDataError(
                    f"{path}:{line_number}: {error}"
                ) from None
    return records


def _resolved_human_label(record: dict[str, Any]) -> str | None:
    human = record["human"]
    adjudicated = human["adjudicated"]
    if adjudicated is not None:
        return adjudicated
    if human["rater_a"] == human["rater_b"]:
        return human["rater_a"]
    return None


def _check_unique_clips(records: list[dict[str, Any]]) -> None:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for record in records:
        clip_id = record["clip_id"]
        if clip_id in seen:
            duplicates.add(clip_id)
        seen.add(clip_id)
    if duplicates:
        raise CalibrationDataError(
            "duplicate clip_id values: " + ", ".join(sorted(duplicates))
        )


def _check_speaker_split_isolation(records: list[dict[str, Any]]) -> None:
    speakers = {
        split: {record["speaker_id"] for record in records if record["split"] == split}
        for split in VALID_SPLITS
    }
    overlap = sorted(speakers["calibration"] & speakers["test"])
    if overlap:
        raise CalibrationDataError(
            "speaker leakage across calibration/test splits: " + ", ".join(overlap)
        )


def wilson_interval(successes: int, total: int, *, z: float = 1.959963984540054) -> list[float] | None:
    if total <= 0:
        return None
    p = successes / total
    z2 = z * z
    denominator = 1.0 + z2 / total
    center = (p + z2 / (2.0 * total)) / denominator
    margin = (
        z
        * math.sqrt((p * (1.0 - p) / total) + (z2 / (4.0 * total * total)))
        / denominator
    )
    return [max(0.0, center - margin), min(1.0, center + margin)]


def _ratio(numerator: int, denominator: int) -> float | None:
    return numerator / denominator if denominator else None


def _prediction(record: dict[str, Any], min_confidence: float | None) -> bool:
    provider = record["provider"]
    if not provider["flagged"]:
        return False
    if min_confidence is None:
        return True
    confidence = provider["confidence"]
    return confidence is not None and confidence >= min_confidence


def _basic_confusion(
    records: Iterable[dict[str, Any]],
    *,
    min_confidence: float | None,
) -> dict[str, int]:
    tp = fp = fn = tn = 0

    for record in records:
        label = _resolved_human_label(record)
        if label not in {"acceptable", "clearly_problematic"}:
            continue

        actual = label == "clearly_problematic"
        predicted = _prediction(record, min_confidence)

        if predicted and actual:
            tp += 1
        elif predicted and not actual:
            fp += 1
        elif not predicted and actual:
            fn += 1
        else:
            tn += 1

    return {"tp": tp, "fp": fp, "fn": fn, "tn": tn}


def _metric_from_counts(counts: dict[str, int], metric: str) -> float | None:
    tp = counts["tp"]
    fp = counts["fp"]
    fn = counts["fn"]

    if metric == "precision":
        return _ratio(tp, tp + fp)
    if metric == "recall":
        return _ratio(tp, tp + fn)
    raise ValueError(f"unsupported bootstrap metric: {metric}")


def _speaker_bootstrap_interval(
    records: list[dict[str, Any]],
    *,
    min_confidence: float | None,
    metric: str,
    seed_offset: int,
) -> list[float] | None:
    speakers = sorted({record["speaker_id"] for record in records})
    if len(speakers) < 2:
        return None

    by_speaker = {
        speaker_id: _basic_confusion(
            (record for record in records if record["speaker_id"] == speaker_id),
            min_confidence=min_confidence,
        )
        for speaker_id in speakers
    }

    rng = random.Random(BOOTSTRAP_SEED + seed_offset)
    values: list[float] = []

    for _ in range(BOOTSTRAP_REPLICATES):
        sampled = [rng.choice(speakers) for _ in speakers]
        aggregate = {"tp": 0, "fp": 0, "fn": 0, "tn": 0}

        for speaker_id in sampled:
            counts = by_speaker[speaker_id]
            for key in aggregate:
                aggregate[key] += counts[key]

        value = _metric_from_counts(aggregate, metric)
        if value is not None:
            values.append(value)

    if not values:
        return None

    values.sort()
    lower_index = int(math.floor(0.025 * (len(values) - 1)))
    upper_index = int(math.ceil(0.975 * (len(values) - 1)))
    return [values[lower_index], values[upper_index]]


def _confusion(
    records: Iterable[dict[str, Any]],
    *,
    min_confidence: float | None,
) -> dict[str, Any]:
    rows = list(records)
    counts = _basic_confusion(rows, min_confidence=min_confidence)
    tp = counts["tp"]
    fp = counts["fp"]
    fn = counts["fn"]
    tn = counts["tn"]
    precision_total = tp + fp
    recall_total = tp + fn
    negative_total = fp + tn
    speakers = {record["speaker_id"] for record in rows}

    return {
        "n_clips": tp + fp + fn + tn,
        "n_speakers": len(speakers),
        **counts,
        "precision": _ratio(tp, precision_total),
        "recall": _ratio(tp, recall_total),
        "false_positive_rate": _ratio(fp, negative_total),
        "false_negative_rate": _ratio(fn, recall_total),
        "precision_ci95_wilson_clip_level": wilson_interval(tp, precision_total),
        "recall_ci95_wilson_clip_level": wilson_interval(tp, recall_total),
        "precision_ci95_speaker_bootstrap": _speaker_bootstrap_interval(
            rows,
            min_confidence=min_confidence,
            metric="precision",
            seed_offset=11,
        ),
        "recall_ci95_speaker_bootstrap": _speaker_bootstrap_interval(
            rows,
            min_confidence=min_confidence,
            metric="recall",
            seed_offset=29,
        ),
    }


def _annotation_agreement(records: Iterable[dict[str, Any]]) -> dict[str, Any]:
    rows = list(records)
    if not rows:
        return {
            "n_double_rated": 0,
            "agreement_rate": None,
            "cohen_kappa": None,
        }

    agreements = sum(
        record["human"]["rater_a"] == record["human"]["rater_b"] for record in rows
    )
    marginals_a = {label: 0 for label in VALID_LABELS}
    marginals_b = {label: 0 for label in VALID_LABELS}

    for record in rows:
        marginals_a[record["human"]["rater_a"]] += 1
        marginals_b[record["human"]["rater_b"]] += 1

    total = len(rows)
    observed = agreements / total
    expected = sum(
        (marginals_a[label] / total) * (marginals_b[label] / total)
        for label in VALID_LABELS
    )
    kappa = None if math.isclose(1.0 - expected, 0.0) else (observed - expected) / (1.0 - expected)

    return {
        "n_double_rated": total,
        "agreement_rate": observed,
        "cohen_kappa": kappa,
    }


def evaluate_records(
    raw_records: Iterable[Any],
    *,
    split: str = "test",
    min_confidence: float | None = None,
) -> dict[str, Any]:
    if split not in VALID_SPLITS:
        raise CalibrationDataError("split must be 'calibration' or 'test'")
    if min_confidence is not None and (
        not math.isfinite(min_confidence)
        or min_confidence < 0.0
        or min_confidence > 1.0
    ):
        raise CalibrationDataError("min_confidence must be inside [0, 1]")

    records = [validate_record(record) for record in raw_records]
    _check_unique_clips(records)
    _check_speaker_split_isolation(records)

    selected = [record for record in records if record["split"] == split]
    unresolved = 0
    uncertain = 0
    eligible: list[dict[str, Any]] = []

    for record in selected:
        label = _resolved_human_label(record)
        if label is None:
            unresolved += 1
        elif label == "uncertain":
            uncertain += 1
        else:
            eligible.append(record)

    target_ids = sorted({record["target_sound_id"] for record in eligible})
    by_target = {
        target_id: _confusion(
            (record for record in eligible if record["target_sound_id"] == target_id),
            min_confidence=min_confidence,
        )
        for target_id in target_ids
    }

    return {
        "schema_version": SCHEMA_VERSION,
        "split": split,
        "min_confidence": min_confidence,
        "records_total_all_splits": len(records),
        "records_selected_split": len(selected),
        "records_eligible_binary": len(eligible),
        "excluded_unresolved": unresolved,
        "excluded_uncertain": uncertain,
        "annotation_agreement": _annotation_agreement(selected),
        "overall": _confusion(eligible, min_confidence=min_confidence),
        "by_target_sound_id": by_target,
    }


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Evaluate sanitized OpenPronounce shadow evidence against blind human labels. "
            "This command never reads raw audio."
        )
    )
    parser.add_argument("input", type=Path, help="Calibration JSONL file")
    parser.add_argument(
        "--split",
        choices=sorted(VALID_SPLITS),
        default="test",
        help="Evaluate the frozen calibration or held-out test split (default: test)",
    )
    parser.add_argument(
        "--min-confidence",
        type=float,
        default=None,
        help=(
            "Optional provider error-confidence threshold in [0,1]. "
            "Do not select this threshold on the held-out test split."
        ),
    )
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Emit compact JSON instead of indented JSON",
    )
    return parser.parse_args()


def main() -> int:
    args = _parse_args()
    try:
        records = load_jsonl(args.input)
        report = evaluate_records(
            records,
            split=args.split,
            min_confidence=args.min_confidence,
        )
    except CalibrationDataError as error:
        raise SystemExit(f"calibration_data_error: {error}") from None

    print(
        json.dumps(
            report,
            ensure_ascii=False,
            indent=None if args.compact else 2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
