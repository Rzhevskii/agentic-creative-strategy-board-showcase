type DemoModeToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function DemoModeToggle({ checked, onCheckedChange }: DemoModeToggleProps) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
      <span>Use deterministic demo mode</span>
    </label>
  );
}
