"use client";
import { useState } from "react";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import { MousePointerClick, Users, Building2, Ticket, CheckCircle } from "lucide-react";

const MATCHES = ["Arsenal vs Chelsea — 7 Jun", "Man City vs Liverpool — 8 Jun", "Tottenham vs Man Utd — 9 Jun"];
const CLUBS = ["Arsenal FC", "Man City", "Chelsea FC", "Liverpool FC", "Tottenham", "Man United"];
const MEMBERS = [
  { id: 1, name: "James Harrison", accounts: 3 },
  { id: 2, name: "Sophie Clarke", accounts: 2 },
  { id: 3, name: "Emma Thompson", accounts: 4 },
  { id: 4, name: "Olivia Barnes", accounts: 2 },
  { id: 5, name: "Chloe Watson", accounts: 3 },
  { id: 6, name: "Daniel Ford", accounts: 2 },
];

export default function PullingPage() {
  const [match, setMatch] = useState("");
  const [club, setClub] = useState("");
  const [leads, setLeads] = useState([]);
  const totalAccounts = leads.reduce((s, id) => s + (MEMBERS.find(m => m.id === id)?.accounts || 0), 0);

  const toggleLead = id => setLeads(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Ticket Pulling Service" subtitle="Coordinate bulk ticket pulls across multiple accounts" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Match select */}
          <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Select Match / Drop</div>
            <select value={match} onChange={e => setMatch(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px", color: match ? "#f1f5f9" : "#64748b", fontSize: 13, outline: "none", cursor: "pointer" }}>
              <option value="">Choose match...</option>
              {MATCHES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Club select */}
          <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Select Club</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {CLUBS.map(c => (
                <button key={c} onClick={() => setClub(c)} style={{
                  padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                  border: `1px solid ${club === c ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                  background: club === c ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                  color: club === c ? "#3b82f6" : "#94a3b8", fontWeight: club === c ? 600 : 400,
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Lead members */}
          <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Select Lead Members</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MEMBERS.map(m => {
                const sel = leads.includes(m.id);
                return (
                  <div key={m.id} onClick={() => toggleLead(m.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                    background: sel ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${sel ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)"}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: sel ? "#3b82f6" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: sel ? "#fff" : "#94a3b8" }}>{m.name[0]}</div>
                      <span style={{ fontSize: 13, color: "#f1f5f9" }}>{m.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{m.accounts} accounts</span>
                      {sel && <CheckCircle size={14} color="#3b82f6" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Btn disabled={!match || !club || !leads.length} style={{ alignSelf: "flex-start" }}>
            <MousePointerClick size={14} /> Start Pull
          </Btn>
        </div>

        {/* Summary sidebar */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px", height: "fit-content", position: "sticky", top: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Pull Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              [Building2, "Selected Club", club || "—"],
              [Ticket, "Target Match", match || "—"],
              [Users, "Lead Members", leads.length ? `${leads.length} selected` : "—"],
              [Users, "Total Accounts", totalAccounts || "—"],
            ].map(([Icon, label, value]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                <Icon size={14} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginTop: 1 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
