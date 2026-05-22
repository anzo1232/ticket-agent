"use client";
import { useState } from "react";
import Btn from "@/components/Btn";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { Users, Vote, CheckSquare } from "lucide-react";

const MEMBERS = [
  { id: 1, name: "James Harrison", club: "Arsenal FC", points: 28 },
  { id: 2, name: "Sophie Clarke", club: "Man City", points: 22 },
  { id: 3, name: "Emma Thompson", club: "Liverpool FC", points: 35 },
  { id: 4, name: "Olivia Barnes", club: "Tottenham", points: 18 },
  { id: 5, name: "Chloe Watson", club: "Man City", points: 41 },
];

const BALLOTS = [
  { id: 1, match: "Arsenal vs Chelsea", club: "Arsenal FC", closes: "25 May", status: "open" },
  { id: 2, match: "Man City vs Real Madrid", club: "Man City", closes: "21 May", status: "closing_soon" },
  { id: 3, match: "Liverpool vs PSG", club: "Liverpool FC", closes: "28 May", status: "open" },
];

const SECTORS = ["North Stand", "South Stand", "East Stand", "West Stand", "Away End", "Corporate"];

export default function BallotApplicationsPage() {
  const [tab, setTab] = useState("single");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedBallot, setSelectedBallot] = useState(null);
  const [sectors, setSectors] = useState([]);

  const toggleMember = id => setSelectedMembers(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleSector = s => setSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Ballot Applications" subtitle="Enter members into ballots individually or in bulk" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#1a1d27", borderRadius: 9, padding: 4, width: "fit-content", border: "1px solid rgba(255,255,255,0.06)" }}>
        {["single", "bulk"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? "#3b82f6" : "transparent",
            border: "none", borderRadius: 7, padding: "7px 18px",
            color: tab === t ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "all 0.15s",
          }}>{t === "single" ? "Single Entry" : "Bulk Entry"}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Main form */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "24px" }}>
          {/* Member selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              {tab === "single" ? "Select Member" : "Select Members"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MEMBERS.map(m => {
                const sel = selectedMembers.includes(m.id);
                return (
                  <div key={m.id} onClick={() => tab === "bulk" ? toggleMember(m.id) : setSelectedMembers([m.id])}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                      background: sel ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${sel ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)"}`,
                      transition: "all 0.15s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: sel ? "#3b82f6" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: sel ? "#fff" : "#94a3b8" }}>{m.name[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{m.club} · {m.points} pts</div>
                      </div>
                    </div>
                    {sel && <CheckSquare size={14} color="#3b82f6" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ballot selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Select Ballot</div>
            <select value={selectedBallot || ""} onChange={e => setSelectedBallot(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px", color: "#f1f5f9", fontSize: 13, outline: "none", cursor: "pointer" }}>
              <option value="">Choose a ballot...</option>
              {BALLOTS.map(b => <option key={b.id} value={b.id}>{b.match} — closes {b.closes}</option>)}
            </select>
          </div>

          {/* Sectors */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Preferred Sectors</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {SECTORS.map(s => {
                const sel = sectors.includes(s);
                return (
                  <button key={s} onClick={() => toggleSector(s)} style={{
                    padding: "9px 10px", borderRadius: 7, border: `1px solid ${sel ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                    background: sel ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                    color: sel ? "#3b82f6" : "#94a3b8", fontSize: 12, fontWeight: sel ? 600 : 400, cursor: "pointer",
                  }}>{s}</button>
                );
              })}
            </div>
          </div>

          <Btn disabled={!selectedMembers.length || !selectedBallot}>
            Submit Application{tab === "bulk" && selectedMembers.length > 1 ? `s (${selectedMembers.length})` : ""}
          </Btn>
        </div>

        {/* Sidebar: available ballots */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>Available Ballots</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BALLOTS.map(b => (
              <div key={b.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{b.match}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{b.club} · Closes {b.closes}</div>
                <Badge label={b.status === "closing_soon" ? "Closing Soon" : "Open"} color={b.status === "closing_soon" ? "yellow" : "green"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
