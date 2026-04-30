import type { BoardPayload } from "@/types/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BriefSummary({ payload }: { payload: BoardPayload }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brief Summary</CardTitle>
      </CardHeader>
      <CardContent style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{payload.input.brief}</p>
        <p style={{ margin: 0, fontSize: 14, color: "#334155" }}>
          <strong>Target niche:</strong> {payload.input.targetNiche}
        </p>
      </CardContent>
    </Card>
  );
}
