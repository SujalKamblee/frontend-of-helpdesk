import React, { useEffect, useMemo, useState } from "react";
import AdminLogin from "../components/AdminLogin.jsx";
import { api } from "../lib/api.js";
import { getToken, setToken, clearToken } from "../lib/auth.js";

function StepRow({ step, index, onChange, onRemove }) {
return (
<div className="adm-step-row fade-in-up" style={{ animationDelay: `${index * 70}ms` }}>
<span className="badge">{index + 1}</span>
<input
className="adm-input"
value={step.stepText}
onChange={(e) => onChange(index, { ...step, stepText: e.target.value })}
placeholder={`Step ${index + 1} text`}
/>
<button className="icon-btn" type="button" onClick={() => onRemove(index)} title="Remove step">✕</button>
</div>
);
}

function Drawer({ open, title, children, onClose }) {
return (
<div className={"drawer " + (open ? "open" : "")} aria-hidden={!open}>
<div className="drawer-backdrop" onClick={onClose} />
<aside className="drawer-panel slide-left">
<div className="drawer-head">
<h4>{title}</h4>
<button className="icon-btn" onClick={onClose}>✕</button>
</div>
<div className="drawer-body">{children}</div>
</aside>
</div>
);
}

function EmptyState({ onCreate }) {
return (
<div className="empty-state">
<div className="empty-icon">📄</div>
<div className="empty-title">No topics yet</div>
<div className="empty-sub">Create your first help topic to get started.</div>
<button className="primary" onClick={onCreate}>+ New Topic</button>
</div>
);
}

import Skeleton from "../ui/Skeleton.jsx";
import Toasts, { useToasts } from "../ui/Toasts.jsx";

export default function AdminPage() {
const [token, setTok] = useState(getToken());
const [topics, setTopics] = useState([]);
const [loading, setLoading] = useState(true);
const [drawerOpen, setDrawerOpen] = useState(false);
const [editing, setEditing] = useState(null);
const [form, setForm] = useState({ title: "", keywords: "", steps: [{ stepOrder: 1, stepText: "" }] });
const [query, setQuery] = useState("");
const [sortBy, setSortBy] = useState({ key: "title", dir: "asc" });
const { toasts, pushToast, removeToast } = useToasts();

const refresh = async () => {
if (!token) return;
setLoading(true);
try {
const data = await api.adminListTopics(token);
setTopics(Array.isArray(data) ? data : []);
} catch (e) {
if (String(e).includes("401")) { clearToken(); setTok(null); }
pushToast({ type: "error", message: String(e) });
} finally {
setLoading(false);
}
};

useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [token]);

// Derived view: filter + sort
const filtered = useMemo(() => {
const q = query.trim().toLowerCase();
let list = topics.slice();
if (q) {
list = list.filter(t =>
(t.title || "").toLowerCase().includes(q) ||
(t.keywords || "").toLowerCase().includes(q)
);
}
list.sort((a, b) => {
const ka = (a[sortBy.key] || "").toString().toLowerCase();
const kb = (b[sortBy.key] || "").toString().toLowerCase();
if (ka < kb) return sortBy.dir === "asc" ? -1 : 1;
if (ka > kb) return sortBy.dir === "asc" ? 1 : -1;
return 0;
});
return list;
}, [topics, query, sortBy]);

const openCreate = () => {
setEditing(null);
setForm({ title: "", keywords: "", steps: [{ stepOrder: 1, stepText: "" }] });
setDrawerOpen(true);
};

const openEdit = (t) => {
const steps = (t.steps || []).slice().sort((a, b) => a.stepOrder - b.stepOrder);
setEditing(t);
setForm({ title: t.title || "", keywords: t.keywords || "", steps: steps.length ? steps : [{ stepOrder: 1, stepText: "" }] });
setDrawerOpen(true);
};

const addStep = () => {
setForm(f => ({ ...f, steps: [...f.steps, { stepOrder: f.steps.length + 1, stepText: "" }] }));
};
const updateStep = (i, next) => {
setForm(f => {
const s = f.steps.slice();
s[i] = next;
return { ...f, steps: s };
});
};
const removeStep = (i) => {
setForm(f => {
const s = f.steps.slice(); s.splice(i, 1);
const renum = s.map((x, idx) => ({ ...x, stepOrder: idx + 1 }));
return { ...f, steps: renum.length ? renum : [{ stepOrder: 1, stepText: "" }] };
});
};

