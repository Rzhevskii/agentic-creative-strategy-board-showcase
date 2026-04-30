import type { HTMLAttributes, PropsWithChildren } from "react";

function baseStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    ...extra,
  };
}

export function Card({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} style={baseStyle({ padding: 0, ...style })}>
      {children}
    </div>
  );
}

export function CardHeader({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} style={{ padding: 20, display: "grid", gap: 8, ...style }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3 {...props} style={{ margin: 0, fontSize: 24, lineHeight: 1.2, ...style }}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p {...props} style={{ margin: 0, color: "#475569", lineHeight: 1.6, ...style }}>
      {children}
    </p>
  );
}

export function CardContent({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} style={{ padding: 20, ...style }}>
      {children}
    </div>
  );
}
