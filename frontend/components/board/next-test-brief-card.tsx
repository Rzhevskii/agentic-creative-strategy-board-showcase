import type { NextTestBrief } from "@/types/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NextTestBriefCard({ nextTestBrief }: { nextTestBrief: NextTestBrief }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Test Brief</CardTitle>
      </CardHeader>
      <CardContent style={{ display: "grid", gap: 10 }}>
        <p style={{ margin: 0 }}><strong>Audience:</strong> {nextTestBrief.audience}</p>
        <p style={{ margin: 0 }}><strong>Hook:</strong> {nextTestBrief.hook}</p>
        <p style={{ margin: 0 }}><strong>Angle:</strong> {nextTestBrief.angle}</p>
        <p style={{ margin: 0 }}><strong>Visual direction:</strong> {nextTestBrief.visualDirection}</p>
        <p style={{ margin: 0 }}><strong>Copy direction:</strong> {nextTestBrief.copyDirection}</p>
        <p style={{ margin: 0 }}><strong>Why this now:</strong> {nextTestBrief.whyThisNow}</p>
      </CardContent>
    </Card>
  );
}
