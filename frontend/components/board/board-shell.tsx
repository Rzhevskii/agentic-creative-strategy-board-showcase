"use client";

import type { BoardPayload } from "@/types/contracts";
import { AudioRecapCard } from "./audio-recap-card";
import { BriefSummary } from "./brief-summary";
import { BoardSection } from "./board-section";
import { NextTestBriefCard } from "./next-test-brief-card";
import { OpportunityCard } from "./opportunity-card";
import { OverusedCard } from "./overused-card";
import { PatternClusterCard } from "./pattern-cluster-card";
import { SourceCard } from "./source-card";
import { StoryLayerRenderer } from "@/components/story/story-layer-renderer";
import { VisualBlockRenderer } from "@/components/visual-blocks/visual-block-renderer";

export function BoardShell({ payload }: { payload: BoardPayload }) {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      <StoryLayerRenderer sources={payload.sources} storyBlocks={payload.storyBlocks} />

      <div style={{ display: "grid", gap: 32 }}>
        <BriefSummary payload={payload} />

        <BoardSection title="Sources" description="Every major conclusion stays traceable to visible evidence and explicit grounding.">
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {payload.sources.map((source) => (
              <SourceCard key={source.sourceId} source={source} />
            ))}
          </div>
        </BoardSection>

        <BoardSection title="Pattern Clusters" description="Recurring market structures observed across the bounded evidence set.">
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {payload.patternClusters.map((cluster) => (
              <PatternClusterCard key={cluster.clusterId} cluster={cluster} />
            ))}
          </div>
        </BoardSection>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <BoardSection title="Overused" description="Signals that are now common enough to weaken differentiation.">
            <div style={{ display: "grid", gap: 16 }}>
              {payload.overused.map((item) => (
                <OverusedCard key={item.label} item={item} />
              ))}
            </div>
          </BoardSection>

          <BoardSection title="Opportunities" description="Openings that connect market evidence to the user’s actual launch context.">
            <div style={{ display: "grid", gap: 16 }}>
              {payload.opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.label} opportunity={opportunity} />
              ))}
            </div>
          </BoardSection>
        </div>

        <NextTestBriefCard nextTestBrief={payload.nextTestBrief} />
        <AudioRecapCard audioRecap={payload.audioRecap} />
        <VisualBlockRenderer visualBlocks={payload.visualBlocks} />
      </div>
    </div>
  );
}
