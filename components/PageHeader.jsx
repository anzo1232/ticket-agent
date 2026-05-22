export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 28,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
  );
}
