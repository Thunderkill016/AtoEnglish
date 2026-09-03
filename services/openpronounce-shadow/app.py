from __future__ import annotations

import math
import os
import tempfile
from importlib.metadata import version
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from openpronounce import compare_audio_with_text, load_audio

MAX_AUDIO_BYTES = 5 * 1024 * 1024
SERVICE_TOKEN = os.getenv("OPENPRONOUNCE_SERVICE_TOKEN", "").strip()
PROVIDER_VERSION = version("openpronounce")

app = FastAPI(
    title="AtoEnglish OpenPronounce Shadow",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


def _require_service_token(authorization: str | None) -> None:
    if not SERVICE_TOKEN:
        return
    if authorization != f"Bearer {SERVICE_TOKEN}":
        raise HTTPException(status_code=401, detail="unauthorized")


def _finite_number(value: Any) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    result = float(value)
    return result if math.isfinite(result) else None


def _summary(values: Any) -> tuple[float | None, float | None]:
    if not isinstance(values, (list, tuple)):
        return None, None
    cleaned = [
        number
        for value in values
        if (number := _finite_number(value)) is not None
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


def _sanitize_phone(phone: Any) -> dict[str, Any] | None:
    if not isinstance(phone, dict):
        return None
    return {
        "expected": _bounded_text(phone.get("expected"), 64),
        "heard": _bounded_text(phone.get("heard"), 64),
        "confidence": _finite_number(phone.get("confidence")),
    }


def _sanitize_error(error: Any) -> dict[str, Any] | None:
    if not isinstance(error, dict):
        return None
    word = _bounded_text(error.get("word"), 120)
    if not word:
        return None

    phones = error.get("phones")
    sanitized_phones: list[dict[str, Any]] = []
    if isinstance(phones, list):
        for phone in phones[:32]:
            sanitized = _sanitize_phone(phone)
            if sanitized is not None:
                sanitized_phones.append(sanitized)

    return {
        "word": word,
        "expected": _bounded_text(error.get("expected"), 160),
        "actual": _bounded_text(error.get("actual"), 160),
        "confidence": _finite_number(error.get("confidence")),
        "phones": sanitized_phones,
    }


def _sanitize_result(result: Any) -> dict[str, Any]:
    if not isinstance(result, dict):
        raise ValueError("openpronounce returned a non-object result")

    differences = result.get("differences")
    if not isinstance(differences, dict):
        differences = {}

    raw_errors = differences.get("errors")
    errors: list[dict[str, Any]] = []
    if isinstance(raw_errors, list):
        for error in raw_errors[:16]:
            sanitized = _sanitize_error(error)
            if sanitized is not None:
                errors.append(sanitized)

    prosody = result.get("prosody")
    if not isinstance(prosody, dict):
        prosody = {}
    f0_mean, f0_std = _summary(prosody.get("f0"))
    energy_mean, energy_std = _summary(prosody.get("energy"))

    return {
        "provider": {
            "name": "openpronounce",
            "version": PROVIDER_VERSION,
        },
        # Candidate score remains private to the Next.js provider boundary and is not exposed
        # in AtoEnglish's learner-facing shadow observation.
        "candidate_score": _finite_number(result.get("score")),
        "acoustic_distance": _finite_number(result.get("acoustic_distance")),
        "phoneme_error_rate": _finite_number(differences.get("phoneme_error_rate")),
        "word_error_rate": _finite_number(differences.get("word_error_rate")),
        "errors": errors,
        "prosody_summary": {
            "f0_mean": f0_mean,
            "f0_std": f0_std,
            "energy_mean": energy_mean,
            "energy_std": energy_std,
        },
    }


@app.get("/health")
def health() -> dict[str, str]:
    # Intentionally unauthenticated: deployment platforms need a health check that does not know
    # AtoEnglish's service token. This exposes no learner data, model paths or environment values.
    return {
        "status": "ok",
        "provider": "openpronounce",
        "version": PROVIDER_VERSION,
    }


@app.post("/pronunciation")
async def pronunciation(
    file: UploadFile = File(...),
    expected_text: str = Form(...),
    lang: str = Form(default="en"),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    _require_service_token(authorization)

    expected = expected_text.strip()
    if not expected or len(expected) > 200:
        raise HTTPException(status_code=400, detail="invalid_expected_text")
    if lang != "en":
        raise HTTPException(status_code=400, detail="english_only")

    data = await file.read(MAX_AUDIO_BYTES + 1)
    if not data:
        raise HTTPException(status_code=400, detail="empty_audio")
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="audio_too_large")

    suffix = Path(file.filename or "recording.webm").suffix[:12] or ".webm"
    temp_path: str | None = None

    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as handle:
            handle.write(data)
            temp_path = handle.name

        sound = load_audio(temp_path)
        result = compare_audio_with_text(sound, expected, lang="en")
        return _sanitize_result(result)
    except HTTPException:
        raise
    except Exception as error:
        # Never include learner audio/transcript/provider payload in the response.
        print(f"openpronounce_shadow_analysis_failed:{type(error).__name__}", flush=True)
        raise HTTPException(status_code=500, detail="analysis_failed") from None
    finally:
        if temp_path:
            try:
                os.remove(temp_path)
            except FileNotFoundError:
                pass
