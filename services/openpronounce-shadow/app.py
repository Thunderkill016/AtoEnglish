from __future__ import annotations

import asyncio
import os
import secrets
import tempfile
import time
from contextlib import asynccontextmanager
from importlib.metadata import version
from typing import Any

import numpy as np
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from openpronounce import (
    compare_audio_with_text,
    load_audio,
    transcribe,
    transcribe_phones,
)
from openpronounce.audio import text2speech

from provider_contract import sanitize_openpronounce_result

MAX_AUDIO_BYTES = 5 * 1024 * 1024
MIN_AUDIO_SECONDS = 0.15
MAX_AUDIO_SECONDS = 12.0
SAMPLING_RATE = 16_000
INFERENCE_QUEUE_TIMEOUT_SECONDS = 5.0

AUDIO_SUFFIX_BY_TYPE = {
    "audio/webm": ".webm",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/mpeg": ".mp3",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "audio/aac": ".aac",
}

SERVICE_TOKEN = os.getenv("OPENPRONOUNCE_SERVICE_TOKEN", "").strip()
PROVIDER_VERSION = version("openpronounce")
WARMUP_ENABLED = os.getenv("OPENPRONOUNCE_WARMUP", "0").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
INFERENCE_LOCK = asyncio.Lock()


class InvalidDecodedAudio(ValueError):
    pass


def _normalized_content_type(value: str | None) -> str:
    return (value or "").split(";", 1)[0].strip().lower()


def _require_service_token(authorization: str | None) -> None:
    if not SERVICE_TOKEN:
        return

    scheme, separator, candidate = (authorization or "").partition(" ")
    if (
        separator != " "
        or scheme.lower() != "bearer"
        or not secrets.compare_digest(candidate, SERVICE_TOKEN)
    ):
        raise HTTPException(status_code=401, detail="unauthorized")


def _analyze_file(temp_path: str, expected: str) -> dict[str, Any]:
    sound = load_audio(temp_path)
    if (
        not isinstance(sound, np.ndarray)
        or sound.ndim != 1
        or sound.size == 0
        or not np.isfinite(sound).all()
    ):
        raise InvalidDecodedAudio("invalid_decoded_audio")

    duration_seconds = sound.size / SAMPLING_RATE
    if duration_seconds < MIN_AUDIO_SECONDS:
        raise InvalidDecodedAudio("audio_too_short")
    if duration_seconds > MAX_AUDIO_SECONDS:
        raise InvalidDecodedAudio("audio_too_long")

    result = compare_audio_with_text(sound, expected, lang="en")
    return sanitize_openpronounce_result(
        result,
        provider_version=PROVIDER_VERSION,
    )


@asynccontextmanager
async def lifespan(_: FastAPI):
    if WARMUP_ENABLED:
        # Warm every lazy dependency required by a real request before Uvicorn completes
        # application startup. Piper removes the default runtime dependency on Google TTS;
        # its voice plus both Wav2Vec2 checkpoints are cached on the mounted model volume.
        started = time.monotonic()
        silence = np.zeros(SAMPLING_RATE, dtype=np.float32)
        print("openpronounce_shadow_warmup_started", flush=True)
        await asyncio.to_thread(transcribe, silence, lang="en")
        await asyncio.to_thread(transcribe_phones, silence, lang="en")
        await asyncio.to_thread(text2speech, "think", lang="en")
        duration_ms = round((time.monotonic() - started) * 1000)
        print(
            f"openpronounce_shadow_warmup_ready duration_ms={duration_ms}",
            flush=True,
        )
    yield


app = FastAPI(
    title="AtoEnglish OpenPronounce Shadow",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)


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

    content_type = _normalized_content_type(file.content_type)
    suffix = AUDIO_SUFFIX_BY_TYPE.get(content_type)
    if suffix is None:
        raise HTTPException(status_code=415, detail="unsupported_audio_type")

    try:
        data = await file.read(MAX_AUDIO_BYTES + 1)
    finally:
        await file.close()

    if not data:
        raise HTTPException(status_code=400, detail="empty_audio")
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="audio_too_large")

    temp_path: str | None = None
    lock_acquired = False

    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as handle:
            handle.write(data)
            temp_path = handle.name

        try:
            await asyncio.wait_for(
                INFERENCE_LOCK.acquire(),
                timeout=INFERENCE_QUEUE_TIMEOUT_SECONDS,
            )
            lock_acquired = True
        except TimeoutError:
            raise HTTPException(status_code=503, detail="provider_busy") from None

        started = time.monotonic()
        bounded = await asyncio.to_thread(_analyze_file, temp_path, expected)
        duration_ms = round((time.monotonic() - started) * 1000)
        print(
            f"openpronounce_shadow_analysis_ok duration_ms={duration_ms}",
            flush=True,
        )
        return bounded
    except InvalidDecodedAudio as error:
        raise HTTPException(status_code=400, detail=str(error)) from None
    except HTTPException:
        raise
    except Exception as error:
        # Never include learner audio, expected text, transcript or provider payload in logs.
        print(
            f"openpronounce_shadow_analysis_failed:{type(error).__name__}",
            flush=True,
        )
        raise HTTPException(status_code=500, detail="analysis_failed") from None
    finally:
        if lock_acquired:
            INFERENCE_LOCK.release()
        if temp_path:
            try:
                os.remove(temp_path)
            except FileNotFoundError:
                pass
