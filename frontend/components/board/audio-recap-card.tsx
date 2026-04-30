import type { AudioRecap } from "@/types/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AudioRecapCard({ audioRecap }: { audioRecap: AudioRecap }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Recap</CardTitle>
      </CardHeader>
      <CardContent>
        {audioRecap.status === "ready" ? (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: 0 }}>Audio recap asset exists in the full private project path.</p>
            {audioRecap.transcript ? <p style={{ margin: 0, color: "#475569" }}>{audioRecap.transcript}</p> : null}
          </div>
        ) : (
          <p style={{ margin: 0, color: "#475569" }}>Audio recap is currently unavailable in the public showcase payload.</p>
        )}
      </CardContent>
    </Card>
  );
}
