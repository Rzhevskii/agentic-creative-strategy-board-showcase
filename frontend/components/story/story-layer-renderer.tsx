import type { BoardPayload, Source, StoryBlock } from "@/types/contracts";
import { resolveAssetPath } from "@/lib/assets/resolve-asset-path";

function SourceChip({ source }: { source: Source }) {
  return (
    <a href={source.url} rel="noreferrer" target="_blank" style={{ display: "inline-flex", padding: "4px 10px", borderRadius: 999, background: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>
      {source.citationLabel}
    </a>
  );
}

function renderBlock(block: StoryBlock, sourcesById: Map<string, Source>) {
  switch (block.type) {
    case "narrative_text":
      return <p style={{ margin: 0, lineHeight: 1.7, color: "#334155" }}>{block.body}</p>;
    case "screenshot_group":
      return (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {block.items.map((item) => {
            const source = sourcesById.get(item.sourceId);
            const imagePath = resolveAssetPath(item.imagePath ?? source?.screenshotPath ?? null);
            return (
              <div key={item.itemId} style={{ border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", background: "white" }}>
                {imagePath ? <img alt={item.title ?? source?.title ?? "Source visual"} src={imagePath} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} /> : null}
                <div style={{ padding: 14, display: "grid", gap: 8 }}>
                  <strong>{item.title ?? source?.title ?? "Untitled source"}</strong>
                  {item.caption ? <span style={{ color: "#475569", lineHeight: 1.6 }}>{item.caption}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      );
    case "strategy_callout":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <strong>{block.label}</strong>
          <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>{block.body}</p>
        </div>
      );
    case "citation_callout":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <strong>{block.claim}</strong>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {block.supportingSourceIds
              .map((sourceId) => sourcesById.get(sourceId))
              .filter((source): source is Source => Boolean(source))
              .map((source) => (
                <SourceChip key={source.sourceId} source={source} />
              ))}
          </div>
        </div>
      );
    case "image_asset": {
      const imagePath = resolveAssetPath(block.imagePath);
      return (
        <div style={{ display: "grid", gap: 12 }}>
          {imagePath ? <img alt={block.alt} src={imagePath} style={{ width: "100%", borderRadius: 16 }} /> : null}
          {block.caption || block.alt ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{block.caption ?? block.alt}</p> : null}
        </div>
      );
    }
    case "audio_clip":
      return (
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, color: "#475569" }}>Optional audio beat is intentionally lightweight in the public showcase.</p>
          {block.transcript ? <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>{block.transcript}</p> : null}
        </div>
      );
    default:
      return null;
  }
}

const BLOCK_TYPE_LABELS: Record<StoryBlock["type"], string> = {
  narrative_text: "Narrative Text",
  screenshot_group: "Screenshot Group",
  image_asset: "Image Asset",
  audio_clip: "Audio Clip",
  strategy_callout: "Strategy Callout",
  citation_callout: "Citation Callout",
};

export function StoryLayerRenderer({
  storyBlocks,
  sources,
}: {
  storyBlocks: BoardPayload["storyBlocks"];
  sources: BoardPayload["sources"];
}) {
  const sourcesById = new Map(sources.map((source) => [source.sourceId, source]));

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>
          Story Layer
        </p>
        <h2 style={{ margin: 0, fontSize: 28 }}>Interleaved narrative beats</h2>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {storyBlocks.map((block) => (
          <article key={block.blockId} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>{BLOCK_TYPE_LABELS[block.type]}</p>
              {block.title ? <h3 style={{ margin: 0, fontSize: 22 }}>{block.title}</h3> : null}
              {block.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{block.description}</p> : null}
            </div>
            {renderBlock(block, sourcesById)}
          </article>
        ))}
      </div>
    </section>
  );
}
