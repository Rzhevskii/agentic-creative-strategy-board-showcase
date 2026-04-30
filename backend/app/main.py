from __future__ import annotations

import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .config import get_settings
from .models import HealthResponse, RunCreatedResponse, RunRequest, RunStateResponse
from .orchestrator import execute_run
from .sse import stream_run_events
from .store import InMemoryRunStore, SSEEvent

settings = get_settings()
store = InMemoryRunStore()

app = FastAPI(
    title="Agentic Creative Strategy Board Backend Showcase",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/runs", response_model=RunCreatedResponse, status_code=202)
async def create_run(request: RunRequest) -> RunCreatedResponse:
    if not request.brief.strip():
        raise HTTPException(status_code=422, detail="brief must not be empty")

    initial_mode = "fallback" if request.demoMode else "live"
    run = await store.create_run(
        brief=request.brief,
        context_url=request.contextUrl,
        input_image_path=request.inputImagePath,
        initial_mode=initial_mode,
    )
    await store.append_event(
        run.run_id,
        SSEEvent(
            event="run.created",
            data={
                "runId": run.run_id,
                "sessionId": run.session_id,
                "status": run.status,
            },
        ),
    )
    task = asyncio.create_task(
        execute_run(
            run_id=run.run_id,
            session_id=run.session_id,
            request=request,
            store=store,
            settings=settings,
        )
    )
    await store.set_task(run.run_id, task)
    return RunCreatedResponse(
        sessionId=run.session_id,
        runId=run.run_id,
        status=run.status,
        eventStreamUrl=f"/api/runs/{run.run_id}/events",
    )


@app.get("/api/runs/{run_id}/events")
async def get_run_events(run_id: str) -> StreamingResponse:
    record = await store.get_run(run_id)
    if record is None:
        raise HTTPException(status_code=404, detail="run not found")

    return StreamingResponse(
        stream_run_events(store, run_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/runs/{run_id}", response_model=RunStateResponse)
async def get_run(run_id: str) -> RunStateResponse:
    record = await store.get_run_snapshot(run_id)
    if record is None:
        raise HTTPException(status_code=404, detail="run not found")

    return RunStateResponse(
        runId=record.run_id,
        status=record.status,
        stage=record.stage,
        mode=record.mode,
        warningMessages=record.warnings,
        boardPayload=record.board_payload,
    )
