from __future__ import annotations

from dataclasses import asdict, dataclass
from hashlib import sha256
import json
import math
from typing import Any, Literal


N044_ANALYSIS_STATUS = "synthetic-assumption-analysis-only"
N044_MARGIN_STATUS = "unjustified"
N044_SENSITIVITY_GRID = (0.0, 0.0025, 0.005, 0.01, 0.02, 0.05, 0.1)

Action = Literal["intervene", "no-intervention"]


@dataclass(frozen=True)
class UtilityAssumptions:
    assumption_id: str
    false_intervention_cost: float
    missed_error_cost: float
    intervention_burden: float
    intervention_effectiveness: float

    def validate(self) -> None:
        if not self.assumption_id:
            raise ValueError("assumption_id must be non-empty")
        for field, value in (
            ("false_intervention_cost", self.false_intervention_cost),
            ("missed_error_cost", self.missed_error_cost),
            ("intervention_burden", self.intervention_burden),
        ):
            if not math.isfinite(value) or value < 0:
                raise ValueError(f"{field} must be finite and nonnegative")
        if not math.isfinite(self.intervention_effectiveness) or not 0 <= self.intervention_effectiveness <= 1:
            raise ValueError("intervention_effectiveness must be finite and in [0, 1]")

    @property
    def decision_threshold(self) -> float | None:
        """Probability above which the modeled intervention has lower expected cost.

        None means the assumed intervention can never beat no intervention for any probability in
        [0, 1]. The threshold is an assumption-derived policy boundary, not an empirical learner
        threshold.
        """
        self.validate()
        denominator = (
            self.intervention_effectiveness * self.missed_error_cost
            + self.false_intervention_cost
        )
        numerator = self.intervention_burden + self.false_intervention_cost
        if denominator <= 0:
            return None
        threshold = numerator / denominator
        if threshold > 1:
            return None
        return threshold


@dataclass(frozen=True)
class SyntheticUtilityScenario:
    scenario_id: str
    true_error_probability: float
    control_probability: float
    candidate_probability: float
    rationale: str

    def validate(self) -> None:
        if not self.scenario_id:
            raise ValueError("scenario_id must be non-empty")
        for field, value in (
            ("true_error_probability", self.true_error_probability),
            ("control_probability", self.control_probability),
            ("candidate_probability", self.candidate_probability),
        ):
            if not math.isfinite(value) or not 0 < value < 1:
                raise ValueError(f"{field} must be finite and strictly between 0 and 1")


@dataclass(frozen=True)
class ScenarioResult:
    scenario_id: str
    assumption_id: str
    control_action: Action
    candidate_action: Action
    action_changed: bool
    control_expected_log_loss: float
    candidate_expected_log_loss: float
    log_loss_difference: float
    control_policy_cost: float
    candidate_policy_cost: float
    policy_cost_difference: float
    sensitivity: tuple[dict[str, float | bool], ...]


def _expected_no_intervention_cost(error_probability: float, assumptions: UtilityAssumptions) -> float:
    return error_probability * assumptions.missed_error_cost


def _expected_intervention_cost(error_probability: float, assumptions: UtilityAssumptions) -> float:
    residual_error_cost = (
        error_probability
        * (1 - assumptions.intervention_effectiveness)
        * assumptions.missed_error_cost
    )
    false_intervention_cost = (
        (1 - error_probability) * assumptions.false_intervention_cost
    )
    return assumptions.intervention_burden + residual_error_cost + false_intervention_cost


def choose_action(predicted_error_probability: float, assumptions: UtilityAssumptions) -> Action:
    if not math.isfinite(predicted_error_probability) or not 0 <= predicted_error_probability <= 1:
        raise ValueError("predicted_error_probability must be finite and in [0, 1]")
    assumptions.validate()
    intervention = _expected_intervention_cost(predicted_error_probability, assumptions)
    no_intervention = _expected_no_intervention_cost(predicted_error_probability, assumptions)
    # Exact ties fail closed to no intervention. N044 is not authorizing a learner-facing policy.
    return "intervene" if intervention < no_intervention else "no-intervention"


