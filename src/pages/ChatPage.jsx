import React, { useEffect, useRef, useState } from "react";
import ChatTopicSteps from "../components/ChatTopicSteps.jsx";
import { api } from "../lib/api.js";

export default function ChatPage() {
const [topics, setTopics] = useState([]);
const [selected, setSelected] = useState(null);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const heroRef = useRef(null);

useEffect(() => {
let mounted = true;
(async () => {
try {
const all = await api.listTopics();
if (mounted) setTopics(Array.isArray(all) ? all : []);
} catch (e) { console.error(e); }
})();
return () => { mounted = false; };
}, []);

const suggestions = [
"How to reset password",
"How to apply leave",
"Where to find dashboard"
];

const findMatch = (q) => {
const query = (q || "").toLowerCase().trim();
if (!query) return null;
return (
topics.find(t => (t.title || "").toLowerCase().includes(query)) ||
topics.find(t => (t.keywords || "").toLowerCase().includes(query))
);
};

const openTopic = async (t) => {
try {
const full = await api.getTopic(t.id);
setSelected(full);
requestAnimationFrame(() => {
heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
});
} catch {
alert("Could not load steps. Please try again.");
}
};

const onSuggestion = async (label) => {
const match = findMatch(label);
if (!match) return alert("Topic not found. Add it in Admin.");
await openTopic(match);
};

const submit = async (e) => {
e.preventDefault();
if (!input.trim()) return;
setLoading(true);
try {
const match = findMatch(input);
if (!match) {
alert("No matching guide. Try keywords like 'password' or 'leave'.");
} else {
await openTopic(match);
}
} finally {
setLoading(false);
}
};

const goBack = () => {
setSelected(null);
setInput("");
requestAnimationFrame(() => {
heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
});
};

return (
<section className="chat-shell">
<div className="chat-hero" ref={heroRef}>
<div className="aurora-bg" />
<div className="chat-title glow-text">How can I help?</div>


    <form className={"chat-bar" + (loading ? " busy" : "")} onSubmit={submit}>
      <input
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask anything… e.g., "reset password"'
      />
      <button className="chat-send" type="submit" disabled={loading}>
        {loading ? "…" : "Search"}
      </button>
    </form>

    <div className="chips">
      {suggestions.map((s, i) => (
        <button key={i} className="chip pulse" onClick={() => onSuggestion(s)}>{s}</button>
      ))}
    </div>
  </div>

  {selected && (
    <div className="chat-result slide-up">
      <div className="assistant-card glass">
        <ChatTopicSteps topic={selected} onBack={goBack} />
      </div>
    </div>
  )}
</section>
);
}