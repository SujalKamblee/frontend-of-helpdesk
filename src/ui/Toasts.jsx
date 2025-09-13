import React, { useCallback, useRef, useState } from "react";

export function useToasts() {
const [toasts, setToasts] = useState([]);
const idRef = useRef(1);
const pushToast = useCallback((t) => {
const id = idRef.current++;
const toast = { id, type: t.type || "info", message: t.message || "" };
setToasts((prev) => [...prev, toast]);
setTimeout(() => {
setToasts((prev) => prev.filter(x => x.id !== id));
}, 3000);
}, []);
const removeToast = useCallback((id) => {
setToasts((prev) => prev.filter(x => x.id !== id));
}, []);
return { toasts, pushToast, removeToast };
}

export default function Toasts({ items, onClose }) {
return (
<div className="toasts">
{items.map(t => (
<div key={t.id} className={"toast " + t.type + " slide-up"}>
<div className="toast-dot" />
<div className="toast-msg">{t.message}</div>
<button className="icon-btn" onClick={() => onClose(t.id)}>✕</button>
</div>
))}
</div>
);
}