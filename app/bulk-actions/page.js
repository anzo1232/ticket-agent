"use client";
import { useState } from "react";
import Btn from "@/components/Btn";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { Vote, Ticket, RotateCw, Mail, Edit, ToggleLeft, Search, CheckSquare } from "lucide-react";

const MEMBERS = [
  { id: 1, name: "James Harrison", club: "Arsenal FC", status: "eligible", points: 28 },
  { id: 2, name: "Sophie Clarke", club: "Man City", status: "eligible", points: 22 },
  { id: 3, name: "Ryan Mitchell", club: "Chelsea FC", status: "inactive", points: 9 },
  { id: 4, name: "Emma Thompson", club: "Liverpool FC", status: "eligible", points: 35 },
  { id: 5, name: "Daniel Ford", club: "Arsenal FC", status: "do_not_use", points: 14 },
  { id: 6, name: "Olivia Barnes", club: "Tottenham", status: "eligible", points: 18 },
  { id: 7, name: "Marcus Reid", club: "Man United", status: "inactive", points: 7 },
  { id: 8, name: "Chloe Watson", club: "Man City", status: "eligible", points: 41 },
];

const ACTIONS = [
  { id: "ballot", label: "Bulk Ballot Entry", icon: Vote, color: "#3b82f6", desc: "Enter all selected into a ballot" },
  { id: "ticket", label: "Bulk Ticket Request", icon: Ticket, color: "#22c55e", desc: "Submit ticket requests for selected" },
  { id: "renew", label: "Bulk Membership Renewal", icon: RotateCw, color: "#f97316", desc: "Renew memberships in bulk" },
  { id: "email", label: "Bulk Email Send", icon: Mail, color: "#8b5cf6", desc: "Send email to all selected" },
  { id: "update", label: "Bulk Update Details", icon: Edit, color: "#eab308", desc: "Update member details" },
  { id: "status", label: "Bulk Status Change", icon: ToggleLeft, color: "#ec4899", desc: "Change status for all selected" },
];

const STATUS_MAP = { eligible: "green", inactive: "gray", do_not_use: "red" };

export default function BulkActionsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [activeAction, setActiveAction] = useState(null);

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(m => m.id));

  const filtered = MEMBERS.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.club.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Bulk Actions Manager" subtitle={selected.length ? `${selected.length} members selected` : "Select members to perform bulk actions"} />

      {/* Action cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
        {ACTIONS.map(a => (
          <button key={a.id} onClick={() => setActiveAction(activeAction === a.id ? null : a.id)}
            style={{
              background: activeAction === a.id ? `${a.color}15` : "#1a1d27",
              border: `1px solid ${activeAction === a.id ? a.color + "40" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, padding: "16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <a.icon size={15} color={a.color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{a.label}</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Action banner */}
      {activeAction && (
        <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>
            {ACTIONS.find(a => a.id === activeAction)?.label} — {selected.length} member{selected.length !== 1 ? "s" : ""} selected
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" onClick={() => setActiveAction(null)}>Cancel</Btn>
            <Btn size="sm" disabled={!selected.length}>Run Action →</Btn>
          </div>
        </div>
      )}

      {/* Member table */}
      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} color="#64748b" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px 7px 28px", color: "#f1f5f9", fontSize: 12, outline: "none", width: 220 }} />
          </div>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>{selected.length} of {filtered.length} selected</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th style={{ padding: "10px 16px", width: 40 }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: "#3b82f6" }} />
              </th>
              {["Name", "Club", "Points", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} onClick={() => toggle(m.id)} style={{
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: selected.includes(m.id) ? "rgba(59,130,246,0.05)" : "transparent",
                cursor: "pointer",
              }}>
                <td style={{ padding: "11px 16px" }}>
                  <input type="checkbox" checked={selected.includes(m.id)} onChange={() => {}} style={{ cursor: "pointer", accentColor: "#3b82f6" }} />
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: selected.includes(m.id) ? "#3b82f6" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: selected.includes(m.id) ? "#fff" : "#94a3b8" }}>{m.name[0]}</div>
                    <span style={{ fontSize: 13, color: "#f1f5f9" }}>{m.name}</span>
                  </div>
                </td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: "#64748b" }}>{m.club}</td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: "#94a3b8" }}>{m.points}</td>
                <td style={{ padding: "11px 16px" }}><Badge label={m.status.replace("_", " ")} color={STATUS_MAP[m.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
