from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.metrics import evaluate_by_learner, paired_learner_bootstrap  # noqa: E402


class PairedAlignmentTests(unittest.TestCase):
    def test_missing_control_learner_is_rejected_instead_of_intersected_away(self) -> None:
        target = evaluate_by_learner(
            ["a", "b"],
            [0, 1],
            [0.2, 0.8],
            planned_learner_ids=["a", "b"],
            planned_row_count=2,
        )
        control = evaluate_by_learner(
            ["a"],
            [0],
            [0.3],
            planned_learner_ids=["a", "b"],
            planned_row_count=2,
        )

        with self.assertRaisesRegex(ValueError, "complete-case row selection"):
            paired_learner_bootstrap(target, {"history": control})

    def test_changed_label_budget_is_rejected_even_when_row_counts_match(self) -> None:
        target = evaluate_by_learner(
            ["a", "a", "b", "b"],
            [0, 1, 0, 1],
            [0.2, 0.8, 0.3, 0.7],
            planned_learner_ids=["a", "b"],
            planned_row_count=4,
        )
        control = evaluate_by_learner(
            ["a", "a", "b", "b"],
            [0, 1, 1, 1],
            [0.25, 0.75, 0.6, 0.8],
            planned_learner_ids=["a", "b"],
            planned_row_count=4,
        )

        with self.assertRaisesRegex(ValueError, "identical labels per learner"):
            paired_learner_bootstrap(target, {"basis": control})

    def test_different_frozen_plan_is_rejected_even_if_observed_rows_happen_to_match(self) -> None:
        target = evaluate_by_learner(
            ["a"],
            [0],
            [0.2],
            planned_learner_ids=["a", "missing-a"],
            planned_row_count=2,
        )
        control = evaluate_by_learner(
            ["a"],
            [0],
            [0.3],
            planned_learner_ids=["a", "missing-b"],
            planned_row_count=2,
        )

        with self.assertRaisesRegex(ValueError, "identical planned learners"):
            paired_learner_bootstrap(target, {"history": control})


if __name__ == "__main__":
    unittest.main()
