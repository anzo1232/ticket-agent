"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { BarChart3, TrendingUp, Percent, Target, Trophy } from "lucide-react";

const CLUBS = [
  { name: "Arsenal FC", color: "#ef4444", winRate: 68, tickets: 142, roi: 340 },
  { name: "Man City", color: "#3b82f6", winRate: 54, tickets: 98, roi: 210 },
  { name: "Chelsea FC", color: "#1d4ed8", winRate: 61, tickets: 87, roi: 280 },
  { name: "Liverpool FC", color: "#dc2626", winRate: 72, tickets: 124, roi: 390 },
  { name: "Tottenham", color: "#94a3b8", winRate: 48, tickets: 64, roi: 160 },
  { name: "Man United", color: "#b91c1c", winRate: 43, tickets: 51, roi: 130 },
];

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 30 days");
  const [clubFilter, setClubFilter] = useState("All");

  const maxTickets = Math.max(...CLUBS.map(c => c.tickets));

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Analytics"
        subtitle="Performance insights across all operations"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <select value={range} onChange={e => setRange(e.target.value)}
              style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
              {DATE_RANGES.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}
              style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
              <option>All Clubs</option>
              {CLUBS.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Tickets Pulled" value={566} icon={Trophy} color="#3b82f6" trend={12} />
        <StatCard label="Ballot Win Rate" value="59%" icon={Percent} color="#22c55e" trend={5} />
        <StatCard label="Average ROI" value="£252" icon={TrendingUp} color="#8b5cf6" trend={8} />
        <StatCard label="Success Rate" value="84%" icon={Target} color="#f97316" trend={-2} />
      </div>

      {/* Club performance */}
      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "24px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Club Performance Overview</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 24 }}>{range}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(clubFilter === "All" ? CLUBS : CLUBS.filter(c => c.name === clubFilter)).map(c => (
            <div key={c.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{c.name}</span>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Win Rate</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.winRate}%</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Tickets</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{c.tickets}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>ROI</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>£{c.roi}</div>
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                <div style={{
                  width: `${(c.tickets / maxTickets) * 100}%`,
                  height: "100%", borderRadius: 3,
                  background: `linear-gradient(90deg, ${c.color}, ${c.color}80)`,
                  transition: "width 0.4s",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly chart (visual bars) */}
      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "24px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 24 }}>Tickets Pulled — Last 6 Months</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {[{ m: "Dec", v: 42 }, { m: "Jan", v: 78 }, { m: "Feb", v: 65 }, { m: "Mar", v: 91 }, { m: "Apr", v: 103 }, { m: "May", v: 88 }].map(({ m, v }) => (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>{v}</div>
              <div style={{
                width: "100%", background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
                borderRadius: "4px 4px 0 0", height: `${(v / 103) * 110}px`,
                opacity: m === "May" ? 1 : 0.6, transition: "all 0.3s",
              }} />
              <div style={{ fontSize: 11, color: "#64748b" }}>{m}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
