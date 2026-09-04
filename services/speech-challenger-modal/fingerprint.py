from __future__ import annotations

import hashlib
import json
import os
import platform
import sys
from importlib.metadata import PackageNotFoundError
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from challenger_contract import ModelFingerprint, RuntimeFingerprint


def _hash_file(filepath: str) -> str:
    """Compute SHA-256 of a local file in streaming blocks."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def compute_runtime_fingerprint(
    runtime: str = "modal-container",
    hardware_tier: str = "cpu",
) -> RuntimeFingerprint:
    """Compute deterministic fingerprint of the execution environment."""
    from challenger_contract import RuntimeFingerprint

    # Gather invariant environment descriptors
    py_ver = (
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    )
    plat = platform.platform()
    machine = platform.machine()

    # Collect resolved key libraries as run provenance. Resolution alone does not
    # make dependency ranges reproducible.
    pkg_signatures: dict[str, str] = {}
    for pkg in ("openpronounce", "torch", "fastapi", "uvicorn", "numpy", "modal"):
        try:
            from importlib.metadata import version

            pkg_signatures[pkg] = version(pkg)
        except PackageNotFoundError:
            pkg_signatures[pkg] = "not_installed"

    raw_signature = {
        "runtime": runtime,
        "hardware_tier": hardware_tier,
        "python_version": py_ver,
        "platform": plat,
        "machine": machine,
        "packages": sorted(pkg_signatures.items()),
    }

    code_files = [
        __file__,
        os.path.join(os.path.dirname(__file__), "challenger_contract.py"),
    ]
    code_hashes = [
        f"{os.path.basename(path)}:{_hash_file(path)}" for path in code_files
    ]
    code_sha256 = hashlib.sha256(
        ";".join(sorted(code_hashes)).encode("utf-8")
    ).hexdigest()
    raw_signature["code_sha256"] = code_sha256

    digest = hashlib.sha256(
        json.dumps(raw_signature, sort_keys=True).encode("utf-8")
    ).hexdigest()

    return RuntimeFingerprint(
        runtime=runtime,
        python_version=py_ver,
        sha256=digest,
        hardware_tier=hardware_tier,
        packages=dict(sorted(pkg_signatures.items())),
        code_sha256=code_sha256,
    )


def compute_model_fingerprint(
    model_name: str,
    model_version: str,
    extra_config: dict[str, Any] | None = None,
    checkpoint_paths: list[str] | None = None,
) -> ModelFingerprint:
    """Compute deterministic fingerprint of model artifacts and configuration.

    The identity digest always covers package/configuration metadata. A separate
    checkpoint digest is present only when exact checkpoint bytes were resolved.
    """
    from challenger_contract import ModelFingerprint

    config_norm = extra_config or {}
    config_str = json.dumps(config_norm, sort_keys=True)
    config_id = hashlib.sha256(config_str.encode("utf-8")).hexdigest()[:16]

    file_hashes: list[str] = []
    if checkpoint_paths:
        for p in checkpoint_paths:
            if os.path.isfile(p):
                file_hashes.append(f"{os.path.basename(p)}:{_hash_file(p)}")

    seed = f"{model_name}:{model_version}:{config_str}"
    sha256 = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    checkpoint_sha256 = None
    if file_hashes:
        checkpoint_sha256 = hashlib.sha256(
            ";".join(sorted(file_hashes)).encode("utf-8")
        ).hexdigest()

    return ModelFingerprint(
        artifact_id=f"nep-model-{model_name}",
        version=model_version,
        sha256=sha256,
        configuration_id=f"cfg-{config_id}",
        fingerprint_scope=(
            "package-configuration-plus-checkpoint-bytes"
            if checkpoint_sha256
            else "package-configuration-only"
        ),
        checkpoint_sha256=checkpoint_sha256,
    )


def compute_dataset_fingerprint(data: bytes | list[dict[str, Any]]) -> str:
    """Compute SHA-256 for a canonical manifest, including audio hashes."""
    if isinstance(data, bytes):
        return hashlib.sha256(data).hexdigest()
    serialized = json.dumps(data, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()
