from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from hashlib import sha256
import json
import math
from typing import Any, Literal, Sequence


N043_ANALYSIS_STATUS = "pre-n3-design-analysis-only"
N043_RECRUITMENT_STATUS = "predictive-count-unjustified"
N043_COUNTERBALANCE_BLOCK_SIZE = 5
N043_FORM_GROUPS = ("form-a", "form-b", "form-c", "form-d", "form-e")
N043_PRIMARY_FAMILIES = ("free-recall", "delayed-free-recall", "near-transfer")
N043_MANDATORY_LANES = ("b2-native", "b2-basis-native", "b3-native")
N043_LOG_LOSS_SD_GRID = (0.05, 0.10, 0.20, 0.40)
N043_LOG_LOSS_HALF_WIDTH_GRID = (0.01, 0.02, 0.05, 0.10)

PilotPhase = Literal["train-prefix", "blind-test"]
PilotFamily = Literal[
    "recognition-independent",
    "recognition-supported",
    "free-recall",
    "delayed-free-recall",
    "near-transfer",
]


@dataclass(frozen=True)
class OpportunityTemplate:
    ordinal: int
    family: PilotFamily
    phase: PilotPhase
    day_offset: int
    minute_offset: int
    context_id: str


@dataclass(frozen=True)
class ScheduledOpportunity:
    event_id: str
    participant_id: str
    participant_slot: int
    ordinal: int
    family: PilotFamily
    phase: PilotPhase
    scheduled_at: str
    context_id: str
    stimulus_form_group: str
    family_occurrence_index: int


@dataclass(frozen=True)
class CoverageDecisionGates:
    minimum_row_outcome_coverage: float = 1.0
    minimum_learner_outcome_coverage: float = 1.0
    minimum_primary_family_outcome_coverage: float = 1.0
    minimum_prediction_coverage: float = 1.0
    maximum_between_lane_prediction_coverage_difference: float = 0.0

    def validate(self) -> None:
        for field, value in asdict(self).items():
            if not math.isfinite(value) or not 0 <= value <= 1:
                raise ValueError(f"{field} must be finite and in [0, 1]")


@dataclass(frozen=True)
class CoverageObservation:
    row_outcome_coverage: float
    learner_outcome_coverage: float
    primary_family_outcome_coverage: dict[str, float]
    prediction_coverage_by_lane: dict[str, float]


@dataclass(frozen=True)
class CoverageGateResult:
    predictive_decision_enabled: bool
    failures: tuple[str, ...]


TRAIN_TEMPLATE = (
    OpportunityTemplate(1, "recognition-independent", "train-prefix", 0, 0, "ctx-baseline-a"),
    OpportunityTemplate(2, "recognition-supported", "train-prefix", 0, 5, "ctx-baseline-a"),
    OpportunityTemplate(3, "free-recall", "train-prefix", 0, 10, "ctx-baseline-a"),
    OpportunityTemplate(4, "near-transfer", "train-prefix", 0, 15, "ctx-near-transfer-b"),
    OpportunityTemplate(5, "delayed-free-recall", "train-prefix", 1, 0, "ctx-baseline-a"),
    OpportunityTemplate(6, "recognition-independent", "train-prefix", 1, 5, "ctx-baseline-a"),
    OpportunityTemplate(7, "free-recall", "train-prefix", 1, 10, "ctx-baseline-a"),
    OpportunityTemplate(8, "near-transfer", "train-prefix", 1, 15, "ctx-near-transfer-b"),
)

TEST_TEMPLATE = (
    OpportunityTemplate(9, "free-recall", "blind-test", 0, 0, "ctx-baseline-a"),
    OpportunityTemplate(10, "delayed-free-recall", "blind-test", 1, 0, "ctx-baseline-a"),
    OpportunityTemplate(11, "near-transfer", "blind-test", 1, 10, "ctx-near-transfer-b"),
)


_FAMILY_ORDER: tuple[PilotFamily, ...] = (
    "recognition-independent",
    "recognition-supported",
    "free-recall",
    "delayed-free-recall",
    "near-transfer",
)


def _parse_utc(value: str, field: str) -> datetime:
    normalized = value.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(normalized)
    except ValueError as error:
        raise ValueError(f"{field} must be an ISO timestamp") from error
    if parsed.tzinfo is None:
        raise ValueError(f"{field} must include a timezone")
    return parsed.astimezone(timezone.utc)


def _iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def validate_planned_participant_count(participant_count: int) -> None:
    if participant_count <= 0:
        raise ValueError("participant_count must be positive")
    if participant_count % N043_COUNTERBALANCE_BLOCK_SIZE != 0:
        raise ValueError(
            f"participant_count must be a complete {N043_COUNTERBALANCE_BLOCK_SIZE}-slot counterbalance block"
        )


def _form_group(participant_slot: int, family: PilotFamily, occurrence_index: int) -> str:
    if participant_slot < 0:
        raise ValueError("participant_slot must be nonnegative")
    family_index = _FAMILY_ORDER.index(family)
    form_index = (participant_slot + family_index + occurrence_index) % len(N043_FORM_GROUPS)
    return N043_FORM_GROUPS[form_index]


