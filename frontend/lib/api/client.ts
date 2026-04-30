import type { RunCreatedResponse, RunRequest, RunStateResponse } from "@/types/contracts";
import { buildApiUrl } from "./config";

async function getErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as {
        detail?: unknown;
        message?: unknown;
      };

      if (typeof payload.detail === "string" && payload.detail.trim()) {
        return payload.detail;
      }

      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }
    } catch {
      // Fall back to the generic status message below.
    }
  }

  const message = (await response.text()).trim();
  return message || `Request failed with status ${response.status}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Backend returned a non-JSON response.");
  }

  return (await response.json()) as T;
}

export async function createRun(request: RunRequest): Promise<RunCreatedResponse> {
  const response = await fetch(buildApiUrl("/api/runs"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseJson<RunCreatedResponse>(response);
}

export async function getRun(runId: string): Promise<RunStateResponse> {
  const response = await fetch(buildApiUrl(`/api/runs/${runId}`), {
    cache: "no-store",
  });

  return parseJson<RunStateResponse>(response);
}
