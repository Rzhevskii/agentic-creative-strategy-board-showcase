from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict


RunStatus = Literal["queued", "running", "completed", "failed"]
RunMode = Literal["live", "fallback"]
StageName = Literal[
    "intake", "discovery", "extraction", "normalization", "clustering", "brief", "audio"
]

STAGE_ORDER: list[StageName] = [
    "intake",
    "discovery",
    "extraction",
    "normalization",
    "clustering",
    "brief",
    "audio",
]


class RunRequest(BaseModel):
    brief: str
    contextUrl: Optional[str] = None
    inputImagePath: Optional[str] = None
    demoMode: bool = False

    model_config = ConfigDict(extra="forbid")


class RunCreatedResponse(BaseModel):
    sessionId: str
    runId: str
    status: RunStatus
    eventStreamUrl: str


class RunStateResponse(BaseModel):
    runId: str
    status: RunStatus
    stage: Optional[StageName] = None
    mode: Optional[RunMode] = None
    warningMessages: list[str] = []
    boardPayload: Optional[dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: Literal["ok"]


class SSEEventEnvelope(BaseModel):
    event: str
    data: dict[str, Any]
