from __future__ import annotations

import asyncio
from typing import AsyncIterator

from .store import TERMINAL_EVENTS, RunStore, SSEEvent


async def stream_run_events(store: RunStore, run_id: str) -> AsyncIterator[bytes]:
    queue, history, status = await store.subscribe(run_id)
    try:
        for event in history:
            yield event.encode()

        if (
            status in {"completed", "failed"}
            and history
            and history[-1].event in TERMINAL_EVENTS
        ):
            return

        while True:
            event: SSEEvent = await queue.get()
            yield event.encode()
            if event.event in TERMINAL_EVENTS:
                return
    except asyncio.CancelledError:
        raise
    finally:
        await store.unsubscribe(run_id, queue)