def expected_log_loss(true_error_probability: float, predicted_error_probability: float) -> float:
    if not math.isfinite(true_error_probability) or not 0 <= true_error_probability <= 1:
        raise ValueError("true_error_probability must be finite and in [0, 1]")
    if not math.isfinite(predicted_error_probability) or not 0 < predicted_error_probability < 1:
        raise ValueError("predicted_error_probability must be finite and strictly between 0 and 1")
    return -(
        true_error_probability * math.log(predicted_error_probability)
        + (1 - true_error_probability) * math.log(1 - predicted_error_probability)
    )


def expected_policy_cost(
    true_error_probability: float,
    action: Action,
    assumptions: UtilityAssumptions,
) -> float:
    if not math.isfinite(true_error_probability) or not 0 <= true_error_probability <= 1:
        raise ValueError("true_error_probability must be finite and in [0, 1]")
    assumptions.validate()
    if action == "intervene":
        return _expected_intervention_cost(true_error_probability, assumptions)
    if action == "no-intervention":
        return _expected_no_intervention_cost(true_error_probability, assumptions)
    raise ValueError(f"unsupported action: {action}")


def analyze_scenario(
    scenario: SyntheticUtilityScenario,
    assumptions: UtilityAssumptions,
    sensitivity_grid: tuple[float, ...] = N044_SENSITIVITY_GRID,
) -> ScenarioResult:
    scenario.validate()
    assumptions.validate()
    if not sensitivity_grid or tuple(sorted(set(sensitivity_grid))) != sensitivity_grid:
        raise ValueError("sensitivity_grid must be non-empty, unique and ascending")
    if any(not math.isfinite(value) or value < 0 for value in sensitivity_grid):
        raise ValueError("sensitivity_grid values must be finite and nonnegative")

    control_action = choose_action(scenario.control_probability, assumptions)
    candidate_action = choose_action(scenario.candidate_probability, assumptions)
    control_log_loss = expected_log_loss(
        scenario.true_error_probability,
        scenario.control_probability,
    )
    candidate_log_loss = expected_log_loss(
        scenario.true_error_probability,
        scenario.candidate_probability,
    )
    log_loss_difference = candidate_log_loss - control_log_loss
    control_policy_cost = expected_policy_cost(
        scenario.true_error_probability,
        control_action,
        assumptions,
    )
    candidate_policy_cost = expected_policy_cost(
        scenario.true_error_probability,
        candidate_action,
        assumptions,
    )
    sensitivity = tuple(
        {
            "margin": margin,
            "clears_margin": log_loss_difference < -margin,
        }
        for margin in sensitivity_grid
    )
    return ScenarioResult(
        scenario_id=scenario.scenario_id,
        assumption_id=assumptions.assumption_id,
        control_action=control_action,
        candidate_action=candidate_action,
        action_changed=control_action != candidate_action,
        control_expected_log_loss=control_log_loss,
        candidate_expected_log_loss=candidate_log_loss,
        log_loss_difference=log_loss_difference,
        control_policy_cost=control_policy_cost,
        candidate_policy_cost=candidate_policy_cost,
        policy_cost_difference=candidate_policy_cost - control_policy_cost,
        sensitivity=sensitivity,
    )


def frozen_assumption_profiles() -> tuple[UtilityAssumptions, ...]:
    # These are deliberately normalized synthetic cost profiles. They are not estimates of learner
    # harm, intervention efficacy, product value or willingness to pay.
    return (
        UtilityAssumptions(
            assumption_id="balanced-normalized",
            false_intervention_cost=1.0,
            missed_error_cost=1.0,
            intervention_burden=0.0,
            intervention_effectiveness=1.0,
        ),
        UtilityAssumptions(
            assumption_id="intervention-costly",
            false_intervention_cost=1.0,
            missed_error_cost=2.0,
            intervention_burden=0.25,
            intervention_effectiveness=0.5,
        ),
        UtilityAssumptions(
            assumption_id="missed-error-costly",
            false_intervention_cost=0.5,
            missed_error_cost=3.0,
            intervention_burden=0.1,
            intervention_effectiveness=0.75,
        ),
    )


