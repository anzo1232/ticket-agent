"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import { UserCog, CheckCircle, XCircle, TrendingUp, Plus, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_PULLERS = [
  {
    id: 1, name: "Liam Carter", contact: "liam@example.com", phone: "+44 7700 000001",
    assignedDrops: ["Arsenal vs Chelsea", "Liverpool vs PSG"],
    attempted: 24, successful: 19, failed: 5,
    earnings: 380, status: "active",
    credentials: [
      { member: "James Harrison", email: "james.h@gmail.com", password: "Secure#1234" },
      { member: "Emma Thompson", email: "emma.t@gmail.com", password: "Pass#5678" },
    ],
  },
  {
    id: 2, name: "Zara Ahmed", contact: "zara@example.com", phone: "+44 7700 000002",
    assignedDrops: ["Man City vs Real Madrid"],
    attempted: 18, successful: 16, failed: 2,
    earnings: 320, status: "active",
    credentials: [
      { member: "Sophie Clarke", email: "sophie.c@gmail.com", password: "Secure#9012" },
    ],
  },
  {
    id: 3, name: "Marcus Osei", contact: "marcus@example.com", phone: "+44 7700 000003",
    assignedDrops: ["Tottenham vs Man Utd", "Chelsea vs Barcelona"],
    attempted: 31, successful: 22, failed: 9,
    earnings: 440, status: "active",
    credentials: [
      { member: "Olivia Barnes", email: "olivia.b@gmail.com", password: "Ticket#3456" },
      { member: "Chloe Watson", email: "chloe.w@gmail.com", password: "Agent#7890" },
    ],
  },
];

function CredentialRow({ cred }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 7, marginBottom: 4 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{cred.member}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{cred.email}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, fontFamily: "monospace", color: show ? "#f1f5f9" : "#64748b", letterSpacing: show ? 0.5 : 1 }}>
          {show ? cred.password : "••••••••••"}
        </span>
        <button onClick={() => setShow(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}>
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
}

function PullerCard({ puller }) {
  const [expanded, setExpanded] = useState(false);
  const rate = Math.round((puller.successful / puller.attempted) * 100);

  return (
    <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {puller.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{puller.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{puller.contact}</div>
            </div>
          </div>
          <Badge label={puller.status === "active" ? "Active" : "Inactive"} color={puller.status === "active" ? "green" : "gray"} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            ["Attempted", puller.attempted, "#94a3b8"],
            ["Successful", puller.successful, "#22c55e"],
            ["Failed", puller.failed, "#ef4444"],
            ["Earnings", `£${puller.earnings}`, "#3b82f6"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 4 }}>
            <span>Success rate</span>
            <span style={{ color: rate >= 80 ? "#22c55e" : rate >= 60 ? "#eab308" : "#ef4444", fontWeight: 600 }}>{rate}%</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
            <div style={{ width: `${rate}%`, height: "100%", borderRadius: 3, background: rate >= 80 ? "#22c55e" : rate >= 60 ? "#eab308" : "#ef4444" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {puller.assignedDrops.map(d => (
            <span key={d} style={{ fontSize: 10, background: "rgba(59,130,246,0.12)", color: "#3b82f6", borderRadius: 5, padding: "3px 8px", fontWeight: 600 }}>{d}</span>
          ))}
        </div>

        <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 12, fontWeight: 600 }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "View"} credentials ({puller.credentials.length})
        </button>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, margin: "12px 0 8px" }}>Member Credentials</div>
          {puller.credentials.map((c, i) => <CredentialRow key={i} cred={c} />)}
        </div>
      )}
    </div>
  );
}

export default function PullersPage() {
  const [pullers, setPullers] = useState(MOCK_PULLERS);

  useEffect(() => {
    supabase.from("pullers").select("*").then(({ data }) => {
      if (data?.length) setPullers(data);
    });
  }, []);

  const totalAttempted = pullers.reduce((s, p) => s + p.attempted, 0);
  const totalSuccessful = pullers.reduce((s, p) => s + p.successful, 0);
  const totalEarnings = pullers.reduce((s, p) => s + p.earnings, 0);
  const overallRate = Math.round((totalSuccessful / totalAttempted) * 100);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Puller Management"
        subtitle="Manage pullers, assign drops, and view credentials"
        actions={<Btn size="sm"><Plus size={13} /> Add Puller</Btn>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Active Pullers" value={pullers.filter(p => p.status === "active").length} icon={UserCog} color="#3b82f6" />
        <StatCard label="Pulls Attempted" value={totalAttempted} icon={TrendingUp} color="#8b5cf6" />
        <StatCard label="Successful Pulls" value={totalSuccessful} icon={CheckCircle} color="#22c55e" sub={`${overallRate}% success rate`} />
        <StatCard label="Total Earnings Paid" value={`£${totalEarnings}`} icon={XCircle} color="#f97316" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 16 }}>
        {pullers.map(p => <PullerCard key={p.id} puller={p} />)}
      </div>
    </div>
  );
}
