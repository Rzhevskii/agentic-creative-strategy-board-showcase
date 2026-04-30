"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRun } from "@/lib/api/client";
import { streamRunEvents } from "@/lib/sse/stream-run-events";
import { parseBoardPayload } from "@/lib/validation/board-payload";
import type {
  BoardPayload,
  RunCompletedPayload,
  RunFailedPayload,
  RunMode,
  RunStage,
  RunStageEventPayload,
  RunStatus,
} from "@/types/contracts";
import { BoardShell } from "@/components/board/board-shell";
import { RunProgressPanel } from "@/components/progress/run-progress-panel";
import { WarningBanner } from "@/components/board/warning-banner";

type RunWorkspaceProps = {
  runId: string;
};

type ProgressState = {
  stage: RunStage | null;
  message: string;
  progress: number;
  sourceCount?: number;
};

const DEFAULT_PROGRESS: ProgressState = {
  stage: null,
  message: "Waiting for the run to start.",
  progress: 0,
};

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [runStatus, setRunStatus] = useState<RunStatus>("queued");
  const [runMode, setRunMode] = useState<RunMode | null>(null);
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);
  const [boardPayload, setBoardPayload] = useState<BoardPayload | null>(null);
  const [runIssueMessage, setRunIssueMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function primeRun() {
      try {
        const current = await getRun(runId);
        if (cancelled) return;

        setRunStatus(current.status);
        setRunMode(current.mode ?? null);
        setWarningMessages(current.warningMessages ?? []);

        if (current.boardPayload) {
          const parsed = parseBoardPayload(current.boardPayload);
          if (parsed) {
            setBoardPayload(parsed);
            setRunMode(parsed.mode);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setRunIssueMessage(error instanceof Error ? error.message : "Failed to load run.");
        }
      }
    }

    void primeRun();
    return () => {
      cancelled = true;
    };
  }, [runId]);

  useEffect(() => {
    const source = streamRunEvents(runId, {
      onStageStarted: (payload: RunStageEventPayload) => {
        setRunStatus("running");
        setProgress({
          stage: payload.stage,
          message: payload.message ?? `Started ${payload.stage}.`,
          progress: payload.progress ?? 0,
          sourceCount: payload.selectedSourceCount,
        });
      },
      onStageCompleted: (payload: RunStageEventPayload) => {
        setRunStatus("running");
        setProgress({
          stage: payload.stage,
          message: payload.message ?? `Completed ${payload.stage}.`,
          progress: payload.progress ?? 0,
          sourceCount: payload.selectedSourceCount,
        });
      },
      onWarning: (payload) => {
        setWarningMessages((current) => Array.from(new Set([...current, payload.message])));
      },
      onCompleted: (payload: RunCompletedPayload) => {
        setRunStatus("completed");
        setProgress((current) => ({ ...current, progress: 100, message: "Board payload is ready." }));
        const parsed = parseBoardPayload(payload.boardPayload);
        if (parsed) {
          setBoardPayload(parsed);
          setRunMode(parsed.mode);
          setRunIssueMessage(null);
        } else {
          setRunIssueMessage("Run completed, but the final board payload did not validate.");
        }
      },
      onFailed: (payload: RunFailedPayload) => {
        setRunStatus("failed");
        setRunIssueMessage(payload.message);
      },
      onError: () => {
        setWarningMessages((current) =>
          Array.from(new Set([...current, "Event stream disconnected. Refresh the run state manually if needed."]))
        );
      },
    });

    return () => source.close();
  }, [runId]);

  return (
    <main style={{ minHeight: "100vh", padding: "32px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>
              Demo-safe run workspace
            </p>
            <h1 style={{ margin: "8px 0 0 0", fontSize: 32 }}>Run {runId}</h1>
          </div>
          <Link href="/" style={{ color: "#0f172a", textDecoration: "underline" }}>
            Start another run
          </Link>
        </div>

        <RunProgressPanel
          stage={progress.stage}
          message={progress.message}
          progress={progress.progress}
          sourceCount={progress.sourceCount}
        />

        {warningMessages.length > 0 ? (
          <WarningBanner messages={warningMessages} title="Warnings" description="The demo runner completed with bounded fallback behavior." />
        ) : null}

        {runIssueMessage ? (
          <WarningBanner messages={[runIssueMessage]} title="Run issue" description={`Current status: ${runStatus}${runMode ? ` · ${runMode}` : ""}`} />
        ) : null}

        {boardPayload ? <BoardShell payload={boardPayload} /> : null}
      </div>
    </main>
  );
}
