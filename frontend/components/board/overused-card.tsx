import type { Overused } from "@/types/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverusedCard({ item }: { item: Overused }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 18 }}>{item.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{item.reason}</p>
      </CardContent>
    </Card>
  );
}
