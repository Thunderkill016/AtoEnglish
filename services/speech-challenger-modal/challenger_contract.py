from __future__ import annotations

import math
import os
import tempfile
import time
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass, field
from importlib.metadata import PackageNotFoundError
from typing import Any, Literal

from fingerprint import compute_model_fingerprint, compute_runtime_fingerprint

# Input size constraints to safeguard ephemeral memory
MAX_AUDIO_BYTES = 5 * 1024 * 1024  # 5 MB limit
MIN_AUDIO_SECONDS = 0.15
MAX_AUDIO_SECONDS = 12.0
SAMPLING_RATE = 16_000

AUDIO_SUFFIX_BY_TYPE: dict[str, str] = {
    "audio/webm": ".webm",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/mpeg": ".mp3",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "audio/aac": ".aac",
}


def _finite_number(
    value: Any,
    *,
    minimum: float | None = None,
    maximum: float | None = None,
) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None

    result = float(value)
    if not math.isfinite(result):
        return None
    if minimum is not None and result < minimum:
        return None
    if maximum is not None and result > maximum:
        return None
    return result


def _summary(values: Any) -> tuple[float | None, float | None]:
    if not isinstance(values, (list, tuple)):
        return None, None

    cleaned = [
        number for value in values if (number := _finite_number(value)) is not None
    ]
    if not cleaned:
        return None, None

    mean = sum(cleaned) / len(cleaned)
    variance = sum((value - mean) ** 2 for value in cleaned) / len(cleaned)
    return mean, math.sqrt(variance)


def _bounded_text(value: Any, limit: int) -> str | None:
    if not isinstance(value, str):
        return None
    normalized = value.strip()
    if not normalized:
        return None
    return normalized[:limit]


@dataclass(frozen=True)
class ModelFingerprint:
    artifact_id: str
    version: str
    sha256: str
    configuration_id: str
    fingerprint_scope: Literal[
        "package-configuration-only",
        "package-configuration-plus-checkpoint-bytes",
        "synthetic-mock-identity",
    ]
    checkpoint_sha256: str | None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class RuntimeFingerprint:
    runtime: str
    python_version: str
    sha256: str
    hardware_tier: str
    packages: dict[str, str]
    code_sha256: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class PhoneAlignment:
    expected: str | None
    heard: str | None
    confidence: float | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "expected": self.expected,
            "heard": self.heard,
            "confidence": self.confidence,
        }


@dataclass(frozen=True)
class WordError:
    word: str
    expected: str | None
    actual: str | None
    confidence: float | None
    phones: list[PhoneAlignment] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "word": self.word,
            "expected": self.expected,
            "actual": self.actual,
            "confidence": self.confidence,
            "phones": [phone.to_dict() for phone in self.phones],
        }


@dataclass(frozen=True)
class ProsodySummary:
    f0_mean: float | None
    f0_std: float | None
    energy_mean: float | None
    energy_std: float | None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class ChallengerDiagnosticResult:
    """Core diagnostic record emitted by any speech challenger.

    Invariants:
    - Never contains raw transcript or text predictions.
    - Never contains raw learner audio, vectors, or embeddings.
    - Never contains a 0-100 score or learner mastery attribution.
    - Contains traceable model and runtime fingerprints.
    """

    provider_name: str
    provider_version: str
    model_fingerprint: ModelFingerprint
    runtime_fingerprint: RuntimeFingerprint
    execution_status: Literal["completed", "unavailable"]
    evaluation_status: Literal["not_evaluated", "synthetic_mock_only"]
    error_code: str | None
    latency_ms: int
    acoustic_distance: float | None
    phoneme_error_rate: float | None
    word_error_rate: float | None
    errors: list[WordError] = field(default_factory=list)
    prosody_summary: ProsodySummary = field(
        default_factory=lambda: ProsodySummary(None, None, None, None)
    )

    def to_dict(self) -> dict[str, Any]:
        return {
            "provider": {
                "name": self.provider_name,
                "version": self.provider_version,
            },
            "model_fingerprint": self.model_fingerprint.to_dict(),
            "runtime_fingerprint": self.runtime_fingerprint.to_dict(),
            "execution_status": self.execution_status,
            "evaluation_status": self.evaluation_status,
            "error_code": self.error_code,
            "latency_ms": self.latency_ms,
            "acoustic_distance": self.acoustic_distance,
            "phoneme_error_rate": self.phoneme_error_rate,
            "word_error_rate": self.word_error_rate,
            "errors": [error.to_dict() for error in self.errors],
            "prosody_summary": self.prosody_summary.to_dict(),
        }


