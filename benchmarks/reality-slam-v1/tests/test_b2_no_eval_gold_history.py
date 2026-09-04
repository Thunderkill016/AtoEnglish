from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class B2BlindHistoryBoundaryTest(unittest.TestCase):
    def test_predictor_function_has_no_gold_parameter(self) -> None:
        text = (ROOT / "scripts" / "run_b2.py").read_text(encoding="utf-8")
        signature = text[text.index("def _predict_blind("):text.index(") -> tuple[list[str], list[float]]:", text.index("def _predict_blind("))]
        self.assertNotIn("gold", signature)
        self.assertNotIn("labels_by_token", signature)


if __name__ == "__main__":
    unittest.main()
