from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from .config import Settings
from .fixtures import load_fallback_board_payload
from .models import RunRequest, StageName
from .store import RunStore, SSEEvent

STAGE_PROGRESS: dict[StageName, int] = {
    "intake": 10,
    "discovery": 25,
    "extraction": 45,
    "normalization": 60,
    "clustering": 75,
    "brief": 90,
    "audio": 97,
}


async def _emit_stage_started(store: RunStore, run_id: str, stage: StageName, message: str) -> None:
    await store.update_stage(run_id, stage=stage, status="running")
    await store.append_event(
        run_id,
        SSEEvent(
            event="run.stage.started",
            data={
                "runId": run_id,
                "stage": stage,
                "message": message,
                "progress": max(STAGE_PROGRESS[stage] - 8, 0),
            },
        ),
    )


async def _emit_stage_completed(
    store: RunStore,
    run_id: str,
    stage: StageName,
    message: str,
    extra: dict[str, Any] | None = None,
) -> None:
    payload: dict[str, Any] = {
        "runId": run_id,
        "stage": stage,
        "message": message,
        "progress": STAGE_PROGRESS[stage],
    }
    if extra:
        payload.update(extra)
    await store.append_event(run_id, SSEEvent(event="run.stage.completed", data=payload))


async def _sleep(delay_seconds: float) -> None:
    if delay_seconds > 0:
        await asyncio.sleep(delay_seconds)


def _load_sources(path: Path) -> list[dict[str, Any]]:
    return json.loads(path.read_text(encoding="utf-8"))


async def execute_run(
    *,
    run_id: str,
    session_id: str,
    request: RunRequest,
    store: RunStore,
    settings: Settings,
) -> None:
    try:
        if "__force_fail__" in request.brief:
            raise RuntimeError("Forced failure keyword triggered explicit hard-fail path")

        payload = load_fallback_board_payload(
            settings.fallback_payload_path,
            request=request,
            session_id=session_id,
            run_id=run_id,
        )
        sources = _load_sources(settings.fallback_sources_path)
        await store.update_mode(run_id, mode="fallback")

        await _emit_stage_started(store, run_id, "intake", "Reading the structured brief.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(store, run_id, "intake", "Structured brief compiled.")

        await _emit_stage_started(store, run_id, "discovery", "Selecting a bounded evidence set.")
        await _sleep(settings.stage_delay_seconds)
        await store.update_selected_source_count(run_id, len(sources))
        await _emit_stage_completed(
            store,
            run_id,
            "discovery",
            f"Selected {len(sources)} public-safe sources from the demo fixture set.",
            {"selectedSourceCount": len(sources)},
        )

        await _emit_stage_started(store, run_id, "extraction", "Collecting source-level evidence from the fixture set.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(
            store,
            run_id,
            "extraction",
            "Source evidence normalized into a reviewable packet.",
            {"selectedSourceCount": len(sources)},
        )

        await _emit_stage_started(store, run_id, "normalization", "Cleaning and stabilizing extracted evidence.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(store, run_id, "normalization", "Normalized the bounded evidence packet.")

        await _emit_stage_started(store, run_id, "clustering", "Grouping recurring creative signals.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(store, run_id, "clustering", "Pattern clusters and overused angles prepared.")

        await _emit_stage_started(store, run_id, "brief", "Composing the board payload and next-test brief.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(store, run_id, "brief", "Board payload is ready for rendering.")

        await _emit_stage_started(store, run_id, "audio", "Finalizing the optional audio recap status.")
        await _sleep(settings.stage_delay_seconds)
        await _emit_stage_completed(store, run_id, "audio", "Audio recap status recorded.")

        await store.complete_run(run_id, board_payload=payload)
        await store.append_event(
            run_id,
            SSEEvent(
                event="run.completed",
                data={
                    "runId": run_id,
                    "status": "completed",
                    "boardPayload": payload,
                },
            ),
        )
    except Exception as exc:
        await store.add_warning(run_id, str(exc))
        await store.fail_run(run_id)
        await store.append_event(
            run_id,
            SSEEvent(
                event="run.failed",
                data={"runId": run_id, "status": "failed", "message": str(exc)},
            ),
        )
