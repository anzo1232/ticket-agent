"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import FormField, { inp } from "@/components/FormField";
import { Vote, Clock, AlertTriangle, CheckCircle, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

const CLUBS = ["Arsenal FC", "Man City", "Chelsea FC", "Liverpool FC", "Tottenham", "Man United"];
const STATUS_MAP = {
  open:         { label: "Open",         color: "green"  },
  closing_soon: { label: "Closing Soon", color: "yellow" },
  results_in:   { label: "Results In",   color: "blue"   },
  closed:       { label: "Closed",       color: "gray"   },
};
const BLANK = { match: "", club: "", open_date: "", close_date: "", applied: 0, total: 100, status: "open" };

function BallotForm({ initial, onSave, onCancel, saving, error }) {
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
        <FormField label="Open Date">
          <input style={inp} value={form.open_date} onChange={e => set("open_date", e.target.value)} placeholder="20 May 2026" />
        </FormField>
        <FormField label="Close Date">
          <input style={inp} value={form.close_date} onChange={e => set("close_date", e.target.value)} placeholder="25 May 2026" />
        </FormField>
        <FormField label="Applications Received">
          <input style={inp} type="number" min="0" value={form.applied} onChange={e => set("applied", parseInt(e.target.value) || 0)} />
        </FormField>
        <FormField label="Total Capacity">
          <input style={inp} type="number" min="1" value={form.total} onChange={e => set("total", parseInt(e.target.value) || 100)} />
        </FormField>
      </div>
      <FormField label="Status">
        <select style={{ ...inp, cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)}>
          <option value="open">Open</option>
          <option value="closing_soon">Closing Soon</option>
          <option value="results_in">Results In</option>
          <option value="closed">Closed</option>
        </select>
      </FormField>
      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "8px 12px", fontSize: 12, color: "#ef4444" }}>{error}</div>}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSave(form)} disabled={!form.match.trim() || !form.club || saving}>{saving ? "Saving…" : "Save Ballot"}</Btn>
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm, deleting }) {
  return (
    <Modal title="Delete Ballot" onClose={onClose} width={420}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>Delete ballot for <strong style={{ color: "#f1f5f9" }}>{item.match}</strong>? This cannot be undone.</p>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</Btn>
      </div>
    </Modal>
  );
}

export default function BallotsPage() {
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("ballots").select("*").order("created_at", { ascending: false });
    setBallots(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("ballots").insert([form]);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch(); setSaving(false); setShowAdd(false);
  };

  const handleEdit = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("ballots").update(form).eq("id", editTarget.id);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch(); setSaving(false); setEditTarget(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("ballots").delete().eq("id", deleteTarget.id);
    await fetch(); setDeleting(false); setDeleteTarget(null);
  };

  const open     = ballots.filter(b => b.status === "open").length;
  const closing  = ballots.filter(b => b.status === "closing_soon").length;
  const results  = ballots.filter(b => b.status === "results_in").length;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      <PageHeader
        title="Ballot Manager"
        subtitle="Track and manage all ballots"
        actions={<>
          <Btn variant="secondary" size="sm" onClick={fetch}><RefreshCw size={13} /> Refresh</Btn>
          <Btn size="sm" onClick={() => { setFormError(""); setShowAdd(true); }}><Plus size={13} /> Add Ballot</Btn>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Ballots" value={ballots.length} icon={Vote} color="#3b82f6" />
        <StatCard label="Open" value={open} icon={CheckCircle} color="#22c55e" />
        <StatCard label="Closing Soon" value={closing} icon={AlertTriangle} color="#eab308" />
        <StatCard label="Results In" value={results} icon={Clock} color="#8b5cf6" />
      </div>

      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#475569", fontSize: 13 }}>Loading…</div>
        ) : ballots.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <Vote size={32} color="#334155" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, color: "#475569", marginBottom: 12 }}>No ballots yet.</div>
            <Btn size="sm" onClick={() => setShowAdd(true)}><Plus size={13} /> Add your first ballot</Btn>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Match", "Club", "Opens", "Closes", "Applications", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ballots.map((b, i) => {
                const s = STATUS_MAP[b.status] || STATUS_MAP.open;
                const pct = b.total > 0 ? Math.round((b.applied / b.total) * 100) : 0;
                return (
                  <tr key={b.id} style={{ borderBottom: i < ballots.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{b.match}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#94a3b8" }}>{b.club}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748b" }}>{b.open_date || "—"}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: b.status === "closing_soon" ? "#eab308" : "#64748b" }}>{b.close_date || "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 70, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: pct >= 90 ? "#22c55e" : pct >= 50 ? "#3b82f6" : "#64748b" }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{b.applied}/{b.total}</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}><Badge label={s.label} color={s.color} /></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => { setFormError(""); setEditTarget(b); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(b)} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <Modal title="Add Ballot" onClose={() => setShowAdd(false)} width={560}>
        <BallotForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} error={formError} />
      </Modal>}
      {editTarget && <Modal title={`Edit — ${editTarget.match}`} onClose={() => setEditTarget(null)} width={560}>
        <BallotForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} error={formError} />
      </Modal>}
      {deleteTarget && <DeleteModal item={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />}
    </div>
  );
}
