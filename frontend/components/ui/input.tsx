import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: 12,
        border: "1px solid #cbd5e1",
        padding: "10px 12px",
        fontSize: 14,
        ...(props.style ?? {}),
      }}
    />
  );
}
