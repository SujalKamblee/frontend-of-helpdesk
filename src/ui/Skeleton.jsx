import React from "react";

export default function Skeleton({ rows = 5 }) {
return (
<div className="skeleton">
{Array.from({ length: rows }).map((_, i) => (
<div key={i} className="sk-row" style={{ animationDelay: `${i * 80}ms` }} />
))}
</div>
);
}