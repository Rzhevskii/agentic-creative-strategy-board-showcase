import { buildApiUrl } from "@/lib/api/config";
import type {
  RunCompletedPayload,
  RunFailedPayload,
  RunStageEventPayload,
  RunWarningPayload,
} from "@/types/contracts";

type StreamHandlers = {
  onOpen?: () => void;
  onStageStarted?: (payload: RunStageEventPayload) => void;
  onStageCompleted?: (payload: RunStageEventPayload) => void;
  onCreated?: (payload: { runId: string; sessionId: string; status: string }) => void;
  onWarning?: (payload: RunWarningPayload) => void;
  onCompleted?: (payload: RunCompletedPayload) => void;
  onFailed?: (payload: RunFailedPayload) => void;
  onError?: (readyState: number) => void;
};

function safeParse<T>(raw: MessageEvent<string>): T | null {
  try {
    return JSON.parse(raw.data) as T;
  } catch {
    return null;
  }
}

export function streamRunEvents(runId: string, handlers: StreamHandlers) {
  const source = new EventSource(buildApiUrl(`/api/runs/${runId}/events`));

  source.onopen = () => {
    handlers.onOpen?.();
  };

  source.addEventListener("run.created", (event) => {
    const payload = safeParse<{ runId: string; sessionId: string; status: string }>(event as MessageEvent<string>);
    if (payload) handlers.onCreated?.(payload);
  });

  source.addEventListener("run.stage.started", (event) => {
    const payload = safeParse<RunStageEventPayload>(event as MessageEvent<string>);
    if (payload) handlers.onStageStarted?.(payload);
  });

  source.addEventListener("run.stage.completed", (event) => {
    const payload = safeParse<RunStageEventPayload>(event as MessageEvent<string>);
    if (payload) handlers.onStageCompleted?.(payload);
  });

  source.addEventListener("run.warning", (event) => {
    const payload = safeParse<RunWarningPayload>(event as MessageEvent<string>);
    if (payload) handlers.onWarning?.(payload);
  });

  source.addEventListener("run.completed", (event) => {
    const payload = safeParse<RunCompletedPayload>(event as MessageEvent<string>);
    if (payload) handlers.onCompleted?.(payload);
    source.close();
  });

  source.addEventListener("run.failed", (event) => {
    const payload = safeParse<RunFailedPayload>(event as MessageEvent<string>);
    if (payload) handlers.onFailed?.(payload);
    source.close();
  });

  source.onerror = () => {
    handlers.onError?.(source.readyState);
  };

  return source;
}
