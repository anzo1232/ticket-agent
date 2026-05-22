export default function StatCard({ label, value, sub, icon: Icon, color = "#3b82f6", trend }) {
  return (
    <div style={{
      background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "20px 22px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</div>
        {Icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={16} color={color} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{sub}</div>}
      {trend && (
        <div style={{ fontSize: 11, color: trend > 0 ? "#22c55e" : "#ef4444", marginTop: 6 }}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  );
}
