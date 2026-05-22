"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { TrendingUp, TrendingDown, DollarSign, Percent, Filter } from "lucide-react";

const PNL_DATA = [
  {
    id: 1, drop: "Arsenal vs Chelsea", club: "Arsenal FC", date: "7 Jun 2026",
    grossRevenue: 1680, faceValue: 390, platformFees: 168, accountCosts: 80, pullerFees: 120,
    status: "settled",
  },
  {
    id: 2, drop: "Man City vs Real Madrid", club: "Man City", date: "12 Jun 2026",
    grossRevenue: 2520, faceValue: 480, platformFees: 252, accountCosts: 100, pullerFees: 160,
    status: "settled",
  },
  {
    id: 3, drop: "Liverpool vs PSG", club: "Liverpool FC", date: "18 Jun 2026",
    grossRevenue: 1860, faceValue: 450, platformFees: 186, accountCosts: 90, pullerFees: 130,
    status: "partial",
  },
  {
    id: 4, drop: "Tottenham vs Man Utd", club: "Tottenham", date: "9 Jun 2026",
    grossRevenue: 760, faceValue: 220, platformFees: 76, accountCosts: 60, pullerFees: 80,
    status: "settled",
  },
  {
    id: 5, drop: "Chelsea vs Barcelona", club: "Chelsea FC", date: "15 Jun 2026",
    grossRevenue: 0, faceValue: 140, platformFees: 0, accountCosts: 60, pullerFees: 0,
    status: "pending",
  },
];

const CLUBS = ["All", "Arsenal FC", "Man City", "Liverpool FC", "Tottenham", "Chelsea FC"];
const DATE_RANGES = ["All time", "Last 7 days", "Last 30 days", "Last 90 days"];
const STATUS_MAP = { settled: "green", partial: "yellow", pending: "gray" };

export default function PnLPage() {
  const [clubFilter, setClubFilter] = useState("All");
  const [range, setRange] = useState("All time");

  const filtered = PNL_DATA.filter(d => clubFilter === "All" || d.club === clubFilter);

  const calcNet = d => d.grossRevenue - d.faceValue - d.platformFees - d.accountCosts - d.pullerFees;
  const totalGross = filtered.reduce((s, d) => s + d.grossRevenue, 0);
  const totalNet = filtered.reduce((s, d) => s + calcNet(d), 0);
  const totalFees = filtered.reduce((s, d) => s + d.platformFees, 0);
  const avgMargin = totalGross > 0 ? Math.round((totalNet / totalGross) * 100) : 0;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="P&L per Drop"
        subtitle="Profit and loss breakdown by ticket drop"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <select value={range} onChange={e => setRange(e.target.value)}
              style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
              {DATE_RANGES.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}
              style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
              {CLUBS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Gross Revenue" value={`£${totalGross.toLocaleString()}`} icon={DollarSign} color="#3b82f6" />
        <StatCard label="Net Profit" value={`£${totalNet.toLocaleString()}`} icon={TrendingUp} color="#22c55e" trend={12} />
        <StatCard label="Platform Fees" value={`£${totalFees.toLocaleString()}`} icon={TrendingDown} color="#ef4444" />
        <StatCard label="Avg Margin" value={`${avgMargin}%`} icon={Percent} color="#8b5cf6" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(d => {
          const net = calcNet(d);
          const margin = d.grossRevenue > 0 ? Math.round((net / d.grossRevenue) * 100) : 0;
          const isProfit = net > 0;

          return (
            <div key={d.id} style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{d.drop}</h3>
                    <Badge label={d.status.charAt(0).toUpperCase() + d.status.slice(1)} color={STATUS_MAP[d.status]} />
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{d.club} · {d.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: isProfit ? "#22c55e" : "#ef4444" }}>
                    {isProfit ? "+" : ""}£{net.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Net profit · {margin}% margin</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[
                  ["Gross Revenue", d.grossRevenue, "#3b82f6", false],
                  ["Face Value Cost", d.faceValue, "#ef4444", true],
                  ["Platform Fees", d.platformFees, "#ef4444", true],
                  ["Account Costs", d.accountCosts, "#ef4444", true],
                  ["Puller Fees", d.pullerFees, "#ef4444", true],
                ].map(([label, val, color, neg]) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color }}>
                      {neg ? "−" : ""}£{val.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                <div style={{
                  width: `${Math.min(100, Math.max(0, margin))}%`,
                  height: "100%", borderRadius: 3,
                  background: isProfit ? "linear-gradient(90deg, #22c55e, #16a34a)" : "#ef4444",
                  transition: "width 0.4s",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
