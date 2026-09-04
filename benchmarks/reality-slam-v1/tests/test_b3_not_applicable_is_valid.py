from pathlib import Path
import sys
import unittest

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
from audit_b3_compatibility import audit_track  # noqa: E402


class B3NotApplicableTest(unittest.TestCase):
    def test_not_applicable_is_explicit_scientific_outcome(self) -> None:
        result = audit_track("en_es", 1)
        self.assertEqual(result["decision"], "b3-not-applicable-on-slam")
        self.assertFalse(result["eligibleForB3"])


if __name__ == "__main__":
    unittest.main()
