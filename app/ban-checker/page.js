"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import { ShieldAlert, ShieldCheck, ShieldOff, AlertTriangle, Search, Plus, RotateCw } from "lucide-react";

const MOCK_HISTORY = [
  { id: 1, member: "James Harrison", club: "Arsenal FC", membership: "ARS-10042", checkedAt: "20 May 2026, 09:15", status: "clean" },
  { id: 2, member: "Sophie Clarke", club: "Man City", membership: "MCI-20187", checkedAt: "20 May 2026, 09:10", status: "clean" },
  { id: 3, member: "Daniel Ford", club: "Arsenal FC", membership: "ARS-10098", checkedAt: "19 May 2026, 14:22", status: "banned" },
  { id: 4, member: "Ryan Mitchell", club: "Chelsea FC", membership: "CHE-30091", checkedAt: "19 May 2026, 11:05", status: "flagged" },
  { id: 5, member: "Emma Thompson", club: "Liverpool FC", membership: "LIV-40063", checkedAt: "18 May 2026, 16:44", status: "clean" },
  { id: 6, member: "Marcus Reid", club: "Man United", membership: "MUN-60044", checkedAt: "18 May 2026, 10:30", status: "clean" },
];

const STATUS_MAP = {
  clean:   { label: "Clean",   color: "green",  icon: ShieldCheck },
  flagged: { label: "Flagged", color: "yellow", icon: AlertTriangle },
  banned:  { label: "Banned",  color: "red",    icon: ShieldOff },
};

export default function BanCheckerPage() {
  const [tab, setTab] = useState("single");
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState(MOCK_HISTORY);

  const runCheck = async () => {
    setChecking(true);
    await new Promise(r => setTimeout(r, 1200));
    const accounts = tab === "single"
      ? [input.trim()].filter(Boolean)
      : bulkInput.split("\n").map(s => s.trim()).filter(Boolean);

    const newResults = accounts.map((acc, i) => ({
      account: acc,
      status: i === 1 ? "flagged" : i === 2 ? "banned" : "clean",
      checkedAt: new Date().toLocaleString("en-GB"),
    }));
    setResults(newResults);
    setChecking(false);
  };

  const clean   = history.filter(h => h.status === "clean").length;
  const flagged = history.filter(h => h.status === "flagged").length;
  const banned  = history.filter(h => h.status === "banned").length;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Membership Ban Checker"
        subtitle="Check accounts for bans or restrictions"
      />

      {/* Alert if banned */}
      {banned > 0 && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderLeft: "3px solid #ef4444", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldOff size={16} color="#ef4444" />
          <span style={{ fontSize: 13, color: "#f1f5f9" }}><strong>{banned} account{banned > 1 ? "s" : ""} banned</strong> — review immediately and update member profiles.</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Clean Accounts" value={clean} icon={ShieldCheck} color="#22c55e" />
        <StatCard label="Flagged" value={flagged} icon={AlertTriangle} color="#eab308" sub="Potential restrictions" />
        <StatCard label="Banned" value={banned} icon={ShieldOff} color="#ef4444" sub="Action required" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Checker */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Run a Check</div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, width: "fit-content" }}>
            {["single", "bulk"].map(t => (
              <button key={t} onClick={() => { setTab(t); setResults([]); }} style={{
                background: tab === t ? "#3b82f6" : "transparent",
                border: "none", borderRadius: 6, padding: "5px 14px",
                color: tab === t ? "#fff" : "#64748b", fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}>{t === "single" ? "Single" : "Bulk"}</button>
            ))}
          </div>

          {tab === "single" ? (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>Membership Number or Account</div>
              <div style={{ position: "relative" }}>
                <Search size={13} color="#64748b" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input value={input} onChange={e => setInput(e.target.value)}
                  placeholder="e.g. ARS-10042 or james@gmail.com"
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 10px 9px 32px", color: "#f1f5f9", fontSize: 13, outline: "none" }} />
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>Accounts (one per line)</div>
              <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)} rows={6}
                placeholder={"ARS-10042\nMCI-20187\nCHE-30091"}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 10px", color: "#f1f5f9", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "monospace" }} />
            </div>
          )}

          <Btn onClick={runCheck} disabled={checking || (tab === "single" ? !input.trim() : !bulkInput.trim())} style={{ width: "100%", justifyContent: "center" }}>
            {checking ? <><RotateCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Checking...</> : <><Search size={13} /> Run Check</>}
          </Btn>

          {/* Results */}
          {results.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Results</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {results.map((r, i) => {
                  const s = STATUS_MAP[r.status];
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
                      background: r.status === "banned" ? "rgba(239,68,68,0.08)" : r.status === "flagged" ? "rgba(234,179,8,0.06)" : "rgba(34,197,94,0.06)",
                      border: `1px solid ${r.status === "banned" ? "rgba(239,68,68,0.2)" : r.status === "flagged" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)"}`,
                      borderRadius: 8,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon size={14} color={r.status === "banned" ? "#ef4444" : r.status === "flagged" ? "#eab308" : "#22c55e"} />
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#f1f5f9" }}>{r.account}</span>
                      </div>
                      <Badge label={s.label} color={s.color} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Ban history */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Check History</div>
          <div style={{ overflowY: "auto", maxHeight: 480 }}>
            {history.map((h, i) => {
              const s = STATUS_MAP[h.status];
              const Icon = s.icon;
              return (
                <div key={h.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px",
                  borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: h.status === "banned" ? "rgba(239,68,68,0.04)" : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={14} color={h.status === "banned" ? "#ef4444" : h.status === "flagged" ? "#eab308" : "#22c55e"} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{h.member}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{h.club} · {h.membership}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{h.checkedAt}</div>
                    </div>
                  </div>
                  <Badge label={s.label} color={s.color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
