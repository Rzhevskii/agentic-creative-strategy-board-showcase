from __future__ import annotations

import json
from pathlib import Path


def test_demo_payload_has_expected_core_sections() -> None:
    repo_root = Path(__file__).resolve().parents[2]
    payload = json.loads(
        (repo_root / "fixtures" / "payloads" / "demo_board_payload.json").read_text(encoding="utf-8")
    )

    assert payload["mode"] == "fallback"
    assert len(payload["sources"]) >= 5
    assert len(payload["patternClusters"]) >= 3
    assert len(payload["opportunities"]) >= 2
    assert len(payload["storyBlocks"]) >= 4
