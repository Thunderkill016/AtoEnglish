from __future__ import annotations

import importlib.util
import json
import os
import sys
import tempfile
import unittest
import wave

sys.path.insert(0, os.path.dirname(__file__))

from challenger_contract import (
    MockChallengerProvider,
    ModelFingerprint,
    OpenPronounceBaselineProvider,
    RuntimeFingerprint,
    SpeechChallengerProvider,
    sanitize_openpronounce_raw,
)
from fingerprint import (
    compute_dataset_fingerprint,
    compute_model_fingerprint,
    compute_runtime_fingerprint,
)


class ChallengerContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.model_fp = ModelFingerprint(
            artifact_id="nep-model-test",
            version="1.0.0",
            sha256="abc123def456",
            configuration_id="cfg-test",
            fingerprint_scope="package-configuration-only",
            checkpoint_sha256=None,
        )
        self.runtime_fp = RuntimeFingerprint(
            runtime="test-runtime",
            python_version="3.11.0",
            sha256="fff000fff000",
            hardware_tier="cpu",
            packages={},
            code_sha256="fff000fff000",
        )

    def test_sanitization_discards_raw_transcripts_scores_and_vectors(self) -> None:
        upstream_raw = {
            "score": 88.5,
            "distance": 1420,
            "acoustic_distance": 5.4,
            "differences": {
                "phoneme_error_rate": 0.12,
                "word_error_rate": 0.0,
                "feedback": "learner struggled with initial consonant",
                "transcribe": "TINK",
                "expected_vector": [0.1, 0.4, 0.8],
                "transcribed_vector": [0.2, 0.5, 0.9],
                "expected_phonemes": ["θ", "ɪ", "ŋ", "k"],
                "transcribed_phonemes": ["t", "ɪ", "ŋ", "k"],
                "errors": [
                    {
                        "word": "think",
                        "expected": "θɪŋk",
                        "actual": "tɪŋk",
                        "confidence": 0.92,
                        "phones": [
                            {"expected": "θ", "heard": "t", "confidence": 0.92},
                            {"expected": "ɪ", "heard": "ɪ", "confidence": 0.0},
                        ],
                    }
                ],
            },
            "feedback": "learner struggled with initial consonant",
            "transcribe": "TINK",
            "prosody": {
                "f0": [120.0, 130.0, 140.0],
                "energy": [15.0, 25.0, 35.0],
            },
        }

        sanitized = sanitize_openpronounce_raw(
            upstream_raw,
            model_fingerprint=self.model_fp,
            runtime_fingerprint=self.runtime_fp,
            latency_ms=145,
        )

        self.assertEqual(sanitized.execution_status, "completed")
        self.assertEqual(sanitized.evaluation_status, "not_evaluated")
        self.assertIsNone(sanitized.error_code)
        self.assertEqual(sanitized.latency_ms, 145)
        self.assertEqual(sanitized.acoustic_distance, 5.4)
        self.assertEqual(sanitized.phoneme_error_rate, 0.12)
        self.assertEqual(sanitized.word_error_rate, 0.0)
        self.assertEqual(len(sanitized.errors), 1)
        self.assertEqual(sanitized.errors[0].word, "think")
        self.assertEqual(sanitized.errors[0].expected, "θɪŋk")
        self.assertEqual(sanitized.errors[0].actual, "tɪŋk")
        self.assertEqual(sanitized.errors[0].confidence, 0.92)

        data = sanitized.to_dict()
        serialized = json.dumps(data, ensure_ascii=False)

        # Strict privacy invariant: forbidden items MUST NOT leak into serialized diagnostic record
        forbidden_strings = [
            "TINK",
            "learner struggled with initial consonant",
            "expected_vector",
            "transcribed_vector",
            "expected_phonemes",
            "transcribed_phonemes",
            "88.5",
            "1420",
            '"score"',
            '"candidate_score"',
        ]
        for forbidden in forbidden_strings:
            self.assertNotIn(
                forbidden,
                serialized,
                f"Forbidden string {forbidden!r} leaked into sanitized diagnostic record!",
            )

    def test_booleans_and_out_of_bounds_rejected(self) -> None:
        raw_bad = {
            "score": True,  # bool should not evaluate as float 1.0
            "acoustic_distance": -5.0,  # negative distance invalid
            "differences": {
                "phoneme_error_rate": -0.5,
                "errors": [
                    {
                        "word": "think",
                        "confidence": 1.5,  # > 1.0 invalid
                        "phones": [{"expected": "θ", "heard": "t", "confidence": -0.2}],
                    }
                ],
            },
        }

        sanitized = sanitize_openpronounce_raw(
            raw_bad,
            model_fingerprint=self.model_fp,
            runtime_fingerprint=self.runtime_fp,
            latency_ms=50,
        )

        self.assertIsNone(sanitized.acoustic_distance)
        self.assertIsNone(sanitized.phoneme_error_rate)
        self.assertEqual(len(sanitized.errors), 1)
        self.assertIsNone(sanitized.errors[0].confidence)
        self.assertIsNone(sanitized.errors[0].phones[0].confidence)

    def test_mock_challenger_polymorphism(self) -> None:
        mock_provider = MockChallengerProvider(
            provider_name="wavlm-challenger", version="0.1.0"
        )
        self.assertIsInstance(mock_provider, SpeechChallengerProvider)
        self.assertEqual(mock_provider.name, "wavlm-challenger")
        self.assertEqual(mock_provider.version, "0.1.0")

        dummy_audio = b"\x00\x00" * 8000
        result = mock_provider.analyze(dummy_audio, target_text="thought")

        self.assertEqual(result.execution_status, "completed")
        self.assertEqual(result.evaluation_status, "synthetic_mock_only")
        self.assertEqual(result.provider_name, "wavlm-challenger")
        self.assertEqual(
            result.model_fingerprint.artifact_id, "nep-model-wavlm-challenger"
        )
        self.assertEqual(result.runtime_fingerprint.runtime, "local-mock")
        self.assertIsNotNone(result.acoustic_distance)
        self.assertIsNotNone(result.phoneme_error_rate)

        # Empty target text fails gracefully without exception
        err_res = mock_provider.analyze(dummy_audio, target_text="   ")
        self.assertEqual(err_res.execution_status, "unavailable")
        self.assertEqual(err_res.error_code, "empty_target_text")

    def test_fingerprint_deterministic_stability(self) -> None:
        rt_fp1 = compute_runtime_fingerprint("modal-container", "cpu")
        rt_fp2 = compute_runtime_fingerprint("modal-container", "cpu")
        self.assertEqual(rt_fp1.sha256, rt_fp2.sha256)
        self.assertEqual(len(rt_fp1.sha256), 64)

        mod_fp1 = compute_model_fingerprint("openpronounce", "0.3.0", {"tts": "piper"})
        mod_fp2 = compute_model_fingerprint("openpronounce", "0.3.0", {"tts": "piper"})
        self.assertEqual(mod_fp1.sha256, mod_fp2.sha256)
        self.assertEqual(len(mod_fp1.sha256), 64)
        self.assertEqual(mod_fp1.fingerprint_scope, "package-configuration-only")
        self.assertIsNone(mod_fp1.checkpoint_sha256)

        ds_fp1 = compute_dataset_fingerprint(b"synthetic_audio_bytes")
        ds_fp2 = compute_dataset_fingerprint(b"synthetic_audio_bytes")
        self.assertEqual(ds_fp1, ds_fp2)

    def test_openpronounce_empty_audio_fails_closed(self) -> None:
        provider = OpenPronounceBaselineProvider(hardware_tier="cpu")
        res = provider.analyze(b"", target_text="think")
        self.assertEqual(res.execution_status, "unavailable")
        self.assertEqual(res.error_code, "audio_empty_or_too_large")

    def test_openpronounce_unsupported_media_is_unavailable(self) -> None:
        provider = OpenPronounceBaselineProvider(hardware_tier="cpu")
        result = provider.analyze(
            b"not-an-audio-payload",
            target_text="think",
            content_type="application/octet-stream",
        )

        self.assertEqual(result.execution_status, "unavailable")
        self.assertEqual(result.evaluation_status, "not_evaluated")
        self.assertEqual(result.error_code, "unsupported_media_type")
        self.assertIsNone(result.phoneme_error_rate)

    def test_runtime_smoke_never_reports_model_quality(self) -> None:
        script_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "scripts", "run-speech-benchmark.py"
        )
        spec = importlib.util.spec_from_file_location("speech_benchmark", script_path)
        self.assertIsNotNone(spec)
        self.assertIsNotNone(spec.loader if spec else None)
        module = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(module)

        for malformed in (
            None,
            {},
            {"execution_status": "completed"},
            {
                "execution_status": "unavailable",
                "evaluation_status": "not_evaluated",
                "phoneme_error_rate": 0,
            },
        ):
            with self.assertRaises((TypeError, ValueError)):
                module.validate_remote_result(malformed)

        with tempfile.TemporaryDirectory() as temp_dir:
            audio_path = os.path.join(temp_dir, "tone.wav")
            with wave.open(audio_path, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(16_000)
                wav_file.writeframes(b"\x00\x00" * 8_000)
            cases = [
                {
                    "case_id": "runtime-only",
                    "target_text": "think",
                    "audio_file": "tone.wav",
                    "fixture_class": "non_speech_synthetic",
                }
            ]
            artifact = module.run_benchmark(cases, temp_dir, "local-mock")
            first_dataset_fingerprint = artifact["dataset_fingerprint"]

            with wave.open(audio_path, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(16_000)
                wav_file.writeframes(b"\x01\x00" * 8_000)
            changed_audio_artifact = module.run_benchmark(cases, temp_dir, "local-mock")

        self.assertEqual(artifact["artifact_class"], "runtime_smoke")
        self.assertEqual(artifact["summary"]["inference_completion_rate"], 1.0)
        self.assertEqual(artifact["summary"]["quality_evaluated_cases"], 0)
        self.assertNotIn("success_rate", artifact["summary"])
        self.assertEqual(
            artifact["records"][0]["evaluation_status"], "synthetic_mock_only"
        )
        self.assertEqual(
            artifact["dataset_manifest"][0]["audio_sha256"],
            artifact["records"][0]["audio_sha256"],
        )
        self.assertNotEqual(
            first_dataset_fingerprint,
            changed_audio_artifact["dataset_fingerprint"],
        )


if __name__ == "__main__":
    unittest.main()
