import type { RunStage } from "@/types/contracts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const STAGE_LABELS: Record<RunStage, string> = {
  intake: "Intake",
  discovery: "Discovery",
  extraction: "Extraction",
  normalization: "Normalization",
  clustering: "Clustering",
  brief: "Brief",
  audio: "Audio",
};

export function RunProgressPanel({
  stage,
  message,
  progress,
  sourceCount,
}: {
  stage?: RunStage | null;
  message: string;
  progress: number;
  sourceCount?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <Badge>Live pipeline</Badge>
        <CardTitle>Run Progress</CardTitle>
        <CardDescription>Stage labels stay locked to the backend contract.</CardDescription>
      </CardHeader>
      <CardContent style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ fontWeight: 600 }}>{stage ? STAGE_LABELS[stage] : "Queued"}</span>
          <span style={{ color: "#475569" }}>{progress}%</span>
        </div>
        <div style={{ height: 8, overflow: "hidden", borderRadius: 999, background: "#e2e8f0" }}>
          <div style={{ height: "100%", borderRadius: 999, background: "#0f172a", width: `${progress}%` }} />
        </div>
        <Separator />
        <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>{message}</p>
        {typeof sourceCount === "number" ? (
          <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "#64748b" }}>
            {sourceCount} sources selected
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
