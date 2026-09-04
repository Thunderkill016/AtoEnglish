from __future__ import annotations

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ReadmeClaimTest(unittest.TestCase):
    def test_readme_does_not_claim_final_b3_or_efficacy(self) -> None:
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("B3 is intentionally blocked", text)
        self.assertIn("does not prove learning efficacy", text)


if __name__ == "__main__":
    unittest.main()
