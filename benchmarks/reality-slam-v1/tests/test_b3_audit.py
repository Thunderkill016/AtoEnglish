from __future__ import annotations

from pathlib import Path
import sys
import unittest

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from audit_b3_compatibility import audit_track  # noqa: E402


class B3CompatibilityAuditTest(unittest.TestCase):
    def test_language_compatibility_does_not_auto_promote_en_es(self) -> None:
        result = audit_track("en_es", 100)
        self.assertTrue(result["ontologyLanguageCompatible"])
        self.assertFalse(result["eligibleForB3"])
        self.assertEqual(result["decision"], "b3-not-applicable-on-slam")
        self.assertEqual(result["mappedRows"], 0)

    def test_non_english_tracks_are_not_eligible_for_english_ontology_v1(self) -> None:
        for track in ("es_en", "fr_en"):
            result = audit_track(track, 10)
            self.assertFalse(result["ontologyLanguageCompatible"])
            self.assertFalse(result["eligibleForB3"])


if __name__ == "__main__":
    unittest.main()
