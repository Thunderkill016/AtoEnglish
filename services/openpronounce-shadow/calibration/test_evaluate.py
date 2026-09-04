from __future__ import annotations

import unittest

from evaluate import CalibrationDataError, evaluate_records, validate_record, wilson_interval


def record(
    clip_id: str,
    speaker_id: str,
    split: str,
    *,
    flagged: bool,
    confidence: float | None,
    rater_a: str,
    rater_b: str,
    adjudicated: str | None = None,
    target_sound_id: str = "th-voiceless",
    target_phone: str = "θ",
) -> dict:
    return {
        "schema_version": 1,
        "clip_id": clip_id,
        "speaker_id": speaker_id,
        "split": split,
        "target_sound_id": target_sound_id,
        "target_phone": target_phone,
        "word": "think",
        "phone_position": "initial",
        "context_key": "θ+ɪ",
        "provider": {
            "version": "0.3.0",
            "flagged": flagged,
            "confidence": confidence,
            "observed_phone": "t" if flagged else None,
        },
        "human": {
            "rater_a": rater_a,
            "rater_b": rater_b,
            "adjudicated": adjudicated,
        },
    }


class CalibrationEvaluatorTests(unittest.TestCase):
    def test_held_out_metrics_and_wilson_intervals(self) -> None:
        rows = [
            record(
                "cal-1",
                "speaker-cal-1",
                "calibration",
                flagged=True,
                confidence=0.9,
                rater_a="clearly_problematic",
                rater_b="clearly_problematic",
            ),
            record(
                "test-tp",
                "speaker-test-1",
                "test",
                flagged=True,
                confidence=0.95,
                rater_a="clearly_problematic",
                rater_b="clearly_problematic",
            ),
            record(
                "test-fp",
                "speaker-test-1",
                "test",
                flagged=True,
                confidence=0.8,
                rater_a="acceptable",
                rater_b="acceptable",
            ),
            record(
                "test-fn",
                "speaker-test-2",
                "test",
                flagged=False,
                confidence=None,
                rater_a="clearly_problematic",
                rater_b="clearly_problematic",
            ),
            record(
                "test-tn",
                "speaker-test-2",
                "test",
                flagged=False,
                confidence=None,
                rater_a="acceptable",
                rater_b="acceptable",
            ),
        ]

        report = evaluate_records(rows, split="test")
        metrics = report["overall"]

        self.assertEqual(metrics["n_clips"], 4)
        self.assertEqual(metrics["n_speakers"], 2)
        self.assertEqual((metrics["tp"], metrics["fp"], metrics["fn"], metrics["tn"]), (1, 1, 1, 1))
        self.assertEqual(metrics["precision"], 0.5)
        self.assertEqual(metrics["recall"], 0.5)
        self.assertEqual(metrics["false_positive_rate"], 0.5)
        self.assertEqual(metrics["false_negative_rate"], 0.5)
        self.assertIsNotNone(metrics["precision_ci95_wilson_clip_level"])
        self.assertIsNotNone(metrics["recall_ci95_wilson_clip_level"])
        self.assertIsNotNone(metrics["precision_ci95_speaker_bootstrap"])
        self.assertIsNotNone(metrics["recall_ci95_speaker_bootstrap"])

    def test_uncertain_and_unresolved_human_labels_are_excluded(self) -> None:
        rows = [
            record(
                "test-uncertain",
                "speaker-test-1",
                "test",
                flagged=True,
                confidence=0.95,
                rater_a="uncertain",
                rater_b="uncertain",
            ),
            record(
                "test-disagree",
                "speaker-test-2",
                "test",
                flagged=True,
                confidence=0.95,
                rater_a="acceptable",
                rater_b="clearly_problematic",
            ),
            record(
                "test-adjudicated",
                "speaker-test-3",
                "test",
                flagged=False,
                confidence=None,
                rater_a="acceptable",
                rater_b="clearly_problematic",
                adjudicated="acceptable",
            ),
        ]

        report = evaluate_records(rows, split="test")

        self.assertEqual(report["excluded_uncertain"], 1)
        self.assertEqual(report["excluded_unresolved"], 1)
        self.assertEqual(report["records_eligible_binary"], 1)
        self.assertEqual(report["overall"]["tn"], 1)

    def test_speaker_leakage_across_calibration_and_test_fails_closed(self) -> None:
        rows = [
            record(
                "cal-1",
                "same-speaker",
                "calibration",
                flagged=False,
                confidence=None,
                rater_a="acceptable",
                rater_b="acceptable",
            ),
            record(
                "test-1",
                "same-speaker",
                "test",
                flagged=False,
                confidence=None,
                rater_a="acceptable",
                rater_b="acceptable",
            ),
        ]

        with self.assertRaisesRegex(CalibrationDataError, "speaker leakage"):
            evaluate_records(rows, split="test")

    def test_confidence_threshold_is_applied_only_to_provider_flags(self) -> None:
        rows = [
            record(
                "test-low-confidence",
                "speaker-test-1",
                "test",
                flagged=True,
                confidence=0.4,
                rater_a="acceptable",
                rater_b="acceptable",
            ),
            record(
                "test-high-confidence",
                "speaker-test-2",
                "test",
                flagged=True,
                confidence=0.92,
                rater_a="clearly_problematic",
                rater_b="clearly_problematic",
            ),
        ]

        report = evaluate_records(rows, split="test", min_confidence=0.8)
        self.assertEqual(report["overall"]["tp"], 1)
        self.assertEqual(report["overall"]["fp"], 0)
        self.assertEqual(report["overall"]["tn"], 1)

    def test_schema_rejects_raw_or_unreviewed_extra_fields(self) -> None:
        row = record(
            "test-1",
            "speaker-test-1",
            "test",
            flagged=False,
            confidence=None,
            rater_a="acceptable",
            rater_b="acceptable",
        )
        row["transcript"] = "raw ASR text must not enter calibration evidence"

        with self.assertRaisesRegex(CalibrationDataError, "unsupported fields"):
            validate_record(row)

    def test_wilson_interval_is_bounded(self) -> None:
        interval = wilson_interval(9, 10)
        self.assertIsNotNone(interval)
        assert interval is not None
        self.assertGreaterEqual(interval[0], 0.0)
        self.assertLessEqual(interval[1], 1.0)
        self.assertLess(interval[0], 0.9)
        self.assertGreater(interval[1], 0.9)
        self.assertIsNone(wilson_interval(0, 0))


if __name__ == "__main__":
    unittest.main()
