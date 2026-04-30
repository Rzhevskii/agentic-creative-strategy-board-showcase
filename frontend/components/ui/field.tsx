import type { HTMLAttributes, LabelHTMLAttributes, PropsWithChildren } from "react";

export function FieldSet({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} style={{ display: "grid", gap: 16, ...style }}>
      {children}
    </div>
  );
}

export function Field({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} style={{ display: "grid", gap: 8, ...style }}>
      {children}
    </div>
  );
}

export function FieldLabel({ children, style, ...props }: PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>) {
  return (
    <label {...props} style={{ fontWeight: 600, ...style }}>
      {children}
    </label>
  );
}

export function FieldDescription({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p {...props} style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.5, ...style }}>
      {children}
    </p>
  );
}

export function FieldMessage({ children, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p {...props} style={{ margin: 0, color: "#b91c1c", fontSize: 14, ...style }}>
      {children}
    </p>
  );
}
