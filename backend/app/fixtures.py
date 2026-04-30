from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_fallback_board_payload(
    payload_path: Path,
    *,
    request: Any,
    session_id: str,
    run_id: str,
) -> dict[str, Any]:
    payload = json.loads(payload_path.read_text(encoding="utf-8"))
    payload["sessionId"] = session_id
    payload["runId"] = run_id
    payload["mode"] = "fallback"
    payload.setdefault("input", {})
    payload["input"]["brief"] = request.brief
    payload["input"]["contextUrl"] = request.contextUrl
    payload["input"]["inputImagePath"] = request.inputImagePath
    return payload
