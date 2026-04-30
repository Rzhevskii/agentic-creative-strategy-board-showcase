import type { HTMLAttributes, PropsWithChildren } from "react";

export function Badge({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        background: "#e2e8f0",
        color: "#0f172a",
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
