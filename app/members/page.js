"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Btn from "@/components/Btn";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import FormField, { inp } from "@/components/FormField";
import { Users, UserCheck, UserX, Upload, Search, Plus, Pencil, Trash2, Eye, EyeOff, AlertTriangle, RefreshCw } from "lucide-react";

const CLUBS = ["Arsenal FC", "Man City", "Chelsea FC", "Liverpool FC", "Tottenham", "Man United"];
const STATUSES = ["eligible", "inactive", "do_not_use"];
const STATUS_MAP = {
  eligible:   { label: "Eligible",    color: "green" },
  inactive:   { label: "Inactive",    color: "gray"  },
  do_not_use: { label: "Do Not Use",  color: "red"   },
};
const CLUB_META = {
  "Arsenal FC":   { short: "ARS", color: "#ef4444" },
  "Man City":     { short: "MCI", color: "#3b82f6" },
  "Chelsea FC":   { short: "CHE", color: "#1d4ed8" },
  "Liverpool FC": { short: "LIV", color: "#dc2626" },
  "Tottenham":    { short: "TOT", color: "#94a3b8" },
  "Man United":   { short: "MUN", color: "#b91c1c" },
};
const VPS_SYNC_URL = "/api/sync";
const BLANK = { name: "", email: "", password: "", membership: "", club: "", points: 0, status: "inactive" };


