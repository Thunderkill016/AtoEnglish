from __future__ import annotations

from pathlib import Path
import sys
import unittest

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from run_b2 import ESTIMATOR_ID, FEATURE_SET_ID  # noqa: E402


class B2FeatureContractTest(unittest.TestCase):
    def test_feature_and_estimator_ids_are_versioned(self) -> None:
        self.assertEqual(FEATURE_SET_ID, "nep.slam-b2-history.v1")
        self.assertEqual(ESTIMATOR_ID, "sklearn.SGDClassifier-log_loss-v1")


if __name__ == "__main__":
    unittest.main()