def build_participant_schedule(
    participant_id: str,
    participant_slot: int,
    *,
    train_anchor_at: str,
    test_anchor_at: str,
) -> tuple[ScheduledOpportunity, ...]:
    if not participant_id.strip():
        raise ValueError("participant_id must be non-empty")
    if participant_slot < 0:
        raise ValueError("participant_slot must be nonnegative")

    train_anchor = _parse_utc(train_anchor_at, "train_anchor_at")
    test_anchor = _parse_utc(test_anchor_at, "test_anchor_at")
    last_train_template = TRAIN_TEMPLATE[-1]
    last_train_at = train_anchor + timedelta(
        days=last_train_template.day_offset,
        minutes=last_train_template.minute_offset,
    )
    # The exact model fit completion is a runtime artifact. The prospective schedule nevertheless
    # leaves a hard one-hour cohort gap so a fit cannot be backdated into the TEST block.
    if test_anchor <= last_train_at + timedelta(hours=1):
        raise ValueError("test_anchor_at must be more than one hour after the final TRAIN-prefix opportunity")

    occurrence_count: dict[PilotFamily, int] = {family: 0 for family in _FAMILY_ORDER}
    scheduled: list[ScheduledOpportunity] = []
    for template in (*TRAIN_TEMPLATE, *TEST_TEMPLATE):
        occurrence_index = occurrence_count[template.family]
        occurrence_count[template.family] += 1
        anchor = train_anchor if template.phase == "train-prefix" else test_anchor
        scheduled_at = anchor + timedelta(days=template.day_offset, minutes=template.minute_offset)
        scheduled.append(
            ScheduledOpportunity(
                event_id=f"{participant_id}:n043:e{template.ordinal:02d}",
                participant_id=participant_id,
                participant_slot=participant_slot,
                ordinal=template.ordinal,
                family=template.family,
                phase=template.phase,
                scheduled_at=_iso(scheduled_at),
                context_id=template.context_id,
                stimulus_form_group=_form_group(
                    participant_slot % N043_COUNTERBALANCE_BLOCK_SIZE,
                    template.family,
                    occurrence_index,
                ),
                family_occurrence_index=occurrence_index,
            )
        )

    # A near-transfer opportunity is only legal after a baseline-context opportunity is already
    # prospectively present in the ordered prefix.
    first_baseline = next(
        item for item in scheduled if item.phase == "train-prefix" and item.context_id == "ctx-baseline-a"
    )
    for transfer in (item for item in scheduled if item.family == "near-transfer"):
        if _parse_utc(transfer.scheduled_at, "scheduled_at") <= _parse_utc(
            first_baseline.scheduled_at, "scheduled_at"
        ):
            raise AssertionError("near-transfer schedule lost its prospective baseline ordering")

    return tuple(scheduled)


def build_leave_one_participant_out_folds(
    participant_ids: Sequence[str],
) -> tuple[dict[str, tuple[str, ...] | str], ...]:
    normalized = tuple(participant_id.strip() for participant_id in participant_ids)
    if not normalized or any(not participant_id for participant_id in normalized):
        raise ValueError("participant_ids must contain non-empty ids")
    if len(set(normalized)) != len(normalized):
        raise ValueError("participant_ids must be unique")
    return tuple(
        {
            "held_out_participant_id": held_out,
            "training_participant_ids": tuple(
                participant_id for participant_id in normalized if participant_id != held_out
            ),
        }
        for held_out in normalized
    )


def evaluate_coverage_gates(
    observation: CoverageObservation,
    gates: CoverageDecisionGates = CoverageDecisionGates(),
) -> CoverageGateResult:
    gates.validate()
    failures: list[str] = []

    for field, value in (
        ("row_outcome_coverage", observation.row_outcome_coverage),
        ("learner_outcome_coverage", observation.learner_outcome_coverage),
    ):
        if not math.isfinite(value) or not 0 <= value <= 1:
            raise ValueError(f"{field} must be finite and in [0, 1]")

    if observation.row_outcome_coverage < gates.minimum_row_outcome_coverage:
        failures.append("row-outcome-coverage")
    if observation.learner_outcome_coverage < gates.minimum_learner_outcome_coverage:
        failures.append("learner-outcome-coverage")

    family_keys = set(observation.primary_family_outcome_coverage)
    if family_keys != set(N043_PRIMARY_FAMILIES):
        raise ValueError("primary_family_outcome_coverage must contain exactly the three primary families")
    for family in N043_PRIMARY_FAMILIES:
        value = observation.primary_family_outcome_coverage[family]
        if not math.isfinite(value) or not 0 <= value <= 1:
            raise ValueError(f"primary family coverage must be finite and in [0, 1]: {family}")
        if value < gates.minimum_primary_family_outcome_coverage:
            failures.append(f"primary-family-outcome-coverage:{family}")

    lane_keys = set(observation.prediction_coverage_by_lane)
    if lane_keys != set(N043_MANDATORY_LANES):
        raise ValueError("prediction_coverage_by_lane must contain exactly the mandatory paired lanes")
    lane_coverages: list[float] = []
    for lane in N043_MANDATORY_LANES:
        value = observation.prediction_coverage_by_lane[lane]
        if not math.isfinite(value) or not 0 <= value <= 1:
            raise ValueError(f"prediction coverage must be finite and in [0, 1]: {lane}")
        lane_coverages.append(value)
        if value < gates.minimum_prediction_coverage:
            failures.append(f"prediction-coverage:{lane}")

    if max(lane_coverages) - min(lane_coverages) > gates.maximum_between_lane_prediction_coverage_difference:
        failures.append("between-lane-prediction-coverage-difference")

    return CoverageGateResult(
        predictive_decision_enabled=not failures,
        failures=tuple(failures),
    )


