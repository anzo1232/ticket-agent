"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import { Inbox, Trophy, XCircle, RotateCw, Star, Check, Filter } from "lucide-react";

const EMAIL_TYPES = {
  ballot_win:    { label: "Ballot Win",    color: "green",  icon: Trophy },
  ballot_loss:   { label: "Ballot Loss",   color: "red",    icon: XCircle },
  renewal:       { label: "Renewal",       color: "yellow", icon: RotateCw },
  points_update: { label: "Points Update", color: "blue",   icon: Star },
  other:         { label: "Other",         color: "gray",   icon: Inbox },
};

const MOCK_EMAILS = [
  { id: 1, subject: "You've been successful in the ballot!", from: "tickets@arsenal.com", member: "James Harrison", club: "Arsenal FC", type: "ballot_win", received: "20 May, 09:14", processed: false },
  { id: 2, subject: "Membership renewal due — action required", from: "noreply@mancity.com", member: "Sophie Clarke", club: "Man City", type: "renewal", received: "20 May, 08:30", processed: false },
  { id: 3, subject: "Unfortunately you were not successful", from: "tickets@liverpool.com", member: "Emma Thompson", club: "Liverpool FC", type: "ballot_loss", received: "19 May, 22:05", processed: true },
  { id: 4, subject: "Your loyalty points have been updated", from: "noreply@chelseafc.com", member: "Olivia Barnes", club: "Chelsea FC", type: "points_update", received: "19 May, 18:42", processed: true },
  { id: 5, subject: "Congratulations! Ballot successful", from: "tickets@tottenhamhotspur.com", member: "Chloe Watson", club: "Tottenham", type: "ballot_win", received: "19 May, 15:10", processed: false },
  { id: 6, subject: "Your points have been credited", from: "noreply@arsenal.com", member: "Daniel Ford", club: "Arsenal FC", type: "points_update", received: "18 May, 11:22", processed: true },
  { id: 7, subject: "Ballot result: not selected this time", from: "tickets@mancity.com", member: "Marcus Reid", club: "Man City", type: "ballot_loss", received: "18 May, 09:01", processed: false },
  { id: 8, subject: "Time to renew your membership", from: "noreply@manutd.com", member: "Ryan Mitchell", club: "Man United", type: "renewal", received: "17 May, 14:33", processed: false },
];

const CLUBS = ["All", "Arsenal FC", "Man City", "Liverpool FC", "Chelsea FC", "Tottenham", "Man United"];
const TYPES = ["All", ...Object.keys(EMAIL_TYPES)];

export default function EmailsPage() {
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [clubFilter, setClubFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showProcessed, setShowProcessed] = useState(false);

  const markProcessed = id => setEmails(prev => prev.map(e => e.id === id ? { ...e, processed: true } : e));

  const filtered = emails.filter(e => {
    const matchClub = clubFilter === "All" || e.club === clubFilter;
    const matchType = typeFilter === "All" || e.type === typeFilter;
    const matchProcessed = showProcessed || !e.processed;
    return matchClub && matchType && matchProcessed;
  });

  const wins  = emails.filter(e => e.type === "ballot_win").length;
  const losses = emails.filter(e => e.type === "ballot_loss").length;
  const unprocessed = emails.filter(e => !e.processed).length;
  const renewals = emails.filter(e => e.type === "renewal").length;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Email Inbox Monitor"
        subtitle="Aggregated emails across all member accounts"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Ballot Wins" value={wins} icon={Trophy} color="#22c55e" />
        <StatCard label="Ballot Losses" value={losses} icon={XCircle} color="#ef4444" />
        <StatCard label="Renewals Due" value={renewals} icon={RotateCw} color="#eab308" />
        <StatCard label="Unprocessed" value={unprocessed} icon={Inbox} color="#3b82f6" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <Filter size={13} color="#64748b" />
        <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}
          style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
          {CLUBS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
          {TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : EMAIL_TYPES[t]?.label}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", cursor: "pointer", marginLeft: 4 }}>
          <input type="checkbox" checked={showProcessed} onChange={e => setShowProcessed(e.target.checked)} style={{ accentColor: "#3b82f6", cursor: "pointer" }} />
          Show processed
        </label>
        <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>{filtered.length} emails</span>
      </div>

      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#64748b", fontSize: 13 }}>No emails match the current filters.</div>
        ) : filtered.map((e, i) => {
          const type = EMAIL_TYPES[e.type] || EMAIL_TYPES.other;
          const TypeIcon = type.icon;
          return (
            <div key={e.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              opacity: e.processed ? 0.55 : 1,
              background: !e.processed && e.type === "ballot_win" ? "rgba(34,197,94,0.03)" : "transparent",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `rgba(var(--c), 0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(255,255,255,0.04)" }}>
                <TypeIcon size={15} color={type.color === "green" ? "#22c55e" : type.color === "red" ? "#ef4444" : type.color === "yellow" ? "#eab308" : type.color === "blue" ? "#3b82f6" : "#64748b"} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: e.processed ? 400 : 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.subject}</span>
                  {!e.processed && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{e.member} · {e.club} · {e.from}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <Badge label={type.label} color={type.color} />
                <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>{e.received}</span>
                {!e.processed && (
                  <button onClick={() => markProcessed(e.id)} title="Mark as processed"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                    <Check size={11} /> Done
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
