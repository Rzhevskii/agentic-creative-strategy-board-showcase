from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


class RunRequest(BaseModel):
    brief: str
    contextUrl: str | None = None
    inputImagePath: str | None = None
    demoMode: bool = False


class RunCreatedResponse(BaseModel):
    sessionId: str
    runId: str
    status: str
    eventStreamUrl: str


app = FastAPI(title="Agentic Creative Strategy Board API Showcase", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/runs", response_model=RunCreatedResponse, status_code=202)
async def create_run(request: RunRequest) -> RunCreatedResponse:
    if not request.brief.strip():
        raise HTTPException(status_code=422, detail="brief must not be empty")

    return RunCreatedResponse(
        sessionId="ses_demo_001",
        runId="run_demo_001",
        status="queued",
        eventStreamUrl="/api/runs/run_demo_001/events",
    )


# Public showcase note:
# The private working project includes a fuller backend with SSE, fallback/live execution,
# image intake, and persistence. This excerpt is included only to make the API shape
# understandable without exposing deployment wiring or operational details.
