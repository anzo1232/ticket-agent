"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import FormField, { inp } from "@/components/FormField";
import { Clock, Plus, Search, Ticket, Pencil, Trash2, AlertTriangle } from "lucide-react";

const CLUBS = ["Arsenal FC", "Man City", "Chelsea FC", "Liverpool FC", "Tottenham", "Man United"];
const BLANK = { match: "", club: "", match_date: "", drop_time: "", points_needed: 0, tickets: 0, close_count: 0, status: "expected" };

function DropForm({ initial, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState(initial || BLANK);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Match Name" required>
          <input style={inp} value={form.match} onChange={e => set("match", e.target.value)} placeholder="Arsenal vs Chelsea" />
        </FormField>
        <FormField label="Club" required>
          <select style={{ ...inp, cursor: "pointer" }} value={form.club} onChange={e => set("club", e.target.value)}>
            <option value="">Select club…</option>
            {CLUBS.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Match Date">
          <input style={inp} value={form.match_date} onChange={e => set("match_date", e.target.value)} placeholder="7 Jun 2026" />
        </FormField>
        <FormField label="Drop Time">
          <input style={inp} value={form.drop_time} onChange={e => set("drop_time", e.target.value)} placeholder="21 May 2026, 10:00 AM" />
        </FormField>
        <FormField label="Points Needed">
          <input style={inp} type="number" min="0" value={form.points_needed} onChange={e => set("points_needed", parseInt(e.target.value) || 0)} />
        </FormField>
        <FormField label="Available Tickets">
          <input style={inp} type="number" min="0" value={form.tickets} onChange={e => set("tickets", parseInt(e.target.value) || 0)} />
        </FormField>
        <FormField label="Members Close to Eligible">
          <input style={inp} type="number" min="0" value={form.close_count} onChange={e => set("close_count", parseInt(e.target.value) || 0)} />
        </FormField>
        <FormField label="Status">
          <select style={{ ...inp, cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="expected">Expected</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </FormField>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "8px 12px", fontSize: 12, color: "#ef4444" }}>{error}</div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSave(form)} disabled={!form.match.trim() || !form.club || saving}>{saving ? "Saving…" : "Save Drop"}</Btn>
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm, deleting }) {
  return (
    <Modal title="Delete Drop" onClose={onClose} width={420}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>Delete <strong style={{ color: "#f1f5f9" }}>{item.match}</strong>? This cannot be undone.</p>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</Btn>
      </div>
    </Modal>
  );
}

export default function DropsPage() {
  const [drops, setDrops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("drops").select("*").order("created_at", { ascending: false });
    const rows = data || [];
    setDrops(rows);
    if (rows.length && !selected) setSelected(rows[0]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("drops").insert([form]);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch(); setSaving(false); setShowAdd(false);
  };

  const handleEdit = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("drops").update(form).eq("id", editTarget.id);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch(); setSaving(false); setEditTarget(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("drops").delete().eq("id", deleteTarget.id);
    setSelected(null);
    await fetch(); setDeleting(false); setDeleteTarget(null);
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Ticket Drops"
        subtitle="Upcoming drops across all clubs"
        actions={<Btn size="sm" onClick={() => { setFormError(""); setShowAdd(true); }}><Plus size={13} /> Add Drop</Btn>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, minHeight: 500 }}>
        {/* Left list */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {drops.length} Drops
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 28, textAlign: "center", color: "#475569", fontSize: 13 }}>Loading…</div>
            ) : drops.length === 0 ? (
              <div style={{ padding: 28, textAlign: "center" }}>
                <Ticket size={24} color="#334155" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, color: "#475569" }}>No drops yet.</div>
              </div>
            ) : drops.map(d => (
              <div key={d.id} onClick={() => setSelected(d)} style={{
                padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
                background: selected?.id === d.id ? "rgba(59,130,246,0.08)" : "transparent",
                borderLeft: `3px solid ${selected?.id === d.id ? "#3b82f6" : "transparent"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", flex: 1, marginRight: 8 }}>{d.match}</div>
                  <Badge label={d.status === "confirmed" ? "Confirmed" : "Expected"} color={d.status === "confirmed" ? "green" : "yellow"} />
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>{d.club}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#3b82f6" }}>
                  <Clock size={10} /> {d.drop_time || "TBC"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right detail */}
        <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "26px 28px" }}>
          {!selected ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
              <Ticket size={36} color="#334155" />
              <div style={{ fontSize: 13, color: "#475569" }}>Select a drop to view details</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <Badge label={selected.status === "confirmed" ? "Confirmed" : "Expected"} color={selected.status === "confirmed" ? "green" : "yellow"} />
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginTop: 8, letterSpacing: -0.3 }}>{selected.match}</h2>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{selected.club}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setFormError(""); setEditTarget(selected); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(selected)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                    <Trash2 size={13} /> Delete
                  </button>
                  <Btn size="sm">Pull Tickets →</Btn>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 22 }}>
                {[["Match Date", selected.match_date || "—"], ["Drop Time", selected.drop_time || "—"]].map(([label, value]) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[["Points Needed", selected.points_needed ?? 0, "#eab308"], ["Available Tickets", selected.tickets ?? 0, "#22c55e"], ["Close to Eligible", selected.close_count ?? 0, "#f97316"]].map(([lbl, val, col]) => (
                  <div key={lbl} style={{ background: `${col}0e`, border: `1px solid ${col}22`, borderRadius: 9, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: col }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showAdd && <Modal title="Add Ticket Drop" onClose={() => setShowAdd(false)} width={580}>
        <DropForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} error={formError} />
      </Modal>}
      {editTarget && <Modal title={`Edit — ${editTarget.match}`} onClose={() => setEditTarget(null)} width={580}>
        <DropForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} error={formError} />
      </Modal>}
      {deleteTarget && <DeleteModal item={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />}
    </div>
  );
}