const save = async (e) => {
e.preventDefault();
const payload = { ...form, steps: form.steps.map((s, i) => ({ stepOrder: i + 1, stepText: s.stepText })) };
try {
if (editing) {
await api.adminUpdateTopic(token, editing.id, payload);
pushToast({ type: "success", message: "Topic updated" });
} else {
await api.adminCreateTopic(token, payload);
pushToast({ type: "success", message: "Topic created" });
}
setDrawerOpen(false);
await refresh();
} catch (err) {
pushToast({ type: "error", message: String(err) });
}
};

const del = async (id) => {
// Optimistic UI: remove first, rollback if fails
const prev = topics;
setTopics(t => t.filter(x => x.id !== id));
try {
await api.adminDeleteTopic(token, id);
pushToast({ type: "success", message: "Topic deleted" });
} catch (err) {
setTopics(prev);
pushToast({ type: "error", message: String(err) });
}
};

const SortHeader = ({ label, keyName }) => (
<button
className={"th-sort " + (sortBy.key === keyName ? "active" : "")}
onClick={() =>
setSortBy(s => ({ key: keyName, dir: s.key === keyName && s.dir === "asc" ? "desc" : "asc" }))
}
title="Sort"
type="button"
>
{label}
{sortBy.key === keyName ? <span className={"sort-caret " + sortBy.dir} /> : <span className="sort-caret" />}
</button>
);

const onLogin = (t) => { setTok(t); setToken(t); pushToast({ type: "success", message: "Logged in" }); };
const onLogout = () => { clearToken(); setTok(null); pushToast({ type: "success", message: "Logged out" }); };

return (
<section className="admin-shell">
<div className="aurora-soft" />
<div className="adm-header">
  <div className="adm-header-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    <h4>Admin Panel</h4>
  </div>
  {token && <button className="secondary" onClick={onLogout}>Logout</button>}
</div>

  {!token ? (
    <div className="panel glass">
      <AdminLogin onToken={onLogin} />
    </div>
  ) : (
    <>
      <div className="panel glass">
        <div className="adm-toolbar">
          <input
            className="adm-search"
            placeholder="Search topics by title or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="primary" onClick={openCreate}>+ New Topic</button>
        </div>

        {loading ? (
          <div className="skeleton-wrap">
            <Skeleton rows={6} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onCreate={openCreate} />
        ) : (
          <div className="table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: "44%" }}><SortHeader label="Title" keyName="title" /></th>
                  <th><SortHeader label="Keywords" keyName="keywords" /></th>
                  <th style={{ width: 170 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className="row-fade" style={{ animationDelay: `${i * 40}ms` }}>
                    <td>{t.title}</td>
                    <td className="muted">{t.keywords}</td>
                    <td>
                      <button onClick={() => openEdit(t)}>Edit</button>
                      <button className="danger" onClick={() => del(t.id)} style={{ marginLeft: 8 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        title={editing ? "Edit Topic" : "Create Topic"}
        onClose={() => setDrawerOpen(false)}
      >
        <form onSubmit={save} className="adm-form">
          <label>Title</label>
          <input
            className="adm-input"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g., How to reset password"
            required
          />

          <label>Keywords (comma-separated)</label>
          <input
            className="adm-input"
            value={form.keywords}
            onChange={(e) => setForm(f => ({ ...f, keywords: e.target.value }))}
            placeholder="password, reset, forgot"
          />

          <label>Steps</label>
          <div className="adm-steps">
            {form.steps.map((s, i) => (
              <StepRow
                key={i}
                step={s}
                index={i}
                onChange={updateStep}
                onRemove={removeStep}
              />
            ))}
            <div className="row">
              <button type="button" onClick={addStep}>+ Add Step</button>
              <button className="primary" type="submit">{editing ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setDrawerOpen(false)}>Cancel</button>
            </div>
          </div>
        </form>
      </Drawer>
    </>
  )}

  <Toasts items={toasts} onClose={removeToast} />
</section>
);
}