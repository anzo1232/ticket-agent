export default function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export const inp = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
  padding: "9px 12px", color: "#f1f5f9", fontSize: 13, outline: "none",
  fontFamily: "inherit",
};
