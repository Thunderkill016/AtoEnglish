from __future__ import annotations

from pathlib import Path
import sys
import unittest

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.preprocessing import fit_feature_transform  # noqa: E402


class AvailabilityMaskTests(unittest.TestCase):
    def test_train_complete_numeric_still_retains_missing_indicator_for_future_unknown(self) -> None:
        train = [
            {"prior_success_rate": 0.0},
            {"prior_success_rate": 0.5},
            {"prior_success_rate": 1.0},
        ]
        transform = fit_feature_transform(train, categorical_domains={})

        missing_name = "missing:prior_success_rate"
        self.assertIn(missing_name, transform.retained_columns)
        self.assertNotIn(missing_name, transform.dropped_constant_columns)

        mean_observation = transform.transform([{"prior_success_rate": 0.5}])
        missing_observation = transform.transform([{"prior_success_rate": None}])
        missing_index = transform.retained_columns.index(missing_name)

        self.assertEqual(mean_observation[0, missing_index], 0.0)
        self.assertEqual(missing_observation[0, missing_index], 1.0)
        self.assertFalse(np.array_equal(mean_observation, missing_observation))

    def test_availability_masks_are_not_pruned_as_exact_duplicates(self) -> None:
        train = [
            {"feature_a": 0.0, "feature_b": 1.0},
            {"feature_a": 1.0, "feature_b": 2.0},
            {"feature_a": 2.0, "feature_b": 3.0},
        ]
        transform = fit_feature_transform(train, categorical_domains={})

        self.assertIn("missing:feature_a", transform.retained_columns)
        self.assertIn("missing:feature_b", transform.retained_columns)
        dropped = dict(transform.dropped_duplicate_columns)
        self.assertNotIn("missing:feature_a", dropped)
        self.assertNotIn("missing:feature_b", dropped)


if __name__ == "__main__":
    unittest.main()
