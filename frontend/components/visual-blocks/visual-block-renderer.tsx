import type { VisualBlock } from "@/types/contracts";

export function VisualBlockRenderer({ visualBlocks }: { visualBlocks?: VisualBlock[] }) {
  if (!visualBlocks || visualBlocks.length === 0) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Visual Blocks</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Optional structured visuals rendered from the same payload.</p>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {visualBlocks.map((block) => (
          <article key={block.blockId} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, display: "grid", gap: 10 }}>
            <strong>{block.title ?? block.type}</strong>
            <p style={{ margin: 0, color: "#475569" }}>Structured visual block type: {block.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
