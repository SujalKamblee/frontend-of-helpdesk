import React from "react";

export default function ChatTopicSteps({ topic, onBack }) {
const steps = (topic.steps || []).slice().sort((a, b) => a.stepOrder - b.stepOrder);

return (
<div className="steps-wrap">
{/* Header row with Back button on the left.
To move Back to the right: replace 'steps-head left' with 'steps-head right' */}
<div className="steps-head left">
<button className="link back-btn" onClick={onBack} aria-label="Go back">
⬅ Back
</button>
<h3 className="steps-title">{topic.title}</h3>
</div>

  {steps.length > 0 ? (
    <ol className="steps-list">
      {steps.map((s, idx) => (
        <li
          key={s.id ?? s.stepOrder}
          className="step-item fade-in-up"
          style={{ animationDelay: `${Math.min(idx, 12) * 90}ms` }} /* stagger */
        >
          <span className="step-index">{s.stepOrder}</span>
          <span className="step-text">{s.stepText}</span>
        </li>
      ))}
    </ol>
  ) : (
    <div className="muted">No steps available.</div>
  )}
</div>
);
}