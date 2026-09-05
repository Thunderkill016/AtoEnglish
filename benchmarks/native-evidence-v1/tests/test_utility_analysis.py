from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.utility import (  # noqa: E402
    N044_SENSITIVITY_GRID,
    UtilityAssumptions,
    analyze_scenario,
    build_n044_utility_report,
    choose_action,
    frozen_scenarios,
)


class UtilityAnalysisTests(unittest.TestCase):
    def setUp(self) -> None:
        self.balanced = UtilityAssumptions(
            assumption_id="balanced-test",
            false_intervention_cost=1.0,
            missed_error_cost=1.0,
            intervention_burden=0.0,
            intervention_effectiveness=1.0,
        )
        self.scenarios = {scenario.scenario_id: scenario for scenario in frozen_scenarios()}

    def test_balanced_policy_threshold_is_half_and_ties_do_not_intervene(self) -> None:
        self.assertEqual(self.balanced.decision_threshold, 0.5)
        self.assertEqual(choose_action(0.5, self.balanced), "no-intervention")
        self.assertEqual(choose_action(0.500001, self.balanced), "intervene")

    def test_small_logloss_gain_can_have_material_policy_effect(self) -> None:
        result = analyze_scenario(
            self.scenarios["small-logloss-gain-beneficial-crossing"],
            self.balanced,
        )
        self.assertLess(result.log_loss_difference, 0)
        self.assertGreater(result.log_loss_difference, -0.005)
        self.assertTrue(result.action_changed)
        self.assertLess(result.policy_cost_difference, 0)

    def test_larger_logloss_gain_can_have_zero_policy_effect(self) -> None:
        result = analyze_scenario(
            self.scenarios["large-logloss-gain-no-action-change"],
            self.balanced,
        )
        self.assertLess(result.log_loss_difference, -0.05)
        self.assertFalse(result.action_changed)
        self.assertEqual(result.policy_cost_difference, 0)

    def test_even_larger_logloss_gain_can_cross_policy_boundary_harmfully(self) -> None:
        result = analyze_scenario(
            self.scenarios["large-logloss-gain-harmful-crossing"],
            self.balanced,
        )
        self.assertLess(result.log_loss_difference, -0.1)
        self.assertTrue(result.action_changed)
        self.assertGreater(result.policy_cost_difference, 0)

    def test_sensitivity_grid_contains_zero_and_below_at_above_former_margin(self) -> None:
        self.assertIn(0.0, N044_SENSITIVITY_GRID)
        self.assertTrue(any(0 < value < 0.01 for value in N044_SENSITIVITY_GRID))
        self.assertIn(0.01, N044_SENSITIVITY_GRID)
        self.assertTrue(any(value > 0.01 for value in N044_SENSITIVITY_GRID))

    def test_report_fails_closed_without_approved_materiality_margins(self) -> None:
        report = build_n044_utility_report()
        self.assertEqual(report["status"], "synthetic-assumption-analysis-only")
        self.assertFalse(report["human_outcomes_used"])
        self.assertFalse(report["intervention_executed"])
        self.assertEqual(report["disposition"]["margin_status"], "unjustified")
        self.assertIsNone(report["disposition"]["delta_history"])
        self.assertIsNone(report["disposition"]["delta_basis"])
        self.assertFalse(report["disposition"]["predictive_keep_simplify_enabled"])
        self.assertRegex(report["report_digest"], r"^sha256:[0-9a-f]{64}$")

    def test_report_is_deterministic(self) -> None:
        first = build_n044_utility_report()
        second = build_n044_utility_report()
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
