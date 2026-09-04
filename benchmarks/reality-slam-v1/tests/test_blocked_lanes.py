from __future__ import annotations

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class BlockedLaneTest(unittest.TestCase):
    def test_b3_is_explicitly_blocked_until_final_learner_state(self) -> None:
        text = (ROOT / "scripts" / "run_b3.py").read_text(encoding="utf-8")
        self.assertIn("PR #140", text)
        self.assertIn("rebased", text)

    def test_b4_refuses_invented_skill_mapping(self) -> None:
        text = (ROOT / "scripts" / "run_b4.py").read_text(encoding="utf-8")
        self.assertIn("reviewed skill partition", text)
        self.assertIn("Do not force SLAM token rows into BKT semantics", text)


if __name__ == "__main__":
    unittest.main()
