import type { PropsWithChildren } from "react";

export function BoardSection({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        {description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
