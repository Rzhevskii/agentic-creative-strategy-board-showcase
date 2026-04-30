from __future__ import annotations

import time
from typing import cast

from fastapi.testclient import TestClient


def _wait_for_terminal_run_state(
    client: TestClient, run_id: str, *, timeout_seconds: float = 5.0
) -> dict[str, object]:
    deadline = time.monotonic() + timeout_seconds
    while time.monotonic() < deadline:
        response = client.get(f"/api/runs/{run_id}")
        assert response.status_code == 200
        payload = cast(dict[str, object], response.json())
        if payload["status"] in {"completed", "failed"}:
            return payload
        time.sleep(0.01)
    raise AssertionError(f"Run {run_id} did not reach terminal state within timeout")


def test_demo_run_reaches_completed_board_payload(client: TestClient) -> None:
    response = client.post(
        "/api/runs",
        json={
            "brief": "Creative strategy review for a startup founder workflow product.",
            "demoMode": True,
            "contextUrl": "https://example.com/founder-workflow",
            "inputImagePath": None,
        },
    )

    assert response.status_code == 202
    run_id = str(response.json()["runId"])

    run_payload = _wait_for_terminal_run_state(client, run_id)
    assert run_payload["status"] == "completed"
    assert run_payload["mode"] == "fallback"

    board_payload = cast(dict[str, object], run_payload["boardPayload"])
    assert board_payload["runId"] == run_id
    assert board_payload["mode"] == "fallback"
    assert len(cast(list[object], board_payload["sources"])) >= 5
    assert len(cast(list[object], board_payload["patternClusters"])) >= 3
    assert len(cast(list[object], board_payload["opportunities"])) >= 2
    assert len(cast(list[object], board_payload["storyBlocks"])) >= 4
