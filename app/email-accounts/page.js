"use client";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import Btn from "@/components/Btn";
import Badge from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { Mail, Package, Star, ShieldCheck, Minus, Plus } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Starter Pack", qty_label: "5 accounts", age: "90-day aged", price: 29.99, warranty: 30, features: ["Gmail verified", "2FA enabled", "Recovery set up"], color: "#64748b", badge: "gray" },
  { id: 2, name: "Growth Pack", qty_label: "10 accounts", age: "180-day aged", price: 54.99, warranty: 60, features: ["Gmail verified", "2FA enabled", "Recovery set up", "Phone verified"], color: "#3b82f6", badge: "blue", popular: true },
  { id: 3, name: "Pro Pack", qty_label: "25 accounts", age: "365-day aged", price: 119.99, warranty: 90, features: ["Gmail verified", "2FA enabled", "Recovery set up", "Phone verified", "Activity history"], color: "#8b5cf6", badge: "purple" },
  { id: 4, name: "Elite Pack", qty_label: "50 accounts", age: "2-year aged", price: 199.99, warranty: 180, features: ["Gmail verified", "2FA enabled", "Recovery set up", "Phone verified", "Activity history", "Priority support"], color: "#f97316", badge: "yellow" },
];

export default function EmailAccountsPage() {
  const [quantities, setQuantities] = useState({});
  const setQty = (id, delta) => setQuantities(q => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }));

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader title="Email Accounts Store" subtitle="Purchase aged Gmail accounts for operations" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Products" value={PRODUCTS.length} icon={Package} color="#3b82f6" />
        <StatCard label="Available Now" value="All" icon={Mail} color="#22c55e" />
        <StatCard label="Starting Price" value="£29.99" icon={Star} color="#eab308" />
        <StatCard label="Warranty (days)" value="30–180" icon={ShieldCheck} color="#8b5cf6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {PRODUCTS.map(p => {
          const qty = quantities[p.id] || 1;
          return (
            <div key={p.id} style={{
              background: "#1a1d27", border: `1px solid ${p.popular ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14, padding: "24px", position: "relative", overflow: "hidden",
            }}>
              {p.popular && (
                <div style={{ position: "absolute", top: 14, right: 14 }}>
                  <Badge label="Most Popular" color="blue" />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={20} color={p.color} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{p.qty_label} · {p.age}</div>
                </div>
              </div>

              <div style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>
                £{(p.price * qty).toFixed(2)}
                <span style={{ fontSize: 13, fontWeight: 400, color: "#64748b" }}> /{qty > 1 ? `${qty} packs` : "pack"}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>{p.warranty}-day warranty included</div>

              <div style={{ marginBottom: 20 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <ShieldCheck size={11} color="#22c55e" />
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "4px" }}>
                  <button onClick={() => setQty(p.id, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "2px 6px", display: "flex" }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", minWidth: 20, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty(p.id, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "2px 6px", display: "flex" }}>
                    <Plus size={12} />
                  </button>
                </div>
                <Btn style={{ flex: 1, justifyContent: "center", background: p.popular ? "#3b82f6" : undefined }}>
                  Purchase →
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
