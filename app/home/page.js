"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { Users, Ticket, Vote, Mail, Bell, AlertTriangle, Clock, Trophy } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ members: 0, eligible: 0, ballots: 0, drops: 0 });
  const [upcomingDrops, setUpcomingDrops] = useState([]);
  const [openBallots, setOpenBallots] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    async function load() {
      const [members, eligible, ballots, drops, upDrops, openBal] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "eligible"),
        supabase.from("ballots").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("drops").select("id", { count: "exact", head: true }),
        supabase.from("drops").select("*").order("created_at", { ascending: false }).limit(3),
        supabase.from("ballots").select("*").in("status", ["open", "closing_soon"]).order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        members: members.count || 0,
        eligible: eligible.count || 0,
        ballots: ballots.count || 0,
        drops: drops.count || 0,
      });
      setUpcomingDrops(upDrops.data || []);
      setOpenBallots(openBal.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const alerts = [
    ...(stats.eligible === 0 && stats.members > 0
      ? [{ type: "warning", title: "No eligible members", desc: "All members are inactive or flagged. Check member statuses.", href: "/members" }]
      : []),
    ...(openBallots.filter(b => b.status === "closing_soon").map(b => ({
      type: "error", title: `Ballot closing soon: ${b.match}`, desc: `Closes ${b.close_date}`, href: "/ballots",
    }))),
    ...(upcomingDrops.length === 0
      ? [{ type: "info", title: "No upcoming drops", desc: "Add ticket drops to start tracking.", href: "/drops" }]
      : []),
  ];

  const ALERT_COLORS = {
    error:   { border: "#ef4444", bg: "rgba(239,68,68,0.06)" },
    warning: { border: "#eab308", bg: "rgba(234,179,8,0.06)" },
    info:    { border: "#3b82f6", bg: "rgba(59,130,246,0.06)" },
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{today}</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.5 }}>Welcome back 👋</h1>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, background: "rgba(59,130,246,0.12)", borderRadius: 6, padding: "3px 10px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>Pro Tier</span>
          </div>
        </div>
        <button style={{ position: "relative", background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", cursor: "pointer", color: "#94a3b8" }}>
          <Bell size={18} />
          {alerts.length > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #1a1d27" }} />}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Members" value={loading ? "—" : stats.members} icon={Users} color="#3b82f6" sub="Across all clubs" />
        <StatCard label="Eligible Members" value={loading ? "—" : stats.eligible} icon={Trophy} color="#22c55e" sub={stats.members ? `${Math.round(stats.eligible / stats.members * 100)}% of total` : "—"} />
        <StatCard label="Active Ballots" value={loading ? "—" : stats.ballots} icon={Vote} color="#8b5cf6" />
        <StatCard label="Ticket Drops" value={loading ? "—" : stats.drops} icon={Ticket} color="#f97316" />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={13} color="#eab308" /> Things that need attention
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.map((a, i) => {
              const c = ALERT_COLORS[a.type];
              return (
                <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}22`, borderLeft: `3px solid ${c.border}`, borderRadius: 9, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 1 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{a.desc}</div>
                  </div>
                  {a.href && (
                    <Link href={a.href} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textDecoration: "none", whiteSpace: "nowrap" }}>
                      View →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Upcoming drops */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={13} color="#3b82f6" /> Upcoming Ticket Drops
          </div>
          {loading ? (
            <div style={{ background: "#1a1d27", borderRadius: 12, padding: 28, textAlign: "center", color: "#475569", fontSize: 13 }}>Loading…</div>
          ) : upcomingDrops.length === 0 ? (
            <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <Ticket size={28} color="#334155" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: 13, color: "#475569" }}>No drops yet.</div>
              <Link href="/drops" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", marginTop: 6, display: "inline-block" }}>Add your first drop →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingDrops.map(d => (
                <div key={d.id} style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{d.match}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{d.club}</div>
                    </div>
                    <Badge label={d.status === "confirmed" ? "Confirmed" : "Expected"} color={d.status === "confirmed" ? "green" : "yellow"} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#3b82f6", fontSize: 11, marginBottom: 10 }}>
                    <Clock size={10} /> {d.drop_time || "TBC"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[["Points needed", d.points_needed, "#eab308"], ["Can buy", d.tickets, "#22c55e"], ["Close", d.close_count, "#f97316"]].map(([lbl, val, col]) => (
                      <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "7px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: col }}>{val ?? 0}</div>
                        <div style={{ fontSize: 9, color: "#64748b", marginTop: 1 }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open ballots */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Vote size={13} color="#8b5cf6" /> Open Ballots
          </div>
          {loading ? (
            <div style={{ background: "#1a1d27", borderRadius: 12, padding: 28, textAlign: "center", color: "#475569", fontSize: 13 }}>Loading…</div>
          ) : openBallots.length === 0 ? (
            <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <Vote size={28} color="#334155" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: 13, color: "#475569" }}>No open ballots.</div>
              <Link href="/ballots" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", marginTop: 6, display: "inline-block" }}>Add a ballot →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {openBallots.map(b => {
                const pct = b.total > 0 ? Math.round((b.applied / b.total) * 100) : 0;
                return (
                  <div key={b.id} style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{b.match}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{b.club} · Closes {b.close_date}</div>
                      </div>
                      <Badge label={b.status === "closing_soon" ? "Closing Soon" : "Open"} color={b.status === "closing_soon" ? "yellow" : "green"} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#8b5cf6", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{b.applied}/{b.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 24 }}>
        {[
          { label: "Add Member", href: "/members", color: "#3b82f6" },
          { label: "Add Drop", href: "/drops", color: "#22c55e" },
          { label: "Add Ballot", href: "/ballots", color: "#8b5cf6" },
          { label: "View Analytics", href: "/analytics", color: "#f97316" },
        ].map(q => (
          <Link key={q.href} href={q.href} style={{
            display: "block", background: "#1a1d27", border: `1px solid ${q.color}20`,
            borderRadius: 9, padding: "12px 14px", textDecoration: "none",
            color: q.color, fontSize: 12, fontWeight: 600, textAlign: "center",
            transition: "all 0.15s",
          }}>{q.label} →</Link>
        ))}
      </div>
    </div>
  );
}
