export default function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: extraStyle }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: 8, transition: "all 0.15s",
    fontSize: size === "sm" ? 12 : 13,
    padding: size === "sm" ? "6px 12px" : "9px 16px",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "#3b82f6", color: "#fff" },
    secondary: { background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" },
    danger: { background: "rgba(239,68,68,0.15)", color: "#ef4444" },
    ghost: { background: "transparent", color: "#64748b" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}
