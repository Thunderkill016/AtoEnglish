from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

from metrics import evaluate_binary_probabilities
from slam_io import parse_gold_key, parse_slam_lines


def _labels_from_train(path: Path) -> list[int]:
    with path.open("r", encoding="utf-8") as handle:
        exercises = list(parse_slam_lines(handle, "train"))
    labels = [token.label for exercise in exercises for token in exercise.tokens]
    if any(label is None for label in labels):
        raise ValueError("TRAIN parser produced an unlabeled row")
    return [int(label) for label in labels if label is not None]


def _token_ids_from_blind(path: Path, split: str) -> list[str]:
    with path.open("r", encoding="utf-8") as handle:
        exercises = list(parse_slam_lines(handle, split))
    return [token.token_id for exercise in exercises for token in exercise.tokens]


def prevalence_probability(train_labels: Iterable[int]) -> float:
    labels = list(train_labels)
    if not labels:
        raise ValueError("B0 requires at least one TRAIN label")
    if any(label not in {0, 1} for label in labels):
        raise ValueError("B0 TRAIN labels must be 0/1")
    return sum(labels) / len(labels)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run CORE-REALITY-001 B0 prevalence baseline")
    parser.add_argument("--train", type=Path, required=True)
    parser.add_argument("--eval", type=Path, required=True)
    parser.add_argument("--gold", type=Path, required=True)
    parser.add_argument("--split", choices=["dev", "test"], required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    train_labels = _labels_from_train(args.train)
    prevalence = prevalence_probability(train_labels)
    token_ids = _token_ids_from_blind(args.eval, args.split)
    with args.gold.open("r", encoding="utf-8") as handle:
        gold = parse_gold_key(handle)

    missing = [token_id for token_id in token_ids if token_id not in gold]
    extras = sorted(set(gold) - set(token_ids))
    if missing or extras:
        raise ValueError(
            f"gold/evaluation token mismatch: missing={len(missing)}, extras={len(extras)}"
        )

    labels = [gold[token_id] for token_id in token_ids]
    probabilities = [prevalence] * len(labels)
    metrics = evaluate_binary_probabilities(labels, probabilities)

    payload = {
        "baselineId": "B0",
        "split": args.split,
        "trainPrevalence": prevalence,
        "metrics": {
            "auc": metrics.auc,
            "f1At05": metrics.f1_at_05,
            "logLoss": metrics.log_loss,
            "tokenCount": metrics.token_count,
            "positiveCount": metrics.positive_count,
            "positivePrevalence": metrics.positive_prevalence,
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(payload, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
