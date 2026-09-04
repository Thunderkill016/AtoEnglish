from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class RealityScheduleTest(unittest.TestCase):
    def test_readme_unblocks_b0_b1_b2_and_blocks_b3(self) -> None:
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("B0: prevalence baseline", text)
        self.assertIn("B1: exact staged official", text)
        self.assertIn("B2: leakage-safe", text)
        self.assertIn("B3 is intentionally blocked", text)


if __name__ == "__main__":
    unittest.main()
