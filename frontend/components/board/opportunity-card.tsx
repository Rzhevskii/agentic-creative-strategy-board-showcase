import type { Opportunity } from "@/types/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 18 }}>{opportunity.label}</CardTitle>
      </CardHeader>
      <CardContent style={{ display: "grid", gap: 10 }}>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{opportunity.rationale}</p>
        <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.6 }}>
          <strong>Differentiation angle:</strong> {opportunity.differentiationAngle}
        </p>
      </CardContent>
    </Card>
  );
}
