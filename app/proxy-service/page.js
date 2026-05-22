"use client";
import StatCard from "@/components/StatCard";
import Btn from "@/components/Btn";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { Globe, Zap, Shield, Server } from "lucide-react";

const PROXIES = [
  {
    id: 1, name: "Residential Rotating", type: "Residential", pricing: "£3.50/GB",
    speed: "10–50 Mbps", uptime: "99.5%", availability: "Unlimited",
    color: "#3b82f6", badge: "blue", popular: true,
    features: ["Rotating IPs", "195+ countries", "HTTP/HTTPS/SOCKS5", "Unlimited threads"],
  },
  {
    id: 2, name: "Datacenter Static", type: "Datacenter", pricing: "£8/mo per IP",
    speed: "1 Gbps", uptime: "99.9%", availability: "Limited",
    color: "#22c55e", badge: "green",
    features: ["Dedicated IPs", "UK & EU only", "HTTP/HTTPS", "Low latency"],
  },
  {
    id: 3, name: "Mobile 4G Proxies", type: "Mobile", pricing: "£15/mo per IP",
    speed: "20–80 Mbps", uptime: "98.5%", availability: "Limited",
    color: "#8b5cf6", badge: "purple",
    features: ["Real mobile IPs", "UK networks", "Auto IP rotation", "Highest trust score"],
  },
  {
    id: 4, name: "ISP Static Residential", type: "ISP", pricing: "£6/mo per IP",
    speed: "100–500 Mbps", uptime: "99.8%", availability: "Available",
    color: "#f97316", badge: "yellow",
    features: ["Static residential", "Virgin/BT/Sky ASNs", "HTTP/HTTPS/SOCKS5", "UK only"],
  },
];

export default function ProxyServicePage() {
  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Proxy Service" subtitle="Proxy packages for secure ticket operations" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Proxy Types" value={4} icon={Globe} color="#3b82f6" />
        <StatCard label="Avg Uptime" value="99.4%" icon={Server} color="#22c55e" />
        <StatCard label="Starting Price" value="£3.50/GB" icon={Zap} color="#eab308" />
        <StatCard label="Protocols" value="3" icon={Shield} color="#8b5cf6" sub="HTTP, HTTPS, SOCKS5" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {PROXIES.map(p => (
          <div key={p.id} style={{
            background: "#1a1d27", border: `1px solid ${p.popular ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 14, padding: "24px", position: "relative",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={20} color={p.color} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{p.type}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {p.popular && <Badge label="Popular" color="blue" />}
                <Badge label={p.availability} color={p.availability === "Unlimited" || p.availability === "Available" ? "green" : "yellow"} />
              </div>
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 16 }}>{p.pricing}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
              {[["Speed", p.speed], ["Uptime", p.uptime], ["Type", p.type]].map(([label, val]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 18 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <Zap size={10} color={p.color} />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{f}</span>
                </div>
              ))}
            </div>

            <Btn style={{ width: "100%", justifyContent: "center", background: p.popular ? "#3b82f6" : undefined }}>
              Purchase Plan →
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
}