def normal_approx_required_learners(
    learner_level_sd: float,
    target_half_width: float,
    *,
    z_value: float = 1.96,
) -> int:
    """Planning sensitivity only; not a power guarantee or approved sample-size rule."""
    for field, value in (
        ("learner_level_sd", learner_level_sd),
        ("target_half_width", target_half_width),
        ("z_value", z_value),
    ):
        if not math.isfinite(value) or value <= 0:
            raise ValueError(f"{field} must be finite and positive")
    return max(2, math.ceil((z_value * learner_level_sd / target_half_width) ** 2))


def build_precision_sensitivity_grid() -> tuple[dict[str, float | int], ...]:
    return tuple(
        {
            "assumed_learner_level_sd_nat": sd,
            "target_95pct_half_width_nat": half_width,
            "normal_approx_complete_learners": normal_approx_required_learners(sd, half_width),
        }
        for sd in N043_LOG_LOSS_SD_GRID
        for half_width in N043_LOG_LOSS_HALF_WIDTH_GRID
    )


def _canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False)


def build_n043_design_report() -> dict[str, Any]:
    gates = CoverageDecisionGates()
    precision_grid = build_precision_sensitivity_grid()
    payload: dict[str, Any] = {
        "status": N043_ANALYSIS_STATUS,
        "contract": "nep.native-evidence-pilot.v1",
        "task": "N043",
        "human_outcomes_used": False,
        "recruitment": {
            "status": N043_RECRUITMENT_STATUS,
            "approved_predictive_participant_count": None,
            "counterbalance_block_size": N043_COUNTERBALANCE_BLOCK_SIZE,
            "planned_count_must_be_multiple_of_block_size": True,
            "reason": (
                "No human learner-level variance estimate and no independently approved positive utility margin "
                "currently identify a precision target. The grid is assumption sensitivity only, so selecting one "
                "cell as a predictive recruitment count would be arbitrary."
            ),
        },
        "coverage_decision_gates": asdict(gates),
        "coverage_gate_scope": (
            "Predictive KEEP/SIMPLIFY only. Any shortfall remains reportable descriptively but cannot be repaired "
            "by complete-case learner or row selection."
        ),
        "precision_sensitivity": {
            "method": "normal-approximation-planning-only",
            "formula": "ceil((1.96 * learner_level_sd / target_half_width)^2)",
            "selected_cell": None,
            "grid": list(precision_grid),
        },
        "prospective_schedule": {
            "train_prefix_opportunities_per_learner": len(TRAIN_TEMPLATE),
            "blind_test_opportunities_per_learner": len(TEST_TEMPLATE),
            "train_primary_target_rows_per_learner": sum(
                template.family in N043_PRIMARY_FAMILIES for template in TRAIN_TEMPLATE
            ),
            "blind_primary_target_rows_per_learner": sum(
                template.family in N043_PRIMARY_FAMILIES for template in TEST_TEMPLATE
            ),
            "train_template": [asdict(template) for template in TRAIN_TEMPLATE],
            "test_template": [asdict(template) for template in TEST_TEMPLATE],
            "blind_test_feedback_forbidden": True,
            "global_fit_cutoff_required_after_all_train_prefix_labels": True,
            "fit_completed_before_any_blind_test": True,
            "secondary_cold_start": "leave-one-whole-participant-out; held-out own history excluded",
        },
        "counterbalance": {
            "form_groups": list(N043_FORM_GROUPS),
            "method": "five-slot cyclic family-by-occurrence rotation",
            "allocation_frozen_before_outcomes": True,
            "post-outcome_reassignment_forbidden": True,
        },
        "disposition": {
            "predictive_sizing_status": N043_RECRUITMENT_STATUS,
            "predictive_keep_simplify_enabled": False,
            "recommended_collection_mode": "descriptive-only-if-N040-N041-N044-and-independent-N043-review-approve",
        },
        "claim_boundary": {
            "precision_grid_is_power_evidence": False,
            "coverage_gate_proves_missing_at_random": False,
            "learner_model_validity": False,
            "predictive_superiority": False,
            "production_authority": False,
        },
    }
    digest = sha256(_canonical_json(payload).encode("utf-8")).hexdigest()
    return {**payload, "report_digest": f"sha256:{digest}"}
