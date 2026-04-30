from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


def _env_list(name: str, default: list[str]) -> list[str]:
    value = os.getenv(name)
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    repo_root: Path
    fallback_payload_path: Path
    fallback_sources_path: Path
    stage_delay_seconds: float
    cors_origins: list[str]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    repo_root = Path(__file__).resolve().parents[2]
    fallback_payload_path = Path(
        os.getenv(
            "BACKEND_FALLBACK_PAYLOAD_PATH",
            str(repo_root / "fixtures" / "payloads" / "demo_board_payload.json"),
        )
    )
    fallback_sources_path = Path(
        os.getenv(
            "BACKEND_FALLBACK_SOURCES_PATH",
            str(repo_root / "fixtures" / "sources" / "demo_sources.json"),
        )
    )

    if not fallback_payload_path.exists():
        raise FileNotFoundError(f"Fallback payload fixture not found: {fallback_payload_path}")
    if not fallback_sources_path.exists():
        raise FileNotFoundError(f"Fallback sources fixture not found: {fallback_sources_path}")

    return Settings(
        repo_root=repo_root,
        fallback_payload_path=fallback_payload_path,
        fallback_sources_path=fallback_sources_path,
        stage_delay_seconds=max(float(os.getenv("BACKEND_STAGE_DELAY_MS", "120")) / 1000.0, 0.0),
        cors_origins=_env_list("BACKEND_CORS_ORIGINS", ["*"]),
    )
