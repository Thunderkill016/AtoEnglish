from __future__ import annotations

import math
import secrets
from typing import Any


def check_service_authorization(
    authorization: str | None,
    service_token: str | None,
) -> tuple[bool, int, str]:
    """Validate Bearer service token authorization for provider endpoints.

    Fails closed:
    - If service_token is unset or whitespace-only -> (False, 503, "service_token_unconfigured")
    - If authorization header is missing, not Bearer, or invalid -> (False, 401, "unauthorized")
    - If matching Bearer token -> (True, 200, "authorized")
    """
    cleaned_token = (service_token or "").strip()
    if not cleaned_token:
        return False, 503, "service_token_unconfigured"

    scheme, separator, candidate = (authorization or "").partition(" ")
    if (
        separator != " "
        or scheme.lower() != "bearer"
        or not secrets.compare_digest(candidate, cleaned_token)
    ):
        return False, 401, "unauthorized"

    return True, 200, "authorized"


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

    expected = _bounded_text(phone.get("expected"), 64)
    heard = _bounded_text(phone.get("heard"), 64)
    confidence = _finite_number(
        phone.get("confidence"),
        minimum=0.0,
        maximum=1.0,
    )

    if expected is None and heard is None:
        return None

    return {
        "expected": expected,
        "heard": heard,
        "confidence": confidence,
    }


def _sanitize_error(error: Any) -> dict[str, Any] | None:
    if not isinstance(error, dict):
        return None

    word = _bounded_text(error.get("word"), 120)
    if not word:
        return None

    raw_phones = error.get("phones")
    phones: list[dict[str, Any]] = []
    if isinstance(raw_phones, list):
        for phone in raw_phones[:32]:
            sanitized = _sanitize_phone(phone)
            if sanitized is not None:
                phones.append(sanitized)

    return {
        "word": word,
        "expected": _bounded_text(error.get("expected"), 160),
        "actual": _bounded_text(error.get("actual"), 160),
        "confidence": _finite_number(
            error.get("confidence"),
            minimum=0.0,
            maximum=1.0,
        ),
        "phones": phones,
    }


def sanitize_openpronounce_result(
    result: Any,
    *,
    provider_version: str,
) -> dict[str, Any]:
    """Reduce an OpenPronounce result to AtoEnglish's bounded provider contract.

    This intentionally discards transcription text, raw expected/heard phone vectors,
    frame posteriors, aligned vectors, feedback prose, distance totals and raw prosody
    curves. Only compact diagnostic summaries cross the provider-service boundary.
    """
    if not isinstance(result, dict):
        raise ValueError("openpronounce returned a non-object result")

    differences = result.get("differences")
    if not isinstance(differences, dict):
        differences = {}

    errors: list[dict[str, Any]] = []
    raw_errors = differences.get("errors")
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
            "version": provider_version,
        },
        # Candidate score is retained only inside the server-to-server provider payload.
        # The Next.js boundary intentionally removes it from the AtoEnglish observation.
        "candidate_score": _finite_number(
            result.get("score"),
            minimum=0.0,
            maximum=100.0,
        ),
        "acoustic_distance": _finite_number(
            result.get("acoustic_distance"),
            minimum=0.0,
        ),
        "phoneme_error_rate": _finite_number(
            differences.get("phoneme_error_rate"),
            minimum=0.0,
        ),
        "word_error_rate": _finite_number(
            differences.get("word_error_rate"),
            minimum=0.0,
        ),
        "errors": errors,
        "prosody_summary": {
            "f0_mean": f0_mean,
            "f0_std": f0_std,
            "energy_mean": energy_mean,
            "energy_std": energy_std,
        },
    }
