"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import { TicketCheck, DollarSign, TrendingUp, Package, Plus, Filter } from "lucide-react";

const MOCK_TICKETS = [
  { id: 1, match: "Arsenal vs Chelsea", club: "Arsenal FC", member: "James Harrison", account: "james.h@gmail.com", faceValue: 65, listedPrice: 280, platform: "StubHub", status: "listed", profit: 215 },
  { id: 2, match: "Arsenal vs Chelsea", club: "Arsenal FC", member: "Emma Thompson", account: "emma.t@gmail.com", faceValue: 65, listedPrice: 280, platform: "Viagogo", status: "sold", profit: 215 },
  { id: 3, match: "Man City vs Real Madrid", club: "Man City", member: "Sophie Clarke", account: "sophie.c@gmail.com", faceValue: 80, listedPrice: 420, platform: "StubHub", status: "sold", profit: 340 },
  { id: 4, match: "Liverpool vs PSG", club: "Liverpool FC", member: "Emma Thompson", account: "emma.t@gmail.com", faceValue: 75, listedPrice: 0, platform: "—", status: "held", profit: 0 },
  { id: 5, match: "Man City vs Real Madrid", club: "Man City", member: "Chloe Watson", account: "chloe.w@gmail.com", faceValue: 80, listedPrice: 380, platform: "Viagogo", status: "listed", profit: 300 },
  { id: 6, match: "Tottenham vs Man Utd", club: "Tottenham", member: "Olivia Barnes", account: "olivia.b@gmail.com", faceValue: 55, listedPrice: 190, platform: "StubHub", status: "sold", profit: 135 },
  { id: 7, match: "Chelsea vs Barcelona", club: "Chelsea FC", member: "James Harrison", account: "james.h@gmail.com", faceValue: 70, listedPrice: 0, platform: "—", status: "held", profit: 0 },
  { id: 8, match: "Liverpool vs PSG", club: "Liverpool FC", member: "Chloe Watson", account: "chloe.w@gmail.com", faceValue: 75, listedPrice: 310, platform: "StubHub", status: "listed", profit: 235 },
];

const STATUS_MAP = {
  held:   { label: "Held",   color: "gray" },
  listed: { label: "Listed", color: "blue" },
  sold:   { label: "Sold",   color: "green" },
};

const PLATFORM_COLOR = { StubHub: "#22c55e", Viagogo: "#8b5cf6", "—": "#334155" };

export default function TicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [clubFilter, setClubFilter] = useState("All");

  useEffect(() => {
    supabase.from("tickets").select("*").then(({ data }) => {
      if (data?.length) setTickets(data);
    });
  }, []);

  const filtered = tickets.filter(t => {
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchClub = clubFilter === "All" || t.club === clubFilter;
    return matchStatus && matchClub;
  });

  const held   = tickets.filter(t => t.status === "held").length;
  const listed = tickets.filter(t => t.status === "listed").length;
  const sold   = tickets.filter(t => t.status === "sold").length;
  const totalProfit = tickets.filter(t => t.status === "sold").reduce((s, t) => s + t.profit, 0);
  const clubs = ["All", ...new Set(tickets.map(t => t.club))];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Ticket Tracker"
        subtitle="All tickets won or pulled across operations"
        actions={<Btn size="sm"><Plus size={13} /> Log Ticket</Btn>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Held" value={held} icon={Package} color="#64748b" sub="Not yet listed" />
        <StatCard label="Listed" value={listed} icon={TicketCheck} color="#3b82f6" sub="On market" />
        <StatCard label="Sold" value={sold} icon={DollarSign} color="#22c55e" />
        <StatCard label="Total Profit" value={`£${totalProfit}`} icon={TrendingUp} color="#8b5cf6" trend={14} />
      </div>

      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {/* Filters */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
          <Filter size={13} color="#64748b" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
            <option value="All">All Statuses</option>
            <option value="held">Held</option>
            <option value="listed">Listed</option>
            <option value="sold">Sold</option>
          </select>
          <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
            {clubs.map(c => <option key={c}>{c}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>{filtered.length} tickets</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Match", "Club", "Member Account", "Face Value", "Listed Price", "Platform", "Status", "Profit"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const s = STATUS_MAP[t.status];
              return (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{t.match}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{t.club}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#f1f5f9" }}>{t.member}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{t.account}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>£{t.faceValue}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: t.listedPrice ? "#f1f5f9" : "#334155" }}>
                    {t.listedPrice ? `£${t.listedPrice}` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: PLATFORM_COLOR[t.platform] || "#94a3b8" }}>{t.platform}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge label={s.label} color={s.color} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.profit > 0 ? "#22c55e" : "#64748b" }}>
                      {t.profit > 0 ? `£${t.profit}` : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