def sanitize_openpronounce_raw(
    raw_result: Any,
    *,
    provider_name: str = "openpronounce",
    provider_version: str = "0.3.0",
    model_fingerprint: ModelFingerprint,
    runtime_fingerprint: RuntimeFingerprint,
    latency_ms: int,
) -> ChallengerDiagnosticResult:
    """Sanitizes raw upstream OpenPronounce output into ChallengerDiagnosticResult.

    Discards:
    - raw transcript ('transcribe': 'TINK')
    - 0-100 scores ('score': 81.3)
    - raw phone vectors ('expected_vector', 'transcribed_vector', etc.)
    - raw feedback prose ('feedback')
    - raw distance totals
    """
    if not isinstance(raw_result, dict):
        return ChallengerDiagnosticResult(
            provider_name=provider_name,
            provider_version=provider_version,
            model_fingerprint=model_fingerprint,
            runtime_fingerprint=runtime_fingerprint,
            execution_status="unavailable",
            evaluation_status="not_evaluated",
            error_code="invalid_raw_result_shape",
            latency_ms=latency_ms,
            acoustic_distance=None,
            phoneme_error_rate=None,
            word_error_rate=None,
        )

    differences = raw_result.get("differences")
    if not isinstance(differences, dict):
        differences = {}

    errors: list[WordError] = []
    raw_errors = differences.get("errors")
    if isinstance(raw_errors, list):
        for raw_err in raw_errors[:16]:
            if not isinstance(raw_err, dict):
                continue
            word = _bounded_text(raw_err.get("word"), 120)
            if not word:
                continue

            phones: list[PhoneAlignment] = []
            raw_phones = raw_err.get("phones")
            if isinstance(raw_phones, list):
                for p in raw_phones[:32]:
                    if not isinstance(p, dict):
                        continue
                    exp = _bounded_text(p.get("expected"), 64)
                    hrd = _bounded_text(p.get("heard"), 64)
                    if exp is None and hrd is None:
                        continue
                    conf = _finite_number(p.get("confidence"), minimum=0.0, maximum=1.0)
                    phones.append(
                        PhoneAlignment(expected=exp, heard=hrd, confidence=conf)
                    )

            errors.append(
                WordError(
                    word=word,
                    expected=_bounded_text(raw_err.get("expected"), 160),
                    actual=_bounded_text(raw_err.get("actual"), 160),
                    confidence=_finite_number(
                        raw_err.get("confidence"), minimum=0.0, maximum=1.0
                    ),
                    phones=phones,
                )
            )

    prosody = raw_result.get("prosody")
    if not isinstance(prosody, dict):
        prosody = {}

    f0_mean, f0_std = _summary(prosody.get("f0"))
    energy_mean, energy_std = _summary(prosody.get("energy"))

    return ChallengerDiagnosticResult(
        provider_name=provider_name,
        provider_version=provider_version,
        model_fingerprint=model_fingerprint,
        runtime_fingerprint=runtime_fingerprint,
        execution_status="completed",
        evaluation_status="not_evaluated",
        error_code=None,
        latency_ms=latency_ms,
        acoustic_distance=_finite_number(
            raw_result.get("acoustic_distance"), minimum=0.0
        ),
        phoneme_error_rate=_finite_number(
            differences.get("phoneme_error_rate"), minimum=0.0
        ),
        word_error_rate=_finite_number(differences.get("word_error_rate"), minimum=0.0),
        errors=errors,
        prosody_summary=ProsodySummary(
            f0_mean=f0_mean,
            f0_std=f0_std,
            energy_mean=energy_mean,
            energy_std=energy_std,
        ),
    )


class SpeechChallengerProvider(ABC):
    """Abstract interface for speech challenger models in Nếp Core.

    Any future model (GOPT, WavLM, fine-tuned Wav2Vec2) must implement this interface.
    The benchmark harness and Nếp Core only interact with this abstraction.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Vendor-neutral identifier for the challenger."""

    @property
    @abstractmethod
    def version(self) -> str:
        """Version string of the challenger package or implementation."""

    @abstractmethod
    def get_model_fingerprint(self) -> ModelFingerprint:
        """Returns model/package identity and explicit checkpoint fingerprint scope."""

    @abstractmethod
    def get_runtime_fingerprint(self) -> RuntimeFingerprint:
        """Returns deterministic runtime environment fingerprint."""

    @abstractmethod
    def analyze(
        self,
        audio_bytes: bytes,
        target_text: str,
        content_type: str = "audio/wav",
    ) -> ChallengerDiagnosticResult:
        """Perform acoustic pronunciation diagnosis on ephemeral audio."""