def frozen_scenarios() -> tuple[SyntheticUtilityScenario, ...]:
    return (
        SyntheticUtilityScenario(
            scenario_id="large-logloss-gain-no-action-change",
            true_error_probability=0.80,
            control_probability=0.60,
            candidate_probability=0.75,
            rationale="Better probability estimate while both predictions remain on the same side of the policy boundary.",
        ),
        SyntheticUtilityScenario(
            scenario_id="small-logloss-gain-beneficial-crossing",
            true_error_probability=0.55,
            control_probability=0.49,
            candidate_probability=0.51,
            rationale="A small probability improvement can cross a decision boundary and change downstream cost.",
        ),
        SyntheticUtilityScenario(
            scenario_id="large-logloss-gain-harmful-crossing",
            true_error_probability=0.49,
            control_probability=0.10,
            candidate_probability=0.51,
            rationale="Expected log loss can improve while an imperfect probability estimate crosses the policy boundary in the costly direction.",
        ),
        SyntheticUtilityScenario(
            scenario_id="large-logloss-gain-low-risk-no-action",
            true_error_probability=0.20,
            control_probability=0.40,
            candidate_probability=0.25,
            rationale="A sizable probability improvement can have zero downstream policy effect when neither prediction changes the action.",
        ),
    )


def _canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False)


def build_n044_utility_report() -> dict[str, Any]:
    profiles = frozen_assumption_profiles()
    scenarios = frozen_scenarios()
    analyses = []
    for assumptions in profiles:
        for scenario in scenarios:
            analyses.append(asdict(analyze_scenario(scenario, assumptions)))

    balanced = {
        result["scenario_id"]: result
        for result in analyses
        if result["assumption_id"] == "balanced-normalized"
    }
    small_benefit = balanced["small-logloss-gain-beneficial-crossing"]
    no_action = balanced["large-logloss-gain-no-action-change"]
    harmful = balanced["large-logloss-gain-harmful-crossing"]
    if not (
        small_benefit["log_loss_difference"] < 0
        and small_benefit["policy_cost_difference"] < 0
        and no_action["log_loss_difference"] < small_benefit["log_loss_difference"]
        and no_action["policy_cost_difference"] == 0
        and harmful["log_loss_difference"] < no_action["log_loss_difference"]
        and harmful["policy_cost_difference"] > 0
    ):
        raise AssertionError("frozen N044 scenarios no longer demonstrate non-monotone utility mapping")

    payload: dict[str, Any] = {
        "status": N044_ANALYSIS_STATUS,
        "contract": "nep.native-evidence-pilot.v1",
        "task": "N044",
        "analysis_scope": "pre-N3-synthetic-assumption-sensitivity",
        "human_outcomes_used": False,
        "intervention_executed": False,
        "sensitivity_grid_log_loss_nat": list(N044_SENSITIVITY_GRID),
        "former_0_01_nat_status": "sensitivity-point-only-not-authority",
        "assumption_profiles": [
            {
                **asdict(profile),
                "decision_threshold": profile.decision_threshold,
                "empirical_status": "unvalidated-normalized-assumption",
            }
            for profile in profiles
        ],
        "synthetic_scenarios": [asdict(scenario) for scenario in scenarios],
        "analyses": analyses,
        "disposition": {
            "margin_status": N044_MARGIN_STATUS,
            "delta_history": None,
            "delta_basis": None,
            "predictive_keep_simplify_enabled": False,
            "recommended_collection_mode": "descriptive-only-if-separately-approved",
            "reason": (
                "The same or larger expected log-loss improvement can correspond to beneficial, zero, or harmful "
                "thresholded intervention changes under explicit synthetic assumptions. No observed product-specific "
                "false-intervention cost, missed-intervention cost, intervention burden, or intervention effectiveness "
                "exists in this pilot to identify a positive log-loss materiality margin."
            ),
        },
        "claim_boundary": {
            "synthetic_utility_is_learner_evidence": False,
            "learner_model_validity": False,
            "intervention_efficacy": False,
            "calibration": False,
            "mastery": False,
            "production_authority": False,
        },
    }
    digest = sha256(_canonical_json(payload).encode("utf-8")).hexdigest()
    return {**payload, "report_digest": f"sha256:{digest}"}
