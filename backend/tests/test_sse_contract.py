from __future__ import annotations

import json
import time
from typing import cast

from fastapi.testclient import TestClient


def _create_run(client: TestClient, brief: str = "SSE contract test run.") -> str:
    response = client.post("/api/runs", json={"brief": brief, "demoMode": True})
    assert response.status_code == 202
    return cast(str, response.json()["runId"])


def _wait_terminal(client: TestClient, run_id: str, timeout: float = 5.0) -> dict[str, object]:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        response = client.get(f"/api/runs/{run_id}")
        assert response.status_code == 200
        body = cast(dict[str, object], response.json())
        if body["status"] in {"completed", "failed"}:
            return body
        time.sleep(0.01)
    raise AssertionError(f"Run {run_id} did not reach terminal state within {timeout}s")


def _parse_sse(chunks: list[str]) -> list[dict[str, object]]:
    content = "".join(chunks)
    parsed: list[dict[str, object]] = []
    for raw in content.split("\n\n"):
        raw = raw.strip()
        if not raw:
            continue
        name = None
        data = None
        for line in raw.splitlines():
            if line.startswith("event: "):
                name = line.removeprefix("event: ")
            elif line.startswith("data: "):
                data = json.loads(line.removeprefix("data: "))
        if name is not None and data is not None:
            parsed.append({"event": name, "data": data})
    return parsed


def test_sse_contract_streams_created_stage_and_completed_events(client: TestClient) -> None:
    run_id = _create_run(client)
    _wait_terminal(client, run_id)

    with client.stream("GET", f"/api/runs/{run_id}/events") as response:
        assert response.status_code == 200
        chunks = [line for line in response.iter_text()]

    events = _parse_sse(chunks)
    event_names = [cast(str, event["event"]) for event in events]

    assert event_names[0] == "run.created"
    assert "run.stage.started" in event_names
    assert "run.stage.completed" in event_names
    assert event_names[-1] == "run.completed"
