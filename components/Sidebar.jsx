"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Ticket, Vote, ClipboardList,
  MousePointerClick, Link2, Zap, Mail, Globe, BarChart3,
  ChevronRight, UserCog, TicketCheck, TrendingUp, Inbox, ShieldAlert
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard", href: "/home", icon: LayoutDashboard },
      { label: "Members", href: "/members", icon: Users },
      { label: "Ticket Drops", href: "/drops", icon: Ticket },
      { label: "Ballot Manager", href: "/ballots", icon: Vote },
      { label: "Ballot Applications", href: "/ballot-applications", icon: ClipboardList },
      { label: "Ticket Pulling", href: "/pulling", icon: MousePointerClick },
      { label: "Puller Management", href: "/pullers", icon: UserCog },
    ],
  },
  {
    label: "Finance & Tracking",
    items: [
      { label: "Ticket Tracker", href: "/tickets", icon: TicketCheck },
      { label: "P&L per Drop", href: "/pnl", icon: TrendingUp },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Email Inbox", href: "/emails", icon: Inbox },
      { label: "Ban Checker", href: "/ban-checker", icon: ShieldAlert },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Club Links", href: "/club-links", icon: Link2 },
      { label: "Bulk Actions", href: "/bulk-actions", icon: Zap },
      { label: "Email Accounts", href: "/email-accounts", icon: Mail },
      { label: "Proxy Service", href: "/proxy-service", icon: Globe },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: "#13151f",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ticket size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.3 }}>Ticket Agent</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.3 }}>Operations Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 1, padding: "6px 12px 4px" }}>
              {group.label}
            </div>
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", borderRadius: 8, marginBottom: 1,
                  textDecoration: "none",
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                  color: active ? "#3b82f6" : "#94a3b8",
                  fontSize: 12.5, fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}>
                  <Icon size={14} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {active && <ChevronRight size={11} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Agent badge */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>Agent</div>
            <div style={{ fontSize: 10, color: "#3b82f6" }}>Pro Tier</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
