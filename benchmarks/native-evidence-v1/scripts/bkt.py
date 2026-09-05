from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

import numpy as np
import pandas as pd
from pyBKT.models import Model

PYBKT_SOURCE_REVISION = "06fc180ae72c117458acc527f8ec90cc8e0581c1"
PYBKT_PACKAGE_VERSION = "1.4.3"
PYBKT_SEED = 143
PYBKT_NUM_FITS = 5

BKT_DEFAULTS = {
    "order_id": "order_id",
    "skill_name": "skill_name",
    "correct": "correct",
    "user_id": "user_id",
}

REQUIRED_COLUMNS = ("order_id", "skill_name", "correct", "user_id")


@dataclass(frozen=True)
class BktComparatorMetadata:
    source_revision: str
    package_version: str
    seed: int
    num_fits: int
    parallel: bool
    forgets: bool
    backend_default_num_fits: int
    backend_default_forgets: bool


@dataclass
class FrozenBktComparator:
    model: Model
    metadata: BktComparatorMetadata

    def predict_error_probabilities(self, causal_sequence: pd.DataFrame) -> np.ndarray:
        frame = validate_bkt_frame(causal_sequence)
        predicted = self.model.predict(data=frame.copy())
        if "correct_predictions" not in predicted.columns:
            raise RuntimeError("pyBKT prediction frame omitted correct_predictions")
        correct = predicted["correct_predictions"].to_numpy(dtype=np.float64, copy=True)
        if not np.all(np.isfinite(correct)) or np.any(correct < 0) or np.any(correct > 1):
            raise RuntimeError("pyBKT emitted invalid correctness probabilities")
        return 1.0 - correct

    def fitted_parameters(self) -> pd.DataFrame:
        return self.model.params().copy()


def validate_bkt_frame(data: pd.DataFrame) -> pd.DataFrame:
    missing = [column for column in REQUIRED_COLUMNS if column not in data.columns]
    if missing:
        raise ValueError(f"pyBKT frame missing required columns: {missing}")
    if data.empty:
        raise ValueError("pyBKT frame must not be empty")

    frame = data.copy()
    correctness = frame["correct"].tolist()
    if any(value not in (0, 1) for value in correctness):
        raise ValueError("pyBKT correctness must be binary 0/1 for this comparator")
    if frame["user_id"].isna().any() or frame["skill_name"].isna().any():
        raise ValueError("pyBKT user_id and skill_name must be observed")

    for _, learner_frame in frame.groupby("user_id", sort=False):
        order = learner_frame["order_id"].tolist()
        if order != sorted(order):
            raise ValueError("pyBKT order_id must be monotone within learner")
        if len(order) != len(set(order)):
            raise ValueError("pyBKT order_id must be unique within learner")

    return frame


def fit_source_faithful_bkt(train_data: pd.DataFrame) -> FrozenBktComparator:
    frame = validate_bkt_frame(train_data)
    model = Model(seed=PYBKT_SEED, num_fits=PYBKT_NUM_FITS, parallel=False)
    model.fit(data=frame, defaults=BKT_DEFAULTS, forgets=False)

    metadata = BktComparatorMetadata(
        source_revision=PYBKT_SOURCE_REVISION,
        package_version=PYBKT_PACKAGE_VERSION,
        seed=PYBKT_SEED,
        num_fits=PYBKT_NUM_FITS,
        parallel=False,
        forgets=False,
        backend_default_num_fits=int(Model.DEFAULTS["num_fits"]),
        backend_default_forgets=bool(Model.DEFAULTS["forgets"]),
    )
    return FrozenBktComparator(model=model, metadata=metadata)


def build_bkt_frame(
    *,
    participant_ids: Sequence[str],
    correctness: Sequence[int],
    skill_name: str = "present-subject-verb-agreement",
) -> pd.DataFrame:
    if len(participant_ids) != len(correctness):
        raise ValueError("participant_ids and correctness must have equal length")
    next_order: dict[str, int] = {}
    rows: list[dict[str, object]] = []
    for participant_id, correct in zip(participant_ids, correctness, strict=True):
        order_id = next_order.get(participant_id, 0)
        next_order[participant_id] = order_id + 1
        rows.append(
            {
                "order_id": order_id,
                "skill_name": skill_name,
                "correct": correct,
                "user_id": participant_id,
            }
        )
    return validate_bkt_frame(pd.DataFrame(rows))
