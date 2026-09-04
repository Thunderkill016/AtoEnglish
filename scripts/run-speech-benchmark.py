#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime
import json
import os
import sys
import time
from typing import Any

# Ensure services directory is available for import
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
SERVICES_DIR = os.path.join(REPO_ROOT, "services", "speech-challenger-modal")
if SERVICES_DIR not in sys.path:
    sys.path.insert(0, SERVICES_DIR)

from challenger_contract import (
    ChallengerDiagnosticResult,
    MockChallengerProvider,
    OpenPronounceBaselineProvider,
    SpeechChallengerProvider,
)
from fingerprint import compute_dataset_fingerprint


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Nếp Speech Challenger Benchmark Harness CLI"
    )
    parser.add_argument(
        "--dataset",
        type=str,
        default=os.path.join(REPO_ROOT, "benchmarks", "fixtures", "sample_cases.jsonl"),
        help="Path to JSONL benchmark dataset",
    )
    parser.add_argument(
        "--mode",
        type=str,
        choices=["local-mock", "local-openpronounce", "modal"],
        default="local-mock",
        help="Execution mode: local-mock (synthetic offline), local-openpronounce, or modal (cloud)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="",
        help="Output JSON run path. Defaults to benchmarks/runs/speech-benchmark-<timestamp>.json",
    )
    return parser.parse_args()


def load_dataset(dataset_path: str) -> list[dict[str, Any]]:
    if not os.path.isfile(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
    cases = []
    with open(dataset_path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            item = json.loads(line)
            if "case_id" not in item:
                item["case_id"] = f"case-{idx:03d}"
            cases.append(item)
    return cases


def run_benchmark(
    cases: list[dict[str, Any]],
    dataset_dir: str,
    mode: str,
) -> dict[str, Any]:
    provider: SpeechChallengerProvider | None = None
    modal_service = None

    if mode == "local-mock":
        provider = MockChallengerProvider()
    elif mode == "local-openpronounce":
        provider = OpenPronounceBaselineProvider(hardware_tier="cpu-local")
    elif mode == "modal":
        try:
            import modal
            modal_service = modal.Cls.lookup("nep-speech-challenger", "OpenPronounceChallengerService")
        except Exception as e:
            raise RuntimeError(
                f"Failed to lookup Modal service 'nep-speech-challenger': {e}. "
                "Ensure Modal token is configured and the app is deployed."
            ) from e

    records: list[dict[str, Any]] = []
    latencies: list[int] = []
    successes = 0

    dataset_fingerprint = compute_dataset_fingerprint(cases)
    start_time_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    for item in cases:
        case_id = item["case_id"]
        target_text = item.get("target_text", "")
        audio_rel_path = item.get("audio_file", "")
        audio_abs_path = os.path.join(dataset_dir, audio_rel_path)

        if not os.path.isfile(audio_abs_path):
            records.append({
                "case_id": case_id,
                "success": False,
                "error": f"audio_file_missing: {audio_rel_path}",
                "latency_ms": 0,
            })
            continue

        with open(audio_abs_path, "rb") as f:
            audio_bytes = f.read()

        t0 = time.monotonic()

        if mode == "modal" and modal_service:
            try:
                # Call Modal remote method
                raw_res = modal_service().analyze.remote(
                    audio_bytes=audio_bytes,
                    target_text=target_text,
                    content_type="audio/wav",
                )
                duration_ms = round((time.monotonic() - t0) * 1000)
                success = raw_res.get("success", False)
                if success:
                    successes += 1
                latencies.append(duration_ms)

                records.append({
                    "case_id": case_id,
                    "target_text": target_text,
                    "success": success,
                    "latency_ms": duration_ms,
                    "model_fingerprint": raw_res.get("model_fingerprint"),
                    "runtime_fingerprint": raw_res.get("runtime_fingerprint"),
                    "acoustic_distance": raw_res.get("acoustic_distance"),
                    "phoneme_error_rate": raw_res.get("phoneme_error_rate"),
                    "word_error_rate": raw_res.get("word_error_rate"),
                    "errors": raw_res.get("errors", []),
                    "prosody_summary": raw_res.get("prosody_summary"),
                })
            except Exception as e:
                duration_ms = round((time.monotonic() - t0) * 1000)
                records.append({
                    "case_id": case_id,
                    "target_text": target_text,
                    "success": False,
                    "error": str(e),
                    "latency_ms": duration_ms,
                })
        else:
            assert provider is not None
            res: ChallengerDiagnosticResult = provider.analyze(
                audio_bytes=audio_bytes,
                target_text=target_text,
                content_type="audio/wav",
            )
            if res.success:
                successes += 1
            latencies.append(res.latency_ms)

            # Strict privacy invariant: extract bounded diagnostics only.
            # Never include raw transcript, raw audio, or 0-100 scores.
            records.append({
                "case_id": case_id,
                "target_text": target_text,
                "success": res.success,
                "error": res.error_code,
                "latency_ms": res.latency_ms,
                "model_fingerprint": res.model_fingerprint.to_dict(),
                "runtime_fingerprint": res.runtime_fingerprint.to_dict(),
                "acoustic_distance": res.acoustic_distance,
                "phoneme_error_rate": res.phoneme_error_rate,
                "word_error_rate": res.word_error_rate,
                "errors": [err.to_dict() for err in res.errors],
                "prosody_summary": res.prosody_summary.to_dict(),
            })

    end_time_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    latencies.sort()
    p50 = latencies[len(latencies) // 2] if latencies else 0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0

    benchmark_artifact = {
        "benchmark_id": "nep-speech-challenger-v1",
        "mode": mode,
        "started_at": start_time_iso,
        "completed_at": end_time_iso,
        "dataset_fingerprint": dataset_fingerprint,
        "summary": {
            "total_cases": len(cases),
            "successful_cases": successes,
            "failed_cases": len(cases) - successes,
            "success_rate": round(successes / len(cases), 4) if cases else 0.0,
            "p50_latency_ms": p50,
            "p95_latency_ms": p95,
        },
        "records": records,
    }

    return benchmark_artifact


def main() -> None:
    args = parse_args()
    cases = load_dataset(args.dataset)
    dataset_dir = os.path.dirname(os.path.abspath(args.dataset))

    print(f"Loaded {len(cases)} cases from {args.dataset}")
    print(f"Running benchmark in mode: {args.mode}")

    result = run_benchmark(cases, dataset_dir, mode=args.mode)

    out_path = args.output
    if not out_path:
        ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        out_path = os.path.join(REPO_ROOT, "benchmarks", "runs", f"speech-benchmark-{ts}.json")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Benchmark completed successfully!")
    print(f"  Artifact saved to: {out_path}")
    print(f"  Cases: {result['summary']['total_cases']}")
    print(f"  Success Rate: {result['summary']['success_rate'] * 100:.1f}%")
    print(f"  Latency p50: {result['summary']['p50_latency_ms']} ms")
    print(f"  Latency p95: {result['summary']['p95_latency_ms']} ms")


if __name__ == "__main__":
    main()
