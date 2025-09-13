import React, { useState, useEffect } from "react";

export default function AdminTopicForm({ mode = "create", initial, onSubmit, onCancel }) {
const [title, setTitle] = useState("");
const [keywords, setKeywords] = useState("");
const [steps, setSteps] = useState([{ stepOrder: 1, stepText: "" }]);

useEffect(() => {
if (initial) {
setTitle(initial.title || "");
setKeywords(initial.keywords || "");
const s = (initial.steps || []).slice().sort((a,b)=>a.stepOrder-b.stepOrder);
setSteps(s.length ? s : [{ stepOrder: 1, stepText: "" }]);
} else {
setTitle("");
setKeywords("");
setSteps([{ stepOrder: 1, stepText: "" }]);
}
}, [initial]);

const addStep = () => {
setSteps(prev => [...prev, { stepOrder: prev.length + 1, stepText: "" }]);
};

const updateStep = (i, field, val) => {
const next = steps.slice();
if (field === "order") next[i].stepOrder = Number(val) || 1;
if (field === "text") next[i].stepText = val;
setSteps(next);
};

const removeStep = (i) => {
const next = steps.slice();
next.splice(i, 1);
// Re-number stepOrder
const renum = next.map((s, idx) => ({ ...s, stepOrder: idx + 1 }));
setSteps(renum.length ? renum : [{ stepOrder: 1, stepText: "" }]);
};

const submit = (e) => {
e.preventDefault();
onSubmit({ title, keywords, steps });
};

return (
<div className="panel">
<h4>{mode === "edit" ? "Edit Topic" : "Create Topic"}</h4>
<form className="form" onSubmit={submit}>
<label>Title</label>
<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., How to reset password" />

text
    <label>Keywords (comma-separated)</label>
    <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="password, reset, forgot" />

    <label>Steps</label>
    {steps.map((s, i) => (
      <div className="step-row" key={i}>
        <input
          className="order-input"
          type="number"
          min="1"
          value={s.stepOrder}
          onChange={(e) => updateStep(i, "order", e.target.value)}
          title="Order"
        />
        <input
          className="step-input"
          value={s.stepText}
          onChange={(e) => updateStep(i, "text", e.target.value)}
          placeholder={`Step ${i + 1} text`}
        />
        <button type="button" onClick={() => removeStep(i)}>✕</button>
      </div>
    ))}
    <div className="row">
      <button type="button" onClick={addStep}>+ Add Step</button>
      <button className="primary" type="submit">{mode === "edit" ? "Update" : "Create"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </div>
  </form>
</div>
);
}