function ChelseaSyncBtn({ member, onSynced }) {
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  if (member.club !== "Chelsea FC") return null;
  const handleSync = async () => {
    if (!member.email) { setStatus("err"); setMsg("No email"); return; }
    setStatus("syncing"); setMsg("");
    try {
      const res = await fetch(VPS_SYNC_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: member.email, member_id: member.id }) });
      const data = await res.json();
      if (data.success) { setStatus("ok"); setMsg((data.member?.points ?? "?") + " pts"); onSynced(); }
      else { setStatus("err"); setMsg(data.error || "Failed"); }
    } catch { setStatus("err"); setMsg("VPS unreachable"); }
    setTimeout(() => setStatus("idle"), 4000);
  };
  const col = { idle: "#1d4ed8", syncing: "#475569", ok: "#22c55e", err: "#ef4444" };
  const lbl = { idle: "Sync", syncing: "…", ok: msg, err: msg || "Err" };
  return (
    <button onClick={handleSync} disabled={status === "syncing"} title="Sync Chelsea points" style={{ background: col[status] + "18", border: "1px solid " + col[status] + "40", borderRadius: 6, padding: "5px 8px", cursor: status === "syncing" ? "default" : "pointer", color: col[status], display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      <RefreshCw size={11} style={{ animation: status === "syncing" ? "spin 1s linear infinite" : "none" }} />
      {lbl[status]}
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </button>
  );
}

/* ── Member form (shared by Add + Edit) ── */
function MemberForm({ initial, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState(initial || BLANK);
  const [showPass, setShowPass] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Name" required>
          <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />
        </FormField>
        <FormField label="Email">
          <input style={inp} value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@example.com" type="email" />
        </FormField>
        <FormField label="Account Password">
          <div style={{ position: "relative" }}>
            <input style={{ ...inp, paddingRight: 36 }} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Club login password" type={showPass ? "text" : "password"} />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}>
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormField>
        <FormField label="Membership Number">
          <input style={inp} value={form.membership} onChange={e => set("membership", e.target.value)} placeholder="ARS-10042" />
        </FormField>
        <FormField label="Club">
          <select style={{ ...inp, cursor: "pointer" }} value={form.club} onChange={e => set("club", e.target.value)}>
            <option value="">Select club...</option>
            {CLUBS.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Loyalty Points">
          <input style={inp} value={form.points} onChange={e => set("points", parseInt(e.target.value) || 0)} type="number" min="0" />
        </FormField>
      </div>

      <FormField label="Status">
        <div style={{ display: "flex", gap: 8 }}>
          {STATUSES.map(s => (
            <button key={s} type="button" onClick={() => set("status", s)} style={{
              flex: 1, padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 12,
              border: `1px solid ${form.status === s ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              background: form.status === s ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
              color: form.status === s ? "#3b82f6" : "#64748b",
              fontWeight: form.status === s ? 600 : 400,
            }}>{STATUS_MAP[s].label}</button>
          ))}
        </div>
      </FormField>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "8px 12px", fontSize: 12, color: "#ef4444" }}>{error}</div>}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSave(form)} disabled={!form.name.trim() || saving}>
          {saving ? "Saving…" : "Save Member"}
        </Btn>
      </div>
    </div>
  );
}

/* ── CSV Import ── */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
    return {
      name: obj.name || "",
      email: obj.email || "",
      password: obj.password || "",
      membership: obj.membership || obj.membership_number || "",
      club: obj.club || "",
      points: parseInt(obj.points || obj.loyalty_points) || 0,
      status: obj.status || "inactive",
    };
  }).filter(r => r.name);
}

function CSVModal({ onClose, onImport }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const fileRef = useRef();

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = parseCSV(ev.target.result);
        if (!parsed.length) { setError("No valid rows found. Ensure headers: name, email, password, membership, club, points, status"); return; }
        setRows(parsed); setError("");
      } catch { setError("Failed to parse CSV. Check format."); }
    };
    reader.readAsText(file);
  };

  const doImport = async () => {
    setImporting(true);
    await onImport(rows);
    setImporting(false);
    onClose();
  };

  return (
    <Modal title="Import Members via CSV" onClose={onClose} width={680}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          CSV must have headers: <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>name, email, password, membership, club, points, status</code>
        </p>
        <div style={{ border: "2px dashed rgba(59,130,246,0.3)", borderRadius: 10, padding: "28px", textAlign: "center", cursor: "pointer", background: "rgba(59,130,246,0.04)" }}
          onClick={() => fileRef.current.click()}>
          <Upload size={24} color="#3b82f6" style={{ margin: "0 auto 10px" }} />
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Click to upload CSV file</div>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{error}</div>}
      </div>

      {rows.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 10, fontWeight: 600 }}>✓ {rows.length} members ready to import</div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", maxHeight: 240, overflowY: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Name", "Email", "Membership", "Club", "Points", "Status"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "6px 10px", color: "#f1f5f9" }}>{r.name}</td>
                    <td style={{ padding: "6px 10px", color: "#64748b" }}>{r.email}</td>
                    <td style={{ padding: "6px 10px", color: "#94a3b8" }}>{r.membership}</td>
                    <td style={{ padding: "6px 10px", color: "#94a3b8" }}>{r.club}</td>
                    <td style={{ padding: "6px 10px", color: "#94a3b8" }}>{r.points}</td>
                    <td style={{ padding: "6px 10px" }}><Badge label={r.status} color={STATUS_MAP[r.status]?.color || "gray"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={doImport} disabled={importing}>{importing ? "Importing…" : `Import ${rows.length} Members`}</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ── Delete confirm ── */
function DeleteModal({ member, onClose, onConfirm, deleting }) {
  return (
    <Modal title="Delete Member" onClose={onClose} width={420}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "#f1f5f9" }}>{member.name}</strong>? This cannot be undone.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} disabled={deleting}>{deleting ? "Deleting…" : "Delete Member"}</Btn>
      </div>
    </Modal>
  );
}

/* ── Password cell ── */
function PassCell({ value }) {
  const [show, setShow] = useState(false);
  if (!value) return <span style={{ color: "#334155" }}>—</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, fontFamily: "monospace", color: "#94a3b8" }}>{show ? value : "••••••••"}</span>
      <button onClick={() => setShow(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}>
        {show ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
    </div>
  );
}

/* ── Main page ── */
export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showCSV, setShowCSV] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    setMembers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("members").insert([form]);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch();
    setSaving(false); setShowAdd(false);
  };

  const handleEdit = async (form) => {
    setSaving(true); setFormError("");
    const { error } = await supabase.from("members").update(form).eq("id", editTarget.id);
    if (error) { setFormError(error.message); setSaving(false); return; }
    await fetch();
    setSaving(false); setEditTarget(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("members").delete().eq("id", deleteTarget.id);
    await fetch();
    setDeleting(false); setDeleteTarget(null);
  };

  const handleImport = async (rows) => {
    await supabase.from("members").insert(rows);
    await fetch();
  };

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.membership?.toLowerCase().includes(q);
    const matchClub = clubFilter === "All" || m.club === clubFilter;
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchClub && matchStatus;
  });

  const eligible = members.filter(m => m.status === "eligible").length;
  const dnu = members.filter(m => m.status === "do_not_use").length;

  const clubCounts = CLUBS.map(c => ({ name: c, count: members.filter(m => m.club === c).length, ...CLUB_META[c] }));

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1280 }}>
      <PageHeader
        title="Members"
        subtitle={`${members.length} total members across all clubs`}
        actions={<>
          <Btn variant="secondary" size="sm" onClick={() => setShowCSV(true)}><Upload size={13} /> Import CSV</Btn>
          <Btn size="sm" onClick={() => { setFormError(""); setShowAdd(true); }}><Plus size={13} /> Add Member</Btn>
        </>}
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Members" value={members.length} icon={Users} color="#3b82f6" />
        <StatCard label="Eligible Members" value={eligible} icon={UserCheck} color="#22c55e" sub={members.length ? `${Math.round(eligible / members.length * 100)}% of total` : "—"} />
        <StatCard label="Do Not Use" value={dnu} icon={UserX} color="#ef4444" />
      </div>

      {/* Club grid */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Filter by Club</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setClubFilter("All")} style={{
            padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${clubFilter === "All" ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
            background: clubFilter === "All" ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
            color: clubFilter === "All" ? "#3b82f6" : "#64748b",
          }}>All ({members.length})</button>
          {clubCounts.map(c => (
            <button key={c.name} onClick={() => setClubFilter(clubFilter === c.name ? "All" : c.name)} style={{
              padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: `1px solid ${clubFilter === c.name ? c.color + "50" : "rgba(255,255,255,0.07)"}`,
              background: clubFilter === c.name ? `${c.color}14` : "rgba(255,255,255,0.02)",
              color: clubFilter === c.name ? c.color : "#64748b",
            }}>{c.name} ({c.count})</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <Search size={13} color="#64748b" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, membership…"
              style={{ ...inp, paddingLeft: 32, fontSize: 12 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", color: "#94a3b8", fontSize: 12, outline: "none", cursor: "pointer" }}>
            <option value="All">All Statuses</option>
            <option value="eligible">Eligible</option>
            <option value="inactive">Inactive</option>
            <option value="do_not_use">Do Not Use</option>
          </select>
          <span style={{ fontSize: 12, color: "#475569", marginLeft: "auto" }}>{filtered.length} members</span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#475569", fontSize: 13 }}>Loading members…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#475569", fontSize: 13 }}>
            {members.length === 0 ? "No members yet — add your first member or import a CSV." : "No members match the current filters."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Member", "Email", "Password", "Membership #", "Club", "Points", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const s = STATUS_MAP[m.status] || STATUS_MAP.inactive;
                const cm = CLUB_META[m.club];
                return (
                  <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {m.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#64748b" }}>{m.email || "—"}</td>
                    <td style={{ padding: "11px 16px" }}><PassCell value={m.password} /></td>
                    <td style={{ padding: "11px 16px", fontSize: 12, fontFamily: "monospace", color: "#94a3b8" }}>{m.membership || "—"}</td>
                    <td style={{ padding: "11px 16px" }}>
                      {m.club ? (
                        <span style={{ fontSize: 12, color: cm?.color || "#94a3b8", fontWeight: 600 }}>{m.club}</span>
                      ) : <span style={{ color: "#334155" }}>—</span>}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                          <div style={{ width: `${Math.min(100, ((m.points || 0) / 50) * 100)}%`, height: "100%", background: "#3b82f6", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.points || 0}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}><Badge label={s.label} color={s.color} /></td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <ChelseaSyncBtn member={m} onSynced={fetch} />
                        <button onClick={() => { setFormError(""); setEditTarget(m); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(m)} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
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

      {/* Modals */}
      {showAdd && (
        <Modal title="Add New Member" onClose={() => setShowAdd(false)}>
          <MemberForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} error={formError} />
        </Modal>
      )}
      {editTarget && (
        <Modal title={`Edit — ${editTarget.name}`} onClose={() => setEditTarget(null)}>
          <MemberForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} error={formError} />
        </Modal>
      )}
      {deleteTarget && (
        <DeleteModal member={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />
      )}
      {showCSV && <CSVModal onClose={() => setShowCSV(false)} onImport={handleImport} />}
    </div>
  );
}
