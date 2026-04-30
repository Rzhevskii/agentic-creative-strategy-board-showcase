import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WarningBanner({
  title,
  description,
  messages,
}: {
  title: string;
  description?: string;
  messages: string[];
}) {
  return (
    <Card style={{ borderColor: "#fbbf24", background: "#fffbeb" }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p style={{ margin: 0, color: "#92400e" }}>{description}</p> : null}
      </CardHeader>
      <CardContent>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e" }}>
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
