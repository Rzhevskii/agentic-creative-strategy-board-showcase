import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({ children, style, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      style={{
        border: 0,
        borderRadius: 12,
        background: "#0f172a",
        color: "white",
        padding: "10px 16px",
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
