from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping, Sequence

import numpy as np
from sklearn.linear_model import LogisticRegression

from .preprocessing import FeatureRow, FrozenFeatureTransform, fit_feature_transform


@dataclass(frozen=True)
class PredictorSpec:
    penalty: str = "l2"
    C: float = 1.0
    solver: str = "lbfgs"
    fit_intercept: bool = True
    class_weight: None = None
    max_iter: int = 1000
    tol: float = 1e-8
    random_state: int = 143


@dataclass(frozen=True)
class FrozenPredictor:
    feature_transform: FrozenFeatureTransform
    model: LogisticRegression | None
    availability: str
    unavailable_reason: str | None
    train_row_count: int
    train_positive_count: int
    spec: PredictorSpec

    def predict_error_probability(self, rows: Sequence[FeatureRow]) -> np.ndarray:
        if self.model is None:
            raise RuntimeError(f"predictor is unavailable: {self.unavailable_reason}")
        matrix = self.feature_transform.transform(rows)
        probabilities = self.model.predict_proba(matrix)
        classes = list(self.model.classes_)
        positive_index = classes.index(1)
        return probabilities[:, positive_index].astype(np.float64, copy=False)


def fit_common_logistic_predictor(
    train_rows: Sequence[FeatureRow],
    train_labels: Sequence[int],
    *,
    categorical_domains: Mapping[str, Sequence[str]],
    spec: PredictorSpec = PredictorSpec(),
) -> FrozenPredictor:
    if len(train_rows) != len(train_labels):
        raise ValueError("train_rows and train_labels must have equal length")
    if not train_rows:
        raise ValueError("cannot fit predictor without TRAIN rows")
    if any(label not in {0, 1} for label in train_labels):
        raise ValueError("train_labels must be binary 0/1")

    transform = fit_feature_transform(train_rows, categorical_domains=categorical_domains)
    positives = int(sum(train_labels))
    if len(set(train_labels)) < 2:
        return FrozenPredictor(
            feature_transform=transform,
            model=None,
            availability="not-estimable",
            unavailable_reason="one-class-train",
            train_row_count=len(train_rows),
            train_positive_count=positives,
            spec=spec,
        )
    if not transform.retained_columns:
        return FrozenPredictor(
            feature_transform=transform,
            model=None,
            availability="not-estimable",
            unavailable_reason="no-nonconstant-features",
            train_row_count=len(train_rows),
            train_positive_count=positives,
            spec=spec,
        )

    matrix = transform.transform(train_rows)
    model = LogisticRegression(
        penalty=spec.penalty,
        C=spec.C,
        solver=spec.solver,
        fit_intercept=spec.fit_intercept,
        class_weight=spec.class_weight,
        max_iter=spec.max_iter,
        tol=spec.tol,
        random_state=spec.random_state,
    )
    model.fit(matrix, np.asarray(train_labels, dtype=np.int64))

    return FrozenPredictor(
        feature_transform=transform,
        model=model,
        availability="available",
        unavailable_reason=None,
        train_row_count=len(train_rows),
        train_positive_count=positives,
        spec=spec,
    )


@dataclass(frozen=True)
class PrevalenceBaseline:
    alpha: float
    beta: float
    train_row_count: int
    train_positive_count: int

    @property
    def error_probability(self) -> float:
        return (self.train_positive_count + self.alpha) / (
            self.train_row_count + self.alpha + self.beta
        )

    def predict(self, row_count: int) -> np.ndarray:
        if row_count < 0:
            raise ValueError("row_count must be nonnegative")
        return np.full(row_count, self.error_probability, dtype=np.float64)


def fit_prevalence_baseline(
    train_labels: Sequence[int], *, alpha: float = 1.0, beta: float = 1.0
) -> PrevalenceBaseline:
    if alpha <= 0 or beta <= 0:
        raise ValueError("alpha and beta must be positive")
    if any(label not in {0, 1} for label in train_labels):
        raise ValueError("train_labels must be binary 0/1")
    return PrevalenceBaseline(
        alpha=alpha,
        beta=beta,
        train_row_count=len(train_labels),
        train_positive_count=int(sum(train_labels)),
    )
