from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class NoFutureLabelLanguageTest(unittest.TestCase):
    def test_b2_loads_gold_after_predictions(self) -> None:
        text = (ROOT / "scripts" / "run_b2.py").read_text(encoding="utf-8")
        prediction_pos = text.index("token_ids, probabilities = _predict_blind")
        gold_pos = text.index("# Gold is loaded only after all current-split predictions are frozen.")
        self.assertLess(prediction_pos, gold_pos)


if __name__ == "__main__":
    unittest.main()
