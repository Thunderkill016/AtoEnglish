from __future__ import annotations

import json
import unittest

from provider_contract import sanitize_openpronounce_result


class ProviderContractTests(unittest.TestCase):
    def test_openpronounce_v030_shape_is_bounded(self) -> None:
        # Mirrors the v0.3.0 speech.py + phones.py result shape. Extra raw fields are
        # deliberate: the sanitizer must not forward them.
        upstream = {
            "score": 81.3,
            "distance": 1732,
            "acoustic_distance": 7.2,
            "differences": {
                "word_distance": 1,
                "phoneme_distance": 3.0,
                "word_error_rate": 0.0,
                "phoneme_error_rate": 0.18,
                "feedback": "raw provider feedback",
                "transcribe": "TINK",
                "expected_vector": [1.0, 2.0, 3.0],
                "transcribed_vector": [1.0, 4.0, 3.0],
                "expected_phonemes": ["θ", "ɪ", "ŋ", "k"],
                "transcribed_phonemes": ["t", "ɪ", "ŋ", "k"],
                "expected_phones": [["θ", "ɪ", "ŋ", "k"]],
                "heard_phones": ["t", "ɪ", "ŋ", "k"],
                "heard_phones_confidence": [0.94, 0.99, 0.98, 0.97],
                "words_with_errors": ["think"],
                "errors": [
                    {
                        "position": 0,
                        "word": "think",
                        "expected": "θɪŋk",
                        "actual": "tɪŋk",
                        "actual_word": "",
                        "phone_distance": 1,
                        "confidence": 0.91,
                        "phones": [
                            {"expected": "θ", "heard": "t", "confidence": 0.91},
                            {"expected": "ɪ", "heard": "ɪ", "confidence": 0.0},
                        ],
                    }
                ],
            },
            "feedback": "raw provider feedback",
            "transcribe": "TINK",
            "language": "en",
            "prosody": {
                "f0": [120.0, 130.0, 140.0],
                "energy": [10.0, 20.0, 30.0],
            },
        }

        bounded = sanitize_openpronounce_result(
            upstream,
            provider_version="0.3.0",
        )

        self.assertEqual(
            bounded["provider"],
            {"name": "openpronounce", "version": "0.3.0"},
        )
        self.assertEqual(bounded["candidate_score"], 81.3)
        self.assertEqual(bounded["acoustic_distance"], 7.2)
        self.assertEqual(bounded["phoneme_error_rate"], 0.18)
        self.assertEqual(bounded["word_error_rate"], 0.0)
        self.assertEqual(
            bounded["errors"][0],
            {
                "word": "think",
                "expected": "θɪŋk",
                "actual": "tɪŋk",
                "confidence": 0.91,
                "phones": [
                    {"expected": "θ", "heard": "t", "confidence": 0.91},
                    {"expected": "ɪ", "heard": "ɪ", "confidence": 0.0},
                ],
            },
        )

        serialized = json.dumps(bounded, ensure_ascii=False)
        for forbidden in (
            "TINK",
            "raw provider feedback",
            "expected_vector",
            "transcribed_vector",
            "expected_phones",
            "heard_phones",
            "heard_phones_confidence",
            "actual_word",
            "phone_distance",
            "\"distance\"",
        ):
            self.assertNotIn(forbidden, serialized)

    def test_out_of_range_confidence_and_score_are_not_forwarded(self) -> None:
        bounded = sanitize_openpronounce_result(
            {
                "score": 101,
                "acoustic_distance": -1,
                "differences": {
                    "phoneme_error_rate": -0.1,
                    "word_error_rate": 0.2,
                    "errors": [
                        {
                            "word": "think",
                            "confidence": 4.2,
                            "phones": [
                                {
                                    "expected": "θ",
                                    "heard": "t",
                                    "confidence": -1,
                                }
                            ],
                        }
                    ],
                },
            },
            provider_version="0.3.0",
        )

        self.assertIsNone(bounded["candidate_score"])
        self.assertIsNone(bounded["acoustic_distance"])
        self.assertIsNone(bounded["phoneme_error_rate"])
        self.assertEqual(bounded["word_error_rate"], 0.2)
        self.assertIsNone(bounded["errors"][0]["confidence"])
        self.assertIsNone(bounded["errors"][0]["phones"][0]["confidence"])

    def test_non_object_provider_result_fails_closed(self) -> None:
        with self.assertRaises(ValueError):
            sanitize_openpronounce_result(
                ["not", "a", "provider", "object"],
                provider_version="0.3.0",
            )


if __name__ == "__main__":
    unittest.main()
