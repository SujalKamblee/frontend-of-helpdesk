import React from "react";

export default function AdminTopicsTable({ topics, onEdit, onDelete }) {
return (
<div className="panel">
<h4>Help Topics</h4>
{(!topics || topics.length === 0) ? (
<div className="muted">No topics yet.</div>
) : (
<table className="table">
<thead>
<tr>
<th style={{width: "40%"}}>Title</th>
<th>Keywords</th>
<th style={{width: 160}}>Actions</th>
</tr>
</thead>
<tbody>
{topics.map(t => (
<tr key={t.id}>
<td>{t.title}</td>
<td>{t.keywords}</td>
<td>
<button onClick={() => onEdit(t)}>Edit</button>
<button onClick={() => onDelete(t.id)} style={{marginLeft: 8}}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
}