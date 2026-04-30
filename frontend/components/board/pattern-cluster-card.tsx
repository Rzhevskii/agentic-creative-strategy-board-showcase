import type { PatternCluster } from "@/types/contracts";
import { Badge } from "@/components/ui/badge";

export function PatternClusterCard({ cluster }: { cluster: PatternCluster }) {
  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 20, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge>{cluster.evidenceCount} hits</Badge>
        <Badge>{cluster.evidenceSourceIds.length} sources</Badge>
      </div>
      <h3 style={{ margin: 0, fontSize: 22 }}>{cluster.label}</h3>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{cluster.summary}</p>
    </div>
  );
}