class OpenPronounceBaselineProvider(SpeechChallengerProvider):
    """Baseline provider wrapping OpenPronounce v0.3.0.

    Ensures audio is written to a temporary location, decoded, analyzed,
    and deleted immediately in a finally block to uphold ephemeral storage.
    """

    def __init__(self, hardware_tier: str = "cpu") -> None:
        self.hardware_tier = hardware_tier
        self._cached_model_fp: ModelFingerprint | None = None
        self._cached_runtime_fp: RuntimeFingerprint | None = None

    @property
    def name(self) -> str:
        return "openpronounce"

    @property
    def version(self) -> str:
        try:
            from importlib.metadata import version

            return version("openpronounce")
        except PackageNotFoundError:
            return "0.3.0"

    def get_model_fingerprint(self) -> ModelFingerprint:
        if self._cached_model_fp is None:
            self._cached_model_fp = compute_model_fingerprint(
                model_name=self.name,
                model_version=self.version,
                extra_config={"tts": "piper", "voice": "en_US-lessac-medium"},
            )
        return self._cached_model_fp

    def get_runtime_fingerprint(self) -> RuntimeFingerprint:
        if self._cached_runtime_fp is None:
            self._cached_runtime_fp = compute_runtime_fingerprint(
                runtime="modal-container",
                hardware_tier=self.hardware_tier,
            )
        return self._cached_runtime_fp

    def analyze(
        self,
        audio_bytes: bytes,
        target_text: str,
        content_type: str = "audio/wav",
    ) -> ChallengerDiagnosticResult:
        started = time.monotonic()
        model_fp = self.get_model_fingerprint()
        runtime_fp = self.get_runtime_fingerprint()

        expected = target_text.strip()
        if not expected or len(expected) > 200:
            return ChallengerDiagnosticResult(
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=model_fp,
                runtime_fingerprint=runtime_fp,
                execution_status="unavailable",
                evaluation_status="not_evaluated",
                error_code="invalid_target_text",
                latency_ms=0,
                acoustic_distance=None,
                phoneme_error_rate=None,
                word_error_rate=None,
            )

        if not audio_bytes or len(audio_bytes) > MAX_AUDIO_BYTES:
            return ChallengerDiagnosticResult(
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=model_fp,
                runtime_fingerprint=runtime_fp,
                execution_status="unavailable",
                evaluation_status="not_evaluated",
                error_code="audio_empty_or_too_large",
                latency_ms=0,
                acoustic_distance=None,
                phoneme_error_rate=None,
                word_error_rate=None,
            )

        normalized_content_type = content_type.split(";")[0].strip().lower()
        suffix = AUDIO_SUFFIX_BY_TYPE.get(normalized_content_type)
        if suffix is None:
            return ChallengerDiagnosticResult(
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=model_fp,
                runtime_fingerprint=runtime_fp,
                execution_status="unavailable",
                evaluation_status="not_evaluated",
                error_code="unsupported_media_type",
                latency_ms=0,
                acoustic_distance=None,
                phoneme_error_rate=None,
                word_error_rate=None,
            )
        temp_path: str | None = None

        try:
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as handle:
                handle.write(audio_bytes)
                temp_path = handle.name

            # Dynamic import of openpronounce dependencies
            import numpy as np
            from openpronounce import compare_audio_with_text, load_audio

            sound = load_audio(temp_path)
            if (
                not isinstance(sound, np.ndarray)
                or sound.ndim != 1
                or sound.size == 0
                or not np.isfinite(sound).all()
            ):
                duration_ms = round((time.monotonic() - started) * 1000)
                return ChallengerDiagnosticResult(
                    provider_name=self.name,
                    provider_version=self.version,
                    model_fingerprint=model_fp,
                    runtime_fingerprint=runtime_fp,
                    execution_status="unavailable",
                    evaluation_status="not_evaluated",
                    error_code="invalid_decoded_audio",
                    latency_ms=duration_ms,
                    acoustic_distance=None,
                    phoneme_error_rate=None,
                    word_error_rate=None,
                )

            duration_seconds = sound.size / SAMPLING_RATE
            if (
                duration_seconds < MIN_AUDIO_SECONDS
                or duration_seconds > MAX_AUDIO_SECONDS
            ):
                duration_ms = round((time.monotonic() - started) * 1000)
                return ChallengerDiagnosticResult(
                    provider_name=self.name,
                    provider_version=self.version,
                    model_fingerprint=model_fp,
                    runtime_fingerprint=runtime_fp,
                    execution_status="unavailable",
                    evaluation_status="not_evaluated",
                    error_code="audio_duration_out_of_bounds",
                    latency_ms=duration_ms,
                    acoustic_distance=None,
                    phoneme_error_rate=None,
                    word_error_rate=None,
                )

            raw_result = compare_audio_with_text(sound, expected, lang="en")
            duration_ms = round((time.monotonic() - started) * 1000)

            return sanitize_openpronounce_raw(
                raw_result,
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=model_fp,
                runtime_fingerprint=runtime_fp,
                latency_ms=duration_ms,
            )
        except Exception as error:  # noqa: BLE001 - provider failures must become unavailable
            duration_ms = round((time.monotonic() - started) * 1000)
            return ChallengerDiagnosticResult(
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=model_fp,
                runtime_fingerprint=runtime_fp,
                execution_status="unavailable",
                evaluation_status="not_evaluated",
                error_code=f"inference_error:{type(error).__name__}",
                latency_ms=duration_ms,
                acoustic_distance=None,
                phoneme_error_rate=None,
                word_error_rate=None,
            )
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)


