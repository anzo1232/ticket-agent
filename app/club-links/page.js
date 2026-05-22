"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Btn from "@/components/Btn";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { Link2, CreditCard, Activity, Users, Copy, Check } from "lucide-react";

const GENERATED = [
  { id: 1, member: "James Harrison", club: "Arsenal FC", link: "https://tickets.arsenal.com/temp/a1b2c3", expires: "22 May 2026, 10:00 AM", status: "active" },
  { id: 2, member: "Sophie Clarke", club: "Man City", link: "https://tickets.mancity.com/temp/d4e5f6", expires: "23 May 2026, 09:00 AM", status: "active" },
  { id: 3, member: "Emma Thompson", club: "Liverpool FC", link: "https://tickets.liverpoolfc.com/temp/g7h8i9", expires: "21 May 2026, 11:00 AM", status: "expired" },
];

export default function ClubLinksPage() {
  const [copied, setCopied] = useState(null);
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedMember, setSelectedMember] = useState("");

  const copy = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Club Links" subtitle="Generate temporary portal links for members" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Available Credits" value={24} icon={CreditCard} color="#3b82f6" />
        <StatCard label="Links Generated" value={47} icon={Link2} color="#8b5cf6" />
        <StatCard label="Active Links" value={12} icon={Activity} color="#22c55e" />
        <StatCard label="Eligible Members" value={191} icon={Users} color="#f97316" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Generated links table */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>Generated Links</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Member", "Club", "Link", "Expires", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GENERATED.map((g, i) => (
                <tr key={g.id} style={{ borderBottom: i < GENERATED.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{g.member}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{g.club}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#3b82f6", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.link}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#64748b" }}>{g.expires}</td>
                  <td style={{ padding: "12px 16px" }}><Badge label={g.status === "active" ? "Active" : "Expired"} color={g.status === "active" ? "green" : "gray"} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => copy(g.id, g.link)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                      {copied === g.id ? <><Check size={11} color="#22c55e" /> Copied</> : <><Copy size={11} /> Copy</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generator */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px", height: "fit-content" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 18 }}>Generate New Link</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Member", selectedMember, setSelectedMember, ["James Harrison", "Sophie Clarke", "Emma Thompson", "Olivia Barnes"]],
              ["Club", selectedClub, setSelectedClub, ["Arsenal FC", "Man City", "Chelsea FC", "Liverpool FC"]]].map(([label, val, setVal, opts]) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>{label}</div>
                <select value={val} onChange={e => setVal(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "9px 10px", color: val ? "#f1f5f9" : "#64748b", fontSize: 12, outline: "none", cursor: "pointer" }}>
                  <option value="">Select {label.toLowerCase()}...</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 7 }}>Expiry</div>
              <input type="datetime-local"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "9px 10px", color: "#94a3b8", fontSize: 12, outline: "none" }} />
            </div>
            <Btn disabled={!selectedClub || !selectedMember} style={{ width: "100%", justifyContent: "center" }}>
              <Link2 size={13} /> Generate Link (1 credit)
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
