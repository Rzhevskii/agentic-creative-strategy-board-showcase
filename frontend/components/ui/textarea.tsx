import type { TextareaHTMLAttributes } from "react";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        minHeight: 120,
        borderRadius: 12,
        border: "1px solid #cbd5e1",
        padding: "10px 12px",
        fontSize: 14,
        resize: "vertical",
        ...(props.style ?? {}),
      }}
    />
  );
}
