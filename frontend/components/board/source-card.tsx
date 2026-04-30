import type { Source } from "@/types/contracts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveAssetPath } from "@/lib/assets/resolve-asset-path";

export function SourceCard({ source }: { source: Source }) {
  const screenshotPath = resolveAssetPath(source.screenshotPath ?? null);

  return (
    <Card>
      {screenshotPath ? <img alt={source.title} src={screenshotPath} style={{ aspectRatio: "16 / 10", objectFit: "cover", width: "100%", borderTopLeftRadius: 20, borderTopRightRadius: 20 }} /> : null}
      <CardHeader>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge>{source.citationLabel}</Badge>
          <Badge style={{ background: "#f1f5f9" }}>{source.domain}</Badge>
        </div>
        <CardTitle style={{ fontSize: 20 }}>{source.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <a href={source.url} rel="noreferrer" target="_blank" style={{ color: "#0f172a", textDecoration: "underline" }}>
          Open source
        </a>
      </CardContent>
    </Card>
  );
}
