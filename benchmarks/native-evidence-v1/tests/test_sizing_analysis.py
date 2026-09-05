from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.sizing import (  # noqa: E402
    N043_FORM_GROUPS,
    N043_MANDATORY_LANES,
    N043_PRIMARY_FAMILIES,
    CoverageObservation,
    build_leave_one_participant_out_folds,
    build_n043_design_report,
    build_participant_schedule,
    evaluate_coverage_gates,
    normal_approx_required_learners,
    validate_planned_participant_count,
)


TRAIN_ANCHOR = "2026-10-01T09:00:00.000Z"
TEST_ANCHOR = "2026-10-03T12:00:00.000Z"


class SizingAndAllocationTests(unittest.TestCase):
    def test_schedule_has_target_history_in_train_and_all_three_blind_primary_families(self) -> None:
        schedule = build_participant_schedule(
            "p01",
            0,
            train_anchor_at=TRAIN_ANCHOR,
            test_anchor_at=TEST_ANCHOR,
        )
        train = [item for item in schedule if item.phase == "train-prefix"]
        test = [item for item in schedule if item.phase == "blind-test"]

        self.assertEqual(len(train), 8)
        self.assertEqual(len(test), 3)
        self.assertEqual(
            {item.family for item in train if item.family in N043_PRIMARY_FAMILIES},
            set(N043_PRIMARY_FAMILIES),
        )
        self.assertEqual(
            tuple(item.family for item in test),
            ("free-recall", "delayed-free-recall", "near-transfer"),
        )
        self.assertEqual(len([item for item in train if item.family in N043_PRIMARY_FAMILIES]), 5)

    def test_repeated_family_occurrences_use_distinct_forms_within_one_participant(self) -> None:
        schedule = build_participant_schedule(
            "p01",
            0,
            train_anchor_at=TRAIN_ANCHOR,
            test_anchor_at=TEST_ANCHOR,
        )
        for family in N043_PRIMARY_FAMILIES:
            forms = [item.stimulus_form_group for item in schedule if item.family == family]
            self.assertEqual(len(forms), len(set(forms)), family)

    def test_complete_five_slot_block_counterbalances_every_opportunity_ordinal(self) -> None:
        schedules = [
            build_participant_schedule(
                f"p{slot}",
                slot,
                train_anchor_at=TRAIN_ANCHOR,
                test_anchor_at=TEST_ANCHOR,
            )
            for slot in range(5)
        ]
        for ordinal in range(1, 12):
            forms = {
                next(item for item in schedule if item.ordinal == ordinal).stimulus_form_group
                for schedule in schedules
            }
            self.assertEqual(forms, set(N043_FORM_GROUPS), ordinal)

    def test_near_transfer_has_prospective_baseline_and_test_starts_after_train_gap(self) -> None:
        schedule = build_participant_schedule(
            "p01",
            3,
            train_anchor_at=TRAIN_ANCHOR,
            test_anchor_at=TEST_ANCHOR,
        )
        baseline = next(item for item in schedule if item.context_id == "ctx-baseline-a")
        transfers = [item for item in schedule if item.family == "near-transfer"]
        self.assertTrue(all(baseline.scheduled_at < transfer.scheduled_at for transfer in transfers))
        last_train = max(item.scheduled_at for item in schedule if item.phase == "train-prefix")
        first_test = min(item.scheduled_at for item in schedule if item.phase == "blind-test")
        self.assertLess(last_train, first_test)

        with self.assertRaisesRegex(ValueError, "more than one hour"):
            build_participant_schedule(
                "p01",
                0,
                train_anchor_at=TRAIN_ANCHOR,
                test_anchor_at="2026-10-02T09:30:00.000Z",
            )

    def test_recruitment_plan_must_use_complete_counterbalance_blocks(self) -> None:
        validate_planned_participant_count(5)
        validate_planned_participant_count(20)
        with self.assertRaisesRegex(ValueError, "complete 5-slot counterbalance block"):
            validate_planned_participant_count(21)

    def test_secondary_cold_start_folds_hold_out_each_whole_participant_once(self) -> None:
        participant_ids = ["p1", "p2", "p3", "p4", "p5"]
        folds = build_leave_one_participant_out_folds(participant_ids)
        self.assertEqual(
            [fold["held_out_participant_id"] for fold in folds],
            participant_ids,
        )
        for fold in folds:
            held_out = fold["held_out_participant_id"]
            training = fold["training_participant_ids"]
            self.assertNotIn(held_out, training)
            self.assertEqual(len(training), 4)

    def test_predictive_coverage_gate_is_complete_case_free_and_fail_closed(self) -> None:
        perfect = CoverageObservation(
            row_outcome_coverage=1.0,
            learner_outcome_coverage=1.0,
            primary_family_outcome_coverage={family: 1.0 for family in N043_PRIMARY_FAMILIES},
            prediction_coverage_by_lane={lane: 1.0 for lane in N043_MANDATORY_LANES},
        )
        self.assertTrue(evaluate_coverage_gates(perfect).predictive_decision_enabled)

        missing_outcome = CoverageObservation(
            row_outcome_coverage=0.99,
            learner_outcome_coverage=1.0,
            primary_family_outcome_coverage={family: 1.0 for family in N043_PRIMARY_FAMILIES},
            prediction_coverage_by_lane={lane: 1.0 for lane in N043_MANDATORY_LANES},
        )
        outcome_result = evaluate_coverage_gates(missing_outcome)
        self.assertFalse(outcome_result.predictive_decision_enabled)
        self.assertIn("row-outcome-coverage", outcome_result.failures)

        asymmetric_lane = CoverageObservation(
            row_outcome_coverage=1.0,
            learner_outcome_coverage=1.0,
            primary_family_outcome_coverage={family: 1.0 for family in N043_PRIMARY_FAMILIES},
            prediction_coverage_by_lane={
                "b2-native": 1.0,
                "b2-basis-native": 1.0,
                "b3-native": 0.99,
            },
        )
        lane_result = evaluate_coverage_gates(asymmetric_lane)
        self.assertFalse(lane_result.predictive_decision_enabled)
        self.assertIn("prediction-coverage:b3-native", lane_result.failures)
        self.assertIn("between-lane-prediction-coverage-difference", lane_result.failures)

    def test_precision_grid_is_assumption_sensitivity_not_selected_sample_size(self) -> None:
        self.assertEqual(normal_approx_required_learners(0.10, 0.05), 16)
        self.assertEqual(normal_approx_required_learners(0.20, 0.02), 385)
        report = build_n043_design_report()
        self.assertEqual(report["recruitment"]["status"], "predictive-count-unjustified")
        self.assertIsNone(report["recruitment"]["approved_predictive_participant_count"])
        self.assertIsNone(report["precision_sensitivity"]["selected_cell"])
        self.assertFalse(report["disposition"]["predictive_keep_simplify_enabled"])
        self.assertFalse(report["human_outcomes_used"])
        self.assertRegex(report["report_digest"], r"^sha256:[0-9a-f]{64}$")

    def test_design_report_is_deterministic(self) -> None:
        self.assertEqual(build_n043_design_report(), build_n043_design_report())


if __name__ == "__main__":
    unittest.main()