class MockChallengerProvider(SpeechChallengerProvider):
    """Deterministic synthetic challenger for offline testing and CI gates.

    Does not require PyTorch or weights; emits valid ChallengerDiagnosticResult.
    """

    def __init__(
        self, provider_name: str = "mock-challenger", version: str = "1.0.0"
    ) -> None:
        self._name = provider_name
        self._version = version

    @property
    def name(self) -> str:
        return self._name

    @property
    def version(self) -> str:
        return self._version

    def get_model_fingerprint(self) -> ModelFingerprint:
        return ModelFingerprint(
            artifact_id=f"nep-model-{self.name}",
            version=self.version,
            sha256="0000000000000000000000000000000000000000000000000000000000000000",
            configuration_id="mock-baseline",
            fingerprint_scope="synthetic-mock-identity",
            checkpoint_sha256=None,
        )

    def get_runtime_fingerprint(self) -> RuntimeFingerprint:
        return RuntimeFingerprint(
            runtime="local-mock",
            python_version="3.11",
            sha256="ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            hardware_tier="cpu",
            packages={},
            code_sha256="ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        )

    def analyze(
        self,
        audio_bytes: bytes,
        target_text: str,
        content_type: str = "audio/wav",
    ) -> ChallengerDiagnosticResult:
        started = time.monotonic()
        time.sleep(0.01)  # 10ms simulated latency
        duration_ms = round((time.monotonic() - started) * 1000)

        if not target_text.strip():
            return ChallengerDiagnosticResult(
                provider_name=self.name,
                provider_version=self.version,
                model_fingerprint=self.get_model_fingerprint(),
                runtime_fingerprint=self.get_runtime_fingerprint(),
                execution_status="unavailable",
                evaluation_status="not_evaluated",
                error_code="empty_target_text",
                latency_ms=duration_ms,
                acoustic_distance=None,
                phoneme_error_rate=None,
                word_error_rate=None,
            )

        return ChallengerDiagnosticResult(
            provider_name=self.name,
            provider_version=self.version,
            model_fingerprint=self.get_model_fingerprint(),
            runtime_fingerprint=self.get_runtime_fingerprint(),
            execution_status="completed",
            evaluation_status="synthetic_mock_only",
            error_code=None,
            latency_ms=duration_ms,
            acoustic_distance=3.14,
            phoneme_error_rate=0.05,
            word_error_rate=0.0,
            errors=[
                WordError(
                    word=target_text.strip().split()[0]
                    if target_text.strip()
                    else "sample",
                    expected="θ",
                    actual="t",
                    confidence=0.95,
                    phones=[PhoneAlignment(expected="θ", heard="t", confidence=0.95)],
                )
            ],
            prosody_summary=ProsodySummary(
                f0_mean=140.0,
                f0_std=12.5,
                energy_mean=25.0,
                energy_std=4.2,
            ),
        )
