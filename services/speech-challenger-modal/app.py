from __future__ import annotations

import io
import math
import os
import struct
import wave
from typing import Any

import modal

# Setup Modal App and Persistent Cache Volume
APP_NAME = "nep-speech-challenger"
VOLUME_NAME = "nep-speech-models"

app = modal.App(APP_NAME)
models_volume = modal.Volume.from_name(VOLUME_NAME, create_if_missing=True)

# Build the experiment image. OpenPronounce is pinned; transitive/runtime
# dependency versions are recorded as run provenance and remain partially unlocked.
challenger_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg", "espeak-ng", "ca-certificates")
    .pip_install(
        "torch",
        index_url="https://download.pytorch.org/whl/cpu",
    )
    .pip_install(
        "openpronounce[app,tts-piper]==0.3.0",
        "fastapi>=0.115.0",
        "uvicorn>=0.30.0",
        "numpy>=1.26.0",
        "pydantic>=2.0.0",
    )
    .env(
        {
            "HF_HOME": "/models/huggingface",
            "OPENPRONOUNCE_CACHE_DIR": "/models/huggingface/openpronounce-cache",
            "OPENPRONOUNCE_TTS": "piper",
            "OPENPRONOUNCE_TTS_VOICE": "en_US-lessac-medium",
            "PYTHONDONTWRITEBYTECODE": "1",
            "PYTHONUNBUFFERED": "1",
        }
    )
    .add_local_file(
        os.path.join(os.path.dirname(__file__), "challenger_contract.py"),
        remote_path="/root/challenger_contract.py",
    )
    .add_local_file(
        os.path.join(os.path.dirname(__file__), "fingerprint.py"),
        remote_path="/root/fingerprint.py",
    )
)


@app.cls(
    image=challenger_image,
    volumes={"/models": models_volume},
    cpu=2.0,
    memory=4096,
    timeout=120,
    scaledown_window=60,
)
class OpenPronounceChallengerService:
    """Modal service class hosting the OpenPronounce speech challenger baseline."""

    @modal.enter()
    def setup(self) -> None:
        """Warm up model weights onto persistent volume during container startup."""
        import sys

        if "/root" not in sys.path:
            sys.path.insert(0, "/root")

        from challenger_contract import OpenPronounceBaselineProvider

        self.provider = OpenPronounceBaselineProvider(hardware_tier="cpu-2core-4gb")

        # Create cache directory if needed
        os.makedirs("/models/huggingface/openpronounce-cache", exist_ok=True)

        # Trigger model warmup with a short silence to ensure checkpoints are downloaded & cached
        try:
            import numpy as np
            from openpronounce import transcribe, transcribe_phones
            from openpronounce.audio import text2speech

            silence = np.zeros(16000, dtype=np.float32)
            transcribe(silence, lang="en")
            transcribe_phones(silence, lang="en")
            text2speech("think", lang="en")
            print("Modal Speech Challenger warmed up successfully.", flush=True)
        except Exception as error:
            raise RuntimeError(
                "OpenPronounce warmup failed; service is unavailable"
            ) from error

    @modal.method()
    def analyze(
        self,
        audio_bytes: bytes,
        target_text: str,
        content_type: str = "audio/wav",
    ) -> dict[str, Any]:
        """Execute speech diagnostic observation on ephemeral audio."""
        result = self.provider.analyze(
            audio_bytes=audio_bytes,
            target_text=target_text,
            content_type=content_type,
        )
        return result.to_dict()


def generate_synthetic_pcm_wav(
    duration_sec: float = 1.0, freq_hz: float = 440.0
) -> bytes:
    """Generate a clean synthetic 16kHz mono WAV for testing & smoke."""
    sample_rate = 16000
    num_samples = int(sample_rate * duration_sec)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        frames = bytearray()
        for i in range(num_samples):
            value = int(16000 * math.sin(2.0 * math.pi * freq_hz * i / sample_rate))
            frames.extend(struct.pack("<h", value))
        wav_file.writeframes(frames)
    return buf.getvalue()


@app.local_entrypoint()
def main(target: str = "think", audio_path: str = "") -> None:
    """Local CLI entrypoint for testing via `modal run services/speech-challenger-modal/app.py`."""
    if audio_path and os.path.isfile(audio_path):
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
    else:
        print(
            f"No audio file supplied; generating synthetic 1.0s WAV for target '{target}'..."
        )
        audio_bytes = generate_synthetic_pcm_wav()

    service = OpenPronounceChallengerService()
    print(
        f"Dispatching inference smoke to Modal for target '{target}' ({len(audio_bytes)} bytes)..."
    )
    res = service.analyze.remote(
        audio_bytes=audio_bytes,
        target_text=target,
        content_type="audio/wav",
    )
    print("\n--- Diagnostic Observation Result ---")
    import json

    print(json.dumps(res, indent=2))
