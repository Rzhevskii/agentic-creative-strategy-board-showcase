from __future__ import annotations

import asyncio
import json
import uuid
from dataclasses import dataclass, field
from typing import Any

from .models import RunMode, RunStatus, StageName

TERMINAL_STATUSES = {"completed", "failed"}
TERMINAL_EVENTS = {"run.completed", "run.failed"}


@dataclass
class SSEEvent:
    event: str
    data: dict[str, Any]

    def encode(self) -> bytes:
        return f"event: {self.event}\ndata: {json.dumps(self.data, ensure_ascii=True)}\n\n".encode(
            "utf-8"
        )


@dataclass
class SessionRecord:
    session_id: str
    brief: str
    context_url: str | None
    input_image_path: str | None
    latest_run_id: str


@dataclass
class RunRecord:
    run_id: str
    session_id: str
    input_image_path: str | None
    status: RunStatus
    mode: RunMode
    stage: StageName | None = None
    selected_source_count: int = 0
    warnings: list[str] = field(default_factory=list)
    board_payload: dict[str, Any] | None = None
    event_history: list[SSEEvent] = field(default_factory=list)
    subscribers: set[asyncio.Queue[SSEEvent]] = field(default_factory=set)
    task: asyncio.Task[None] | None = None


class RunStore:
    async def create_run(
        self,
        *,
        brief: str,
        context_url: str | None,
        input_image_path: str | None,
        initial_mode: RunMode,
    ) -> RunRecord:
        raise NotImplementedError

    async def set_task(self, run_id: str, task: asyncio.Task[None]) -> None:
        raise NotImplementedError

    async def get_run(self, run_id: str) -> RunRecord | None:
        raise NotImplementedError

    async def get_run_snapshot(self, run_id: str) -> RunRecord | None:
        raise NotImplementedError

    async def update_stage(self, run_id: str, *, stage: StageName, status: RunStatus) -> None:
        raise NotImplementedError

    async def update_mode(self, run_id: str, *, mode: RunMode) -> None:
        raise NotImplementedError

    async def update_selected_source_count(self, run_id: str, count: int) -> None:
        raise NotImplementedError

    async def add_warning(self, run_id: str, message: str) -> None:
        raise NotImplementedError

    async def complete_run(self, run_id: str, *, board_payload: dict[str, Any]) -> None:
        raise NotImplementedError

    async def fail_run(self, run_id: str) -> None:
        raise NotImplementedError

    async def append_event(self, run_id: str, event: SSEEvent) -> None:
        raise NotImplementedError

    async def subscribe(
        self, run_id: str
    ) -> tuple[asyncio.Queue[SSEEvent], list[SSEEvent], RunStatus]:
        raise NotImplementedError

    async def unsubscribe(self, run_id: str, queue: asyncio.Queue[SSEEvent]) -> None:
        raise NotImplementedError


class InMemoryRunStore(RunStore):
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._sessions: dict[str, SessionRecord] = {}
        self._runs: dict[str, RunRecord] = {}

    async def create_run(
        self,
        *,
        brief: str,
        context_url: str | None,
        input_image_path: str | None,
        initial_mode: RunMode,
    ) -> RunRecord:
        async with self._lock:
            session_id = f"ses_{uuid.uuid4().hex[:10]}"
            run_id = f"run_{uuid.uuid4().hex[:10]}"
            session = SessionRecord(
                session_id=session_id,
                brief=brief,
                context_url=context_url,
                input_image_path=input_image_path,
                latest_run_id=run_id,
            )
            run = RunRecord(
                run_id=run_id,
                session_id=session_id,
                input_image_path=input_image_path,
                status="queued",
                mode=initial_mode,
            )
            self._sessions[session_id] = session
            self._runs[run_id] = run
            return run

    async def set_task(self, run_id: str, task: asyncio.Task[None]) -> None:
        async with self._lock:
            self._runs[run_id].task = task

    async def get_run(self, run_id: str) -> RunRecord | None:
        async with self._lock:
            return self._runs.get(run_id)

    async def get_run_snapshot(self, run_id: str) -> RunRecord | None:
        async with self._lock:
            record = self._runs.get(run_id)
            if record is None:
                return None
            return RunRecord(
                run_id=record.run_id,
                session_id=record.session_id,
                input_image_path=record.input_image_path,
                status=record.status,
                mode=record.mode,
                stage=record.stage,
                selected_source_count=record.selected_source_count,
                warnings=list(record.warnings),
                board_payload=record.board_payload,
                event_history=list(record.event_history),
            )

    async def update_stage(self, run_id: str, *, stage: StageName, status: RunStatus) -> None:
        async with self._lock:
            record = self._runs[run_id]
            record.stage = stage
            record.status = status

    async def update_mode(self, run_id: str, *, mode: RunMode) -> None:
        async with self._lock:
            self._runs[run_id].mode = mode

    async def update_selected_source_count(self, run_id: str, count: int) -> None:
        async with self._lock:
            self._runs[run_id].selected_source_count = count

    async def add_warning(self, run_id: str, message: str) -> None:
        async with self._lock:
            self._runs[run_id].warnings.append(message)

    async def complete_run(self, run_id: str, *, board_payload: dict[str, Any]) -> None:
        async with self._lock:
            record = self._runs[run_id]
            record.status = "completed"
            record.board_payload = board_payload

    async def fail_run(self, run_id: str) -> None:
        async with self._lock:
            self._runs[run_id].status = "failed"

    async def append_event(self, run_id: str, event: SSEEvent) -> None:
        async with self._lock:
            record = self._runs[run_id]
            record.event_history.append(event)
            subscribers = list(record.subscribers)
        for queue in subscribers:
            queue.put_nowait(event)

    async def subscribe(
        self, run_id: str
    ) -> tuple[asyncio.Queue[SSEEvent], list[SSEEvent], RunStatus]:
        queue: asyncio.Queue[SSEEvent] = asyncio.Queue()
        async with self._lock:
            record = self._runs.get(run_id)
            if record is None:
                raise KeyError(run_id)
            record.subscribers.add(queue)
            history = list(record.event_history)
            status = record.status
        return queue, history, status

    async def unsubscribe(self, run_id: str, queue: asyncio.Queue[SSEEvent]) -> None:
        async with self._lock:
            record = self._runs.get(run_id)
            if record is not None:
                record.subscribers.discard(queue)
