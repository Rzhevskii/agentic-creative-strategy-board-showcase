"use client";

import { useEffect, useState } from "react";
import type { BoardPayload } from "./contracts";

export function BoardShell({ payload }: { payload: BoardPayload }) {
  const [activeSourceIds, setActiveSourceIds] = useState<string[]>([]);

  useEffect(() => {
    setActiveSourceIds([]);
  }, [payload.runId]);

  function handleSelectSources(sourceIds: string[]) {
    setActiveSourceIds(sourceIds);
  }

  return (
    <div>
      <section>
        <h2>Story Layer</h2>
        <p>Rendered from story blocks before the fixed evidence board.</p>
      </section>

      <section>
        <h2>Sources</h2>
        <ul>
          {payload.sources.map((source) => (
            <li key={source.sourceId}>
              <a href={source.url} rel="noreferrer" target="_blank">
                {source.citationLabel} · {source.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pattern Clusters</h2>
        <ul>
          {payload.patternClusters.map((cluster) => (
            <li key={cluster.clusterId}>
              <strong>{cluster.label}</strong>: {cluster.summary}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Next Test Brief</h2>
        <p>{payload.nextTestBrief.hook}</p>
        <button onClick={() => handleSelectSources(payload.opportunities[0]?.evidenceSourceIds ?? [])} type="button">
          Highlight supporting evidence
        </button>
        <div>Highlighted sources: {activeSourceIds.join(", ") || "none"}</div>
      </section>
    </div>
  );
}
