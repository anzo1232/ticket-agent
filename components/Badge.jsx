const COLORS = {
  green:  { bg: "rgba(34,197,94,0.12)",  text: "#22c55e" },
  red:    { bg: "rgba(239,68,68,0.12)",   text: "#ef4444" },
  blue:   { bg: "rgba(59,130,246,0.12)",  text: "#3b82f6" },
  yellow: { bg: "rgba(234,179,8,0.12)",   text: "#eab308" },
  purple: { bg: "rgba(139,92,246,0.12)",  text: "#8b5cf6" },
  gray:   { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" },
};

export default function Badge({ label, color = "gray" }) {
  const c = COLORS[color] || COLORS.gray;
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      padding: "3px 8px", borderRadius: 6,
    }}>{label}</span>
  );
}